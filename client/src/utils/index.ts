const getOrdinalSuffix = (day: number) => {
  if (day > 3 && day < 21) return 'th'; // Covers 11-20
  const suffixes = ['st', 'nd', 'rd'];
  return suffixes[(day % 10) - 1] || 'th';
};

export const formatDate = (dateString: Date) => {
  const date = new Date(dateString);
  const day = date.getUTCDate();
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getUTCFullYear();

  return `${month} ${day}${getOrdinalSuffix(day)}, ${year}`;
};

export const timeAgo = (createdDate: Date, locale = 'en') => {
  const date = new Date(createdDate);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const seconds = Math.floor((date.getTime() - Date.now()) / 1000);
  const thresholds = {
    year: 60 * 60 * 24 * 365,
    month: 60 * 60 * 24 * 30,
    day: 60 * 60 * 24,
    hour: 60 * 60,
    minute: 60,
    second: 1,
  };

  for (const [unit, value] of Object.entries(thresholds)) {
    if (Math.abs(seconds) >= value) {
      const delta = Math.round(seconds / value);
      return rtf.format(delta, unit as Intl.RelativeTimeFormatUnit);
    }
  }
  return rtf.format(seconds, 'second');
};

export const formatNumber = (num: number): string => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}m`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
  return num.toString();
};

// Performance optimization utilities
export const lazyLoadImages = () => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px 0px', // Start loading 50px before image comes into view
      threshold: 0.01
    });

    // Observe images with data-src attribute
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));

    // Also observe images that don't have src yet (for dynamic content)
    const placeholderImages = document.querySelectorAll('img.lazy');
    placeholderImages.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for browsers without IntersectionObserver
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach((img: any) => {
      img.src = img.dataset.src;
    });
  }
};


// utils/performance.ts
import { lazy } from 'react';

// Lazy loading for better code splitting
export const BlogListPage = lazy(() => import('../routes/BlogListPage'));
export const SingleBlogPage = lazy(() => import('../routes/SingleBlogPage'));
export const CreateBlogPage = lazy(() => import('../routes/CreateBlogPage'));
export const EditBlogPage = lazy(() => import('../routes/EditBlogPage'));

// Image optimization utilities
export const optimizeCloudinaryUrl = (
  url: string,
  width?: number,
  height?: number,
  format: 'auto' | 'webp' | 'avif' = 'auto'
) => {
  if (!url.includes('cloudinary.com')) return url;

  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;

  let transformations = ['f_auto', 'q_auto'];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (width && height) transformations.push('c_fill');
  if (format !== 'auto') transformations.push(`f_${format}`);

  return `${parts[0]}/upload/${transformations.join(',')}/${parts[1]}`;
};

// Generate responsive image srcset
export const generateSrcSet = (baseUrl: string) => {
  const sizes = [400, 800, 1200, 1600];
  return sizes
    .map(size => `${optimizeCloudinaryUrl(baseUrl, size)} ${size}w`)
    .join(', ');
};

// Preload critical resources
export const preloadCriticalResources = () => {
  // Preload critical fonts
  const fontLink = document.createElement('link');
  fontLink.rel = 'preload';
  fontLink.href = 'https://fonts.gstatic.com/s/montserrat/v26/JTUSjIg1_i6t8kCHKm459Wlhyw.woff2';
  fontLink.as = 'font';
  fontLink.type = 'font/woff2';
  fontLink.crossOrigin = 'anonymous';
  document.head.appendChild(fontLink);

  // Preconnect to API
  const apiLink = document.createElement('link');
  apiLink.rel = 'preconnect';
  apiLink.href = 'https://api.empire-reports.com';
  document.head.appendChild(apiLink);
};

// Intersection Observer for lazy loading
export const createLazyLoader = () => {
  if (!('IntersectionObserver' in window)) return null;

  return new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;

          // Load the image
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }

          // Load srcset if available
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
            img.removeAttribute('data-srcset');
          }

          // Remove loading class
          img.classList.remove('loading');
          img.classList.add('loaded');

          // Stop observing this image
          this.unobserve(img);
        }
      });
    },
    {
      rootMargin: '50px 0px',
      threshold: 0.01
    }
  );
};

// Web Vitals tracking
export const trackWebVitals = () => {
  if (typeof window === 'undefined') return;

  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    const vitalsUrl = '/api/analytics/vitals'; // Replace with your analytics endpoint

    const sendToAnalytics = (metric: any) => {
      // Send to your analytics service
      console.log('Web Vital:', metric);

      // Example: Send to Google Analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', metric.name, {
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          event_category: 'Web Vitals',
          event_label: metric.id,
          non_interaction: true,
        });
      }
    };

    getCLS(sendToAnalytics);
    getFID(sendToAnalytics);
    getFCP(sendToAnalytics);
    getLCP(sendToAnalytics);
    getTTFB(sendToAnalytics);
  });
};

// Critical CSS detection
export const inlineCriticalCSS = () => {
  // This should be done at build time, but here's runtime detection
  const criticalElements = document.querySelectorAll(
    'nav, header, .hero, .above-fold, [data-critical]'
  );

  criticalElements.forEach(element => {
    element.setAttribute('data-critical-rendered', 'true');
  });
};

// Service Worker registration for caching
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered:', registration);
    } catch (error) {
      console.log('SW registration failed:', error);
    }
  }
};

// Resource hints utility
export const addResourceHints = (urls: string[], type: 'preload' | 'prefetch' | 'preconnect') => {
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = type;
    link.href = url;

    if (type === 'preload') {
      // Determine resource type
      if (url.includes('.css')) link.as = 'style';
      else if (url.includes('.js')) link.as = 'script';
      else if (url.match(/\.(woff2?|ttf|otf)$/)) link.as = 'font';
      else if (url.match(/\.(jpg|jpeg|png|webp|avif|svg)$/)) link.as = 'image';
    }

    if (type === 'preconnect') {
      link.crossOrigin = 'anonymous';
    }

    document.head.appendChild(link);
  });
};

// Debounced scroll handler for performance
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

// Memory-efficient event listeners
export const addOptimizedEventListener = (
  element: Element,
  event: string,
  handler: EventListener,
  options: AddEventListenerOptions = {}
) => {
  const optimizedOptions = {
    passive: true,
    ...options
  };

  element.addEventListener(event, handler, optimizedOptions);

  return () => element.removeEventListener(event, handler, optimizedOptions);
};