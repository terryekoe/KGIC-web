'use client';

import { useState } from 'react';
import { X, Bell, Mail, Clock } from 'lucide-react';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  prayerTitle: string;
  prayerId: string | number;
}

export function ReminderModal({ isOpen, onClose, prayerTitle, prayerId }: ReminderModalProps) {
  const [reminderType, setReminderType] = useState<'browser' | 'email'>('browser');
  const [reminderTime, setReminderTime] = useState('09:00');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSetReminder = async () => {
    setIsLoading(true);
    
    try {
      if (reminderType === 'browser') {
        await handleBrowserNotification();
      } else {
        await handleEmailReminder();
      }
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Failed to set reminder:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBrowserNotification = async () => {
    // Request notification permission
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        // Store reminder in localStorage
        const reminder = {
          prayerId,
          prayerTitle,
          time: reminderTime,
          enabled: true,
          createdAt: new Date().toISOString()
        };
        
        const existingReminders = JSON.parse(localStorage.getItem('prayerReminders') || '[]');
        const updatedReminders = existingReminders.filter((r: any) => r.prayerId !== prayerId);
        updatedReminders.push(reminder);
        localStorage.setItem('prayerReminders', JSON.stringify(updatedReminders));
        
        // Schedule daily notification
        scheduleNotification(reminder);
      } else {
        throw new Error('Notification permission denied');
      }
    } else {
      throw new Error('Notifications not supported');
    }
  };

  const handleEmailReminder = async () => {
    // Here you would typically send to your backend API
    // For now, we'll just simulate the API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store email reminder preference
    const reminder = {
      prayerId,
      prayerTitle,
      email,
      time: reminderTime,
      type: 'email',
      enabled: true,
      createdAt: new Date().toISOString()
    };
    
    const existingReminders = JSON.parse(localStorage.getItem('emailReminders') || '[]');
    const updatedReminders = existingReminders.filter((r: any) => r.prayerId !== prayerId);
    updatedReminders.push(reminder);
    localStorage.setItem('emailReminders', JSON.stringify(updatedReminders));
  };

  const scheduleNotification = (reminder: any) => {
    const now = new Date();
    const [hours, minutes] = reminder.time.split(':').map(Number);
    
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);
    
    // If the time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }
    
    const timeUntilNotification = scheduledTime.getTime() - now.getTime();
    
    setTimeout(() => {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`🙏 Daily Prayer Reminder`, {
          body: `Time for your daily prayer: ${reminder.prayerTitle}`,
          icon: '/logo.png',
          tag: `prayer-${reminder.prayerId}`,
          requireInteraction: true
        });
        
        // Schedule the next day's notification
        scheduleNotification(reminder);
      }
    }, timeUntilNotification);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Set Daily Reminder</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-green-700 mb-2">Reminder Set!</h4>
            <p className="text-sm text-muted-foreground">
              You'll receive daily reminders for "{prayerTitle}" at {reminderTime}
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              Get daily reminders for "{prayerTitle}"
            </p>

            {/* Reminder Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">Reminder Method</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setReminderType('browser')}
                  className={`p-3 rounded-lg border transition-colors ${
                    reminderType === 'browser'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  <Bell className="w-5 h-5 mx-auto mb-2" />
                  <div className="text-sm font-medium">Browser</div>
                  <div className="text-xs text-muted-foreground">Instant notifications</div>
                </button>
                <button
                  onClick={() => setReminderType('email')}
                  className={`p-3 rounded-lg border transition-colors ${
                    reminderType === 'email'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  <Mail className="w-5 h-5 mx-auto mb-2" />
                  <div className="text-sm font-medium">Email</div>
                  <div className="text-xs text-muted-foreground">Cross-device</div>
                </button>
              </div>
            </div>

            {/* Time Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Reminder Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-border rounded-lg bg-background"
                />
              </div>
            </div>

            {/* Email Input (only for email reminders) */}
            {reminderType === 'email' && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  required
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleSetReminder}
                disabled={isLoading || (reminderType === 'email' && !email)}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50"
              >
                {isLoading ? 'Setting...' : 'Set Reminder'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}