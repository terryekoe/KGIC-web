"use client";

import React, { useState } from "react";
import { X, CreditCard, Lock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface PurchaseModalProps {
  book: {
    id: string;
    title: string;
    author: string;
    price: number;
    coverUrl?: string;
    description?: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onPurchaseComplete: (bookId: string) => void;
}

export function PurchaseModal({ book, isOpen, onClose, onPurchaseComplete }: PurchaseModalProps) {
  const [step, setStep] = useState<'details' | 'payment' | 'processing' | 'success'>('details');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [formData, setFormData] = useState({
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    billingAddress: '',
    city: '',
    zipCode: '',
    country: ''
  });

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePurchase = async () => {
    setStep('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onPurchaseComplete(book.id);
        onClose();
        setStep('details'); // Reset for next time
      }, 2000);
    }, 2000);
  };

  const renderStepContent = () => {
    switch (step) {
      case 'details':
        return (
          <>
            <div className="flex gap-4 mb-6">
              <div className="w-20 h-28 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                {book.coverUrl ? (
                  <Image
                    src={book.coverUrl}
                    alt={book.title}
                    width={80}
                    height={112}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900">
                    <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{book.title}</h3>
                <p className="text-muted-foreground text-sm mb-2">{book.author}</p>
                <p className="text-2xl font-bold text-primary">${book.price.toFixed(2)}</p>
              </div>
            </div>
            
            {book.description && (
              <div className="mb-6">
                <h4 className="font-medium mb-2">About this book</h4>
                <p className="text-sm text-muted-foreground">{book.description}</p>
              </div>
            )}
            
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <h4 className="font-medium mb-2">What you'll get:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Instant access to the full book</li>
                <li>• Read online with our integrated reader</li>
                <li>• Bookmark and search functionality</li>
                <li>• Progress tracking across devices</li>
                <li>• Lifetime access to your purchase</li>
              </ul>
            </div>
            
            <Button onClick={() => setStep('payment')} className="w-full">
              Continue to Payment
            </Button>
          </>
        );
        
      case 'payment':
        return (
          <>
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-4">Payment Details</h3>
              
              {/* Payment Method Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Payment Method</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                      paymentMethod === 'card' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-sm font-medium">Credit Card</div>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('paypal')}
                    className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                      paymentMethod === 'paypal' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="w-5 h-5 mx-auto mb-1 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">P</div>
                    <div className="text-sm font-medium">PayPal</div>
                  </button>
                </div>
              </div>
              
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Card Number</label>
                    <input
                      type="text"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">CVV</label>
                      <input
                        type="text"
                        value={formData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background"
                        placeholder="123"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={formData.cardName}
                      onChange={(e) => handleInputChange('cardName', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}
              
              {paymentMethod === 'paypal' && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">P</span>
                  </div>
                  <p className="text-muted-foreground">You'll be redirected to PayPal to complete your payment</p>
                </div>
              )}
            </div>
            
            <div className="border-t border-border pt-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span>Subtotal</span>
                <span>${book.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center font-semibold text-lg">
                <span>Total</span>
                <span>${book.price.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
              <Lock className="w-4 h-4" />
              <span>Your payment information is secure and encrypted</span>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep('details')} className="flex-1">
                Back
              </Button>
              <Button onClick={handlePurchase} className="flex-1">
                Complete Purchase
              </Button>
            </div>
          </>
        );
        
      case 'processing':
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <h3 className="font-semibold text-lg mb-2">Processing Payment</h3>
            <p className="text-muted-foreground">Please wait while we process your payment...</p>
          </div>
        );
        
      case 'success':
        return (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h3 className="font-semibold text-lg mb-2">Purchase Successful!</h3>
            <p className="text-muted-foreground mb-4">
              Thank you for your purchase. You now have access to <strong>{book.title}</strong>.
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecting to your library...
            </p>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={step === 'processing' ? undefined : onClose} />
      <div className="relative bg-background rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-semibold text-xl">
            {step === 'details' && 'Purchase Book'}
            {step === 'payment' && 'Payment'}
            {step === 'processing' && 'Processing'}
            {step === 'success' && 'Success'}
          </h2>
          {step !== 'processing' && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        <div className="p-6">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
}