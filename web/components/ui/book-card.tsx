"use client";

import React from "react";
import Image from "next/image";
import { ShoppingCart, Eye, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookCardProps {
  book: {
    id: string;
    title: string;
    author: string;
    price: number;
    coverUrl?: string;
    description?: string;
    rating?: number;
    readingTime?: string;
    category?: string;
    isPurchased?: boolean;
    readingProgress?: number; // 0-100
  };
  onPurchase?: (bookId: string) => void;
  onRead?: (bookId: string) => void;
  onPreview?: (bookId: string) => void;
}

export function BookCard({ book, onPurchase, onRead, onPreview }: BookCardProps) {
  const {
    id,
    title,
    author,
    price,
    coverUrl,
    description,
    rating,
    readingTime,
    category,
    isPurchased,
    readingProgress
  } = book;

  return (
    <div className="group relative bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-accent/50">
      {/* Book Cover */}
      <div className="relative aspect-[3/4] bg-muted overflow-hidden">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={`${title} cover`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900">
            <div className="text-center p-4">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-indigo-200 dark:bg-indigo-800 flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="text-xs text-muted-foreground font-medium">{title}</p>
            </div>
          </div>
        )}
        
        {/* Category Badge */}
        {category && (
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent/90 text-accent-foreground">
              {category}
            </span>
          </div>
        )}
        
        {/* Reading Progress for Purchased Books */}
        {isPurchased && readingProgress !== undefined && readingProgress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
            <div 
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${readingProgress}%` }}
            />
          </div>
        )}
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 hover:bg-white text-black"
              onClick={() => onPreview?.(id)}
            >
              <Eye className="w-4 h-4" />
            </Button>
            {isPurchased && (
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => onRead?.(id)}
              >
                Read
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Book Info */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-sm line-clamp-2 text-foreground group-hover:text-accent transition-colors">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">{author}</p>
        </div>
        
        {/* Rating and Reading Time */}
        <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
          {rating && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>{rating.toFixed(1)}</span>
            </div>
          )}
          {readingTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{readingTime}</span>
            </div>
          )}
        </div>
        
        {/* Description */}
        {description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {description}
          </p>
        )}
        
        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground">
              ${price.toFixed(2)}
            </span>
            {isPurchased && (
              <span className="text-xs text-green-600 font-medium">Purchased</span>
            )}
          </div>
          
          {isPurchased ? (
            <Button
              size="sm"
              onClick={() => onRead?.(id)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {readingProgress && readingProgress > 0 ? 'Continue' : 'Read'}
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => onPurchase?.(id)}
              className="gap-1"
            >
              <ShoppingCart className="w-3 h-3" />
              Buy
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}