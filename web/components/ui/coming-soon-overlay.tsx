"use client";

import React from 'react';

interface ComingSoonOverlayProps {
  children: React.ReactNode;
}

export function ComingSoonOverlay({ children }: ComingSoonOverlayProps) {
  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            Coming Soon!
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            This feature is under development
          </p>
        </div>
      </div>
    </div>
  );
}