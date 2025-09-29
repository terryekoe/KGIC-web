'use client';

import { useState } from 'react';
import { X, Copy, Facebook, Twitter, Mail, MessageCircle, Check } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
  text?: string;
}

export function ShareModal({ isOpen, onClose, title, url, text }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareText = text || `Check out this prayer: ${title}`;
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(url);

  const shareOptions = [
    {
      name: 'Copy Link',
      icon: copied ? Check : Copy,
      action: async () => {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
      },
      className: copied ? 'bg-green-100 text-green-700 border-green-200' : 'hover:bg-muted'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      action: () => {
        window.open(`https://wa.me/?text=${encodedText}%20${encodedUrl}`, '_blank');
      },
      className: 'hover:bg-green-50 hover:text-green-700'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      action: () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`, '_blank');
      },
      className: 'hover:bg-blue-50 hover:text-blue-700'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
      },
      className: 'hover:bg-blue-50 hover:text-blue-700'
    },
    {
      name: 'Email',
      icon: Mail,
      action: () => {
        window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodedText}%20${encodedUrl}`, '_blank');
      },
      className: 'hover:bg-gray-50 hover:text-gray-700'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Share Prayer</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-sm text-muted-foreground mb-6">
          Share "{title}" with others
        </p>

        <div className="grid grid-cols-1 gap-3">
          {shareOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.name}
                onClick={option.action}
                className={`flex items-center gap-3 p-3 rounded-lg border border-border transition-colors ${option.className}`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{option.name}</span>
                {option.name === 'Copy Link' && copied && (
                  <span className="text-sm text-green-600 ml-auto">Copied!</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}