"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, BookOpen, ShoppingBag, User } from "lucide-react";
import { Header } from "@/components/layout/header";
import { BookCard } from "@/components/ui/book-card";
import { BookReader } from "@/components/ui/book-reader";
import { PurchaseModal } from "@/components/ui/purchase-modal";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/ui/i18n-provider";
import { ComingSoonOverlay } from "@/components/ui/coming-soon-overlay";

// Sample book data - in a real app, this would come from your database
const SAMPLE_BOOKS = [
  {
    id: "1",
    title: "Faith and Purpose: A Christian's Guide to Living",
    author: "Pastor John Smith",
    price: 19.99,
    coverUrl: "/hero/church-1.jpg",
    description: "Discover your divine purpose and strengthen your faith with practical guidance for everyday Christian living.",
    rating: 4.8,
    readingTime: "3-4 hours",
    category: "Faith",
    content: [
      "<h1>Chapter 1: Understanding Your Purpose</h1><p>Every believer has a unique calling and purpose in God's kingdom. This chapter explores how to discover and embrace the path God has laid out for your life...</p><p>Through prayer, scripture study, and spiritual discernment, we can begin to understand the specific ways God wants to use us to further His kingdom and bless others.</p>",
      "<h1>Chapter 2: Walking in Faith</h1><p>Faith is not just a belief system, but a way of life that transforms how we approach every situation. When we truly walk in faith, we begin to see the world through God's eyes...</p><p>This chapter provides practical steps for developing unwavering faith that can move mountains and overcome any obstacle.</p>",
      "<h1>Chapter 3: Prayer and Communion</h1><p>Prayer is our direct line of communication with the Creator of the universe. It's not just about asking for things, but about building a relationship with God...</p><p>Learn how to develop a meaningful prayer life that brings you closer to God and aligns your heart with His will.</p>"
    ],
    totalPages: 3
  },
  {
    id: "2",
    title: "The Power of Worship",
    author: "Sarah Johnson",
    price: 15.99,
    description: "Explore the transformative power of worship and how it can change your life and community.",
    rating: 4.6,
    readingTime: "2-3 hours",
    category: "Worship",
    content: [
      "<h1>Introduction: What is True Worship?</h1><p>Worship is more than singing songs on Sunday morning. It's a lifestyle of honoring God with every aspect of our lives...</p>",
      "<h1>Chapter 1: The Heart of Worship</h1><p>True worship begins in the heart. When we understand who God is and what He has done for us, worship becomes a natural response...</p>"
    ],
    totalPages: 2
  },
  {
    id: "3",
    title: "Biblical Leadership Principles",
    author: "Dr. Michael Brown",
    price: 24.99,
    description: "Learn timeless leadership principles from biblical figures and apply them to modern ministry and life.",
    rating: 4.9,
    readingTime: "4-5 hours",
    category: "Leadership",
    content: [
      "<h1>Introduction: Leadership God's Way</h1><p>Biblical leadership is fundamentally different from worldly leadership. It's about serving others and following God's example...</p>"
    ],
    totalPages: 1
  },
  {
    id: "4",
    title: "Grace and Forgiveness",
    author: "Rev. Mary Williams",
    price: 17.99,
    description: "Understanding God's grace and learning to extend forgiveness to others and ourselves.",
    rating: 4.7,
    readingTime: "3 hours",
    category: "Grace",
    content: [
      "<h1>Chapter 1: Understanding Grace</h1><p>Grace is God's unmerited favor toward us. It's not something we can earn or deserve, but a gift freely given...</p>"
    ],
    totalPages: 1
  },
  {
    id: "5",
    title: "Prayer Warriors Handbook",
    author: "Pastor David Lee",
    price: 21.99,
    description: "A comprehensive guide to effective prayer and spiritual warfare.",
    rating: 4.5,
    readingTime: "4 hours",
    category: "Prayer",
    content: [
      "<h1>Introduction: The Power of Prayer</h1><p>Prayer is our most powerful weapon in spiritual warfare. Through prayer, we can change circumstances, heal relationships, and transform lives...</p>"
    ],
    totalPages: 1
  },
  {
    id: "6",
    title: "Building Strong Families",
    author: "Dr. Lisa Thompson",
    price: 18.99,
    description: "Biblical principles for creating loving, strong, and godly families.",
    rating: 4.4,
    readingTime: "3-4 hours",
    category: "Family",
    content: [
      "<h1>Chapter 1: The Foundation of Family</h1><p>God designed the family as the basic unit of society. When families are strong and built on biblical principles, communities thrive...</p>"
    ],
    totalPages: 1
  }
];

const CATEGORIES = ["All", "Faith", "Worship", "Leadership", "Grace", "Prayer", "Family"];

export default function BookStorePage() {
  const { t } = useI18n();
  const [books, setBooks] = useState(SAMPLE_BOOKS);
  const [filteredBooks, setFilteredBooks] = useState(SAMPLE_BOOKS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [purchasedBooks, setPurchasedBooks] = useState<string[]>([]);
  const [readingProgress, setReadingProgress] = useState<Record<string, { page: number; progress: number }>>({});
  
  // Modal states
  const [selectedBookForPurchase, setSelectedBookForPurchase] = useState<typeof SAMPLE_BOOKS[0] | null>(null);
  const [selectedBookForReading, setSelectedBookForReading] = useState<typeof SAMPLE_BOOKS[0] | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);

  // Filter books based on search and category
  useEffect(() => {
    let filtered = books;
    
    if (searchQuery) {
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory !== "All") {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }
    
    setFilteredBooks(filtered);
  }, [books, searchQuery, selectedCategory]);

  const handlePurchase = (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    if (book) {
      setSelectedBookForPurchase(book);
    }
  };

  const handlePurchaseComplete = (bookId: string) => {
    setPurchasedBooks(prev => [...prev, bookId]);
    setSelectedBookForPurchase(null);
  };

  const handleRead = (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    if (book && purchasedBooks.includes(bookId)) {
      setSelectedBookForReading(book);
    }
  };

  const handleProgressUpdate = (bookId: string, page: number, progress: number) => {
    setReadingProgress(prev => ({
      ...prev,
      [bookId]: { page, progress }
    }));
  };

  const booksWithPurchaseStatus = filteredBooks.map(book => ({
    ...book,
    isPurchased: purchasedBooks.includes(book.id),
    readingProgress: readingProgress[book.id]?.progress || 0
  }));

  const purchasedBooksData = books.filter(book => purchasedBooks.includes(book.id)).map(book => ({
    ...book,
    isPurchased: true,
    readingProgress: readingProgress[book.id]?.progress || 0
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <ComingSoonOverlay>
        <main className="flex-1">
          {/* Hero Section */}
          <div className="bg-accent text-accent-foreground">
            <div className="mx-auto max-w-7xl px-6 py-16">
              <div className="text-center">
                <BookOpen className="w-16 h-16 mx-auto mb-6" />
                <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                  Church Book Store
                </h1>
                <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
                  Discover inspiring Christian books that will strengthen your faith and deepen your relationship with God
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    variant="secondary"
                    onClick={() => setShowLibrary(!showLibrary)}
                    className="gap-2"
                  >
                    <User className="w-5 h-5" />
                    My Library ({purchasedBooks.length})
                  </Button>
                  <Button size="lg" variant="outline" className="gap-2 border-accent-foreground/30 bg-accent-foreground/10 backdrop-blur-sm hover:bg-accent-foreground/20">
                    <ShoppingBag className="w-5 h-5" />
                    Browse Books
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-6 py-8">
            {/* Library Section */}
            {showLibrary && (
              <div className="mb-8 p-6 bg-card border border-border rounded-lg">
                <h2 className="text-2xl font-bold mb-4">My Library</h2>
                {purchasedBooksData.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {purchasedBooksData.map(book => (
                      <BookCard
                        key={book.id}
                        book={book}
                        onRead={handleRead}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No books in your library yet. Start browsing to purchase your first book!</p>
                  </div>
                )}
              </div>
            )}

            {/* Search and Filters */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search books, authors, or topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </Button>
              </div>

              {/* Category Filters */}
              {showFilters && (
                <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(category => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                          selectedCategory === category
                            ? "bg-primary text-primary-foreground"
                            : "bg-background border border-border hover:bg-muted"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Books Grid */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {selectedCategory === "All" ? "All Books" : `${selectedCategory} Books`}
                </h2>
                <span className="text-muted-foreground">
                  {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found
                </span>
              </div>

              {filteredBooks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {booksWithPurchaseStatus.map(book => (
                    <BookCard
                      key={book.id}
                      book={book}
                      onPurchase={handlePurchase}
                      onRead={handleRead}
                      onPreview={(bookId) => {
                        // For demo, just show the purchase modal
                        handlePurchase(bookId);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-2">No books found matching your criteria</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Purchase Modal */}
        {selectedBookForPurchase && (
          <PurchaseModal
            book={selectedBookForPurchase}
            isOpen={!!selectedBookForPurchase}
            onClose={() => setSelectedBookForPurchase(null)}
            onPurchaseComplete={handlePurchaseComplete}
          />
        )}

        {/* Book Reader */}
        {selectedBookForReading && (
          <BookReader
            book={selectedBookForReading}
            initialPage={readingProgress[selectedBookForReading.id]?.page || 0}
            onClose={() => setSelectedBookForReading(null)}
            onProgressUpdate={handleProgressUpdate}
          />
        )}
      </ComingSoonOverlay>
    </div>
  );
}