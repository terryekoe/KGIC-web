"use client";

import { useEffect } from 'react';

// Performance monitoring component
export function PerformanceMonitor() {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') return;

    // Track Core Web Vitals
    const trackWebVitals = async () => {
      const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');

      // Cumulative Layout Shift
      getCLS((metric: any) => {
        console.log('CLS:', metric);
        // Send to analytics service
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'web_vitals', {
            event_category: 'Web Vitals',
            event_label: 'CLS',
            value: Math.round(metric.value * 1000),
            non_interaction: true,
          });
        }
      });

      // First Input Delay
      getFID((metric: any) => {
        console.log('FID:', metric);
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'web_vitals', {
            event_category: 'Web Vitals',
            event_label: 'FID',
            value: Math.round(metric.value),
            non_interaction: true,
          });
        }
      });

      // First Contentful Paint
      getFCP((metric: any) => {
        console.log('FCP:', metric);
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'web_vitals', {
            event_category: 'Web Vitals',
            event_label: 'FCP',
            value: Math.round(metric.value),
            non_interaction: true,
          });
        }
      });

      // Largest Contentful Paint
      getLCP((metric: any) => {
        console.log('LCP:', metric);
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'web_vitals', {
            event_category: 'Web Vitals',
            event_label: 'LCP',
            value: Math.round(metric.value),
            non_interaction: true,
          });
        }
      });

      // Time to First Byte
      getTTFB((metric: any) => {
        console.log('TTFB:', metric);
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'web_vitals', {
            event_category: 'Web Vitals',
            event_label: 'TTFB',
            value: Math.round(metric.value),
            non_interaction: true,
          });
        }
      });
    };

    // Track page load performance
    const trackPageLoad = () => {
      if (typeof window !== 'undefined' && window.performance) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          const metrics = {
            dns: navigation.domainLookupEnd - navigation.domainLookupStart,
            tcp: navigation.connectEnd - navigation.connectStart,
            ssl: navigation.connectEnd - navigation.secureConnectionStart,
            ttfb: navigation.responseStart - navigation.requestStart,
            download: navigation.responseEnd - navigation.responseStart,
            domInteractive: navigation.domInteractive - navigation.fetchStart,
            domComplete: navigation.domComplete - navigation.fetchStart,
            loadComplete: navigation.loadEventEnd - navigation.fetchStart,
          };

          console.log('Page Load Metrics:', metrics);

          // Send to analytics
          if (window.gtag) {
            Object.entries(metrics).forEach(([key, value]) => {
              window.gtag('event', 'page_load_timing', {
                event_category: 'Performance',
                event_label: key,
                value: Math.round(value),
                non_interaction: true,
              });
            });
          }
        }
      }
    };

    // Track resource loading
    const trackResources = () => {
      if (typeof window !== 'undefined' && window.performance) {
        const resources = performance.getEntriesByType('resource');
        
        const resourceMetrics = {
          images: resources.filter(r => r.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)).length,
          scripts: resources.filter(r => r.name.match(/\.js$/i)).length,
          styles: resources.filter(r => r.name.match(/\.css$/i)).length,
          fonts: resources.filter(r => r.name.match(/\.(woff|woff2|ttf|otf)$/i)).length,
        };

        console.log('Resource Metrics:', resourceMetrics);

        if (window.gtag) {
          Object.entries(resourceMetrics).forEach(([key, value]) => {
            window.gtag('event', 'resource_count', {
              event_category: 'Performance',
              event_label: key,
              value: value,
              non_interaction: true,
            });
          });
        }
      }
    };

    // Initialize tracking
    trackWebVitals();
    
    // Track after page load
    if (document.readyState === 'complete') {
      trackPageLoad();
      trackResources();
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => {
          trackPageLoad();
          trackResources();
        }, 0);
      });
    }

    // Track memory usage (if available)
    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory;
      console.log('Memory Usage:', {
        used: Math.round(memoryInfo.usedJSHeapSize / 1048576), // MB
        total: Math.round(memoryInfo.totalJSHeapSize / 1048576), // MB
        limit: Math.round(memoryInfo.jsHeapSizeLimit / 1048576), // MB
      });
    }

  }, []);

  return null; // This component doesn't render anything
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}