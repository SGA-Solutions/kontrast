/**
 * Cross-browser polyfills for missing features
 */

// ResizeObserver polyfill check
export function needsResizeObserverPolyfill(): boolean {
  return typeof window !== 'undefined' && !window.ResizeObserver;
}

// IntersectionObserver polyfill check
export function needsIntersectionObserverPolyfill(): boolean {
  return typeof window !== 'undefined' && !window.IntersectionObserver;
}

// CSS.supports polyfill
export function supportsCSS(property: string, value?: string): boolean {
  if (typeof window === 'undefined') return false;
  
  if (window.CSS && window.CSS.supports) {
    return value ? window.CSS.supports(property, value) : window.CSS.supports(property);
  }
  
  // Fallback for older browsers
  const testEl = document.createElement('div');
  const camelProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  
  if (value) {
    try {
      testEl.style[camelProperty as any] = value;
      return testEl.style[camelProperty as any] === value;
    } catch {
      return false;
    }
  }
  
  return camelProperty in testEl.style;
}

// Object.assign polyfill for IE
export function polyfillObjectAssign(): void {
  if (typeof Object.assign !== 'function') {
    Object.assign = function(target: any, ...sources: any[]) {
      if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }
      
      const to = Object(target);
      
      for (let index = 0; index < sources.length; index++) {
        const nextSource = sources[index];
        
        if (nextSource != null) {
          for (const nextKey in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    };
  }
}

// Array.from polyfill for IE
export function polyfillArrayFrom(): void {
  if (!Array.from) {
    Array.from = function(arrayLike: any, mapFn?: any, thisArg?: any) {
      const O = Object(arrayLike);
      const len = parseInt(O.length) || 0;
      const result = new Array(len);
      
      for (let i = 0; i < len; i++) {
        if (i in O) {
          result[i] = mapFn ? mapFn.call(thisArg, O[i], i) : O[i];
        }
      }
      
      return result;
    };
  }
}

// Initialize all polyfills
export function initializePolyfills(): void {
  polyfillObjectAssign();
  polyfillArrayFrom();
}
