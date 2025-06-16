
// Global type definitions for third-party scripts
export {};

declare global {
  interface Window {
    dataLayer?: any[];                // Google Tag Manager dataLayer
    gtag?: (...args: any[]) => void;  // Google Analytics gtag function
  }
}
