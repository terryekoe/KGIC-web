"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, BookOpen, Settings, Bookmark, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface BookReaderProps {
  book: {
    id: string;
    title: string;
    author: string;
    content: string[]; // Array of pages/chapters
    totalPages: number;
  };
  initialPage?: number;
  onClose: () => void;
  onProgressUpdate?: (bookId: string, page: number, progress: number) => void;
}

export function BookReader({ book, initialPage = 0, onClose, onProgressUpdate }: BookReaderProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [fontSize, setFontSize] = useState(16);
  const [showSettings, setShowSettings] = useState(false);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const progress = ((currentPage + 1) / book.totalPages) * 100;

  // Update reading progress
  useEffect(() => {
    onProgressUpdate?.(book.id, currentPage, progress);
  }, [book.id, currentPage, progress, onProgressUpdate]);

  const goToNextPage = () => {
    if (currentPage < book.totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const toggleBookmark = () => {
    setBookmarks(prev => 
      prev.includes(currentPage) 
        ? prev.filter(p => p !== currentPage)
        : [...prev, currentPage]
    );
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPreviousPage();
    if (e.key === 'ArrowRight') goToNextPage();
    if (e.key === 'Escape') onClose();
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [currentPage]);

  // Prevent body scroll when reader is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="font-semibold text-sm">{book.title}</h1>
            <p className="text-xs text-muted-foreground">{book.author}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
          >
            <Search className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleBookmark}
            className={bookmarks.includes(currentPage) ? "text-yellow-500" : ""}
          >
            <Bookmark className="w-4 h-4" fill={bookmarks.includes(currentPage) ? "currentColor" : "none"} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="p-4 border-b border-border bg-muted/50">
          <input
            type="text"
            placeholder="Search in book..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
            autoFocus
          />
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-4 border-b border-border bg-muted/50">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Font Size:</label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFontSize(Math.max(12, fontSize - 2))}
              >
                A-
              </Button>
              <span className="text-sm w-8 text-center">{fontSize}px</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFontSize(Math.min(24, fontSize + 2))}
              >
                A+
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="px-4 py-2 border-b border-border">
        <div className="flex items-center gap-4">
          <Progress value={progress} className="flex-1" />
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            Page {currentPage + 1} of {book.totalPages} ({Math.round(progress)}%)
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Navigation - Previous */}
        <div className="w-16 flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
            className="h-full w-full rounded-none"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </div>

        {/* Book Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-8">
            <div 
              className="prose prose-gray dark:prose-invert max-w-none leading-relaxed"
              style={{ fontSize: `${fontSize}px`, lineHeight: 1.7 }}
            >
              {book.content[currentPage] ? (
                <div dangerouslySetInnerHTML={{ __html: book.content[currentPage] }} />
              ) : (
                <div className="text-center py-20">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Page content not available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation - Next */}
        <div className="w-16 flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === book.totalPages - 1}
            className="h-full w-full rounded-none"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between p-4 border-t border-border bg-background/95 backdrop-blur-sm">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousPage}
          disabled={currentPage === 0}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Go to page:</span>
          <input
            type="number"
            min="1"
            max={book.totalPages}
            value={currentPage + 1}
            onChange={(e) => {
              const page = parseInt(e.target.value) - 1;
              if (page >= 0 && page < book.totalPages) {
                setCurrentPage(page);
              }
            }}
            className="w-16 px-2 py-1 text-sm rounded border border-border bg-background text-center"
          />
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={goToNextPage}
          disabled={currentPage === book.totalPages - 1}
          className="gap-2"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}