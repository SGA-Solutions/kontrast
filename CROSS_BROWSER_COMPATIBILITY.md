# Cross-Browser Compatibility Guide

This document outlines the cross-browser compatibility improvements implemented for the Kontrast website.

## Browser Support
- **Chrome** 80+
- **Safari** 13+
- **Firefox** 75+
- **Edge** 80+
- **Opera** 67+

## Modular Components Created

### 1. `lib/browser-utils.ts`
- Browser detection utilities
- Feature detection (WebP, AVIF support)
- Wheel event normalization across browsers
- CSS property support detection
- Touch device detection

### 2. `components/CrossBrowserImage.tsx`
- Automatic format detection (AVIF → WebP → JPG)
- Fallback handling for unsupported formats
- Optimized blur placeholders
- Responsive image sizing

### 3. `components/CrossBrowserScrollContainer.tsx`
- Normalized wheel events across browsers
- Smooth scrolling with RAF animation
- Touch action optimization
- Proper cleanup handling

### 4. `hooks/useCrossBrowserScroll.ts`
- Reusable scroll logic with browser normalization
- Configurable sensitivity and smoothness
- Support for both horizontal and vertical scrolling

### 5. `lib/image-utils.ts`
- Sanity image optimization with format fallbacks
- Responsive sizes generation
- Cross-browser blur placeholder generation

### 6. `styles/cross-browser.css`
- Vendor prefixes for CSS properties
- Fallbacks for modern CSS features
- Mobile Safari viewport fixes
- Grid/Flexbox compatibility

## Key Fixes Applied

### Image Handling
- **Format Fallbacks**: AVIF → WebP → JPG based on browser support
- **Responsive Images**: Proper device sizes and breakpoints
- **Loading Optimization**: Priority loading for above-fold images

### Scrolling
- **Wheel Event Normalization**: Firefox, Safari, Edge adjustments
- **Touch Actions**: Proper pan-x/pan-y with vendor prefixes
- **Overscroll Behavior**: Prevents bounce effects on mobile

### CSS Compatibility
- **Vendor Prefixes**: Added for transforms, animations, flexbox
- **Grid Fallbacks**: Flexbox fallbacks for older browsers
- **Viewport Units**: Mobile Safari height fixes with CSS custom properties

### Font Loading
- **Font Display Swap**: Prevents FOIT (Flash of Invisible Text)
- **Fallback Fonts**: Arial, Helvetica, sans-serif stack
- **Font Smoothing**: Cross-browser antialiasing

## Usage Examples

### Using CrossBrowserImage
```tsx
import CrossBrowserImage from '../components/CrossBrowserImage';

<CrossBrowserImage
  src={imageUrl}
  alt="Description"
  width={800}
  height={600}
  priority={true}
  sizes="(max-width: 768px) 100vw, 80vw"
/>
```

### Using CrossBrowserScrollContainer
```tsx
import CrossBrowserScrollContainer from '../components/CrossBrowserScrollContainer';

<CrossBrowserScrollContainer
  direction="horizontal"
  sensitivity={1}
  smoothness={0.15}
  className="flex overflow-x-scroll"
>
  {/* Your scrollable content */}
</CrossBrowserScrollContainer>
```

### Using Image Utils
```tsx
import { getOptimizedImageUrls } from '../lib/image-utils';

const imageUrls = getOptimizedImageUrls(sanityImage, {
  width: 800,
  height: 600,
  quality: 85,
  fit: 'crop'
});
```

## Testing Checklist

### Chrome
- [ ] Horizontal scrolling works smoothly
- [ ] Images load in AVIF/WebP format
- [ ] Animations are smooth
- [ ] Touch gestures work on touch devices

### Safari
- [ ] Wheel events are properly normalized
- [ ] Viewport height is correct on mobile
- [ ] WebP images load correctly
- [ ] No momentum scrolling interference

### Firefox
- [ ] Wheel delta is properly scaled
- [ ] Scrollbar hiding works
- [ ] Grid layouts display correctly
- [ ] WebP support detected correctly

### Edge
- [ ] Legacy IE properties work
- [ ] Modern Edge features supported
- [ ] Smooth scrolling enabled
- [ ] Touch actions work properly

### Mobile Browsers
- [ ] Viewport height fixes applied
- [ ] Touch scrolling works
- [ ] No overscroll bounce
- [ ] Images are responsive

## Performance Considerations

1. **Lazy Loading**: Images beyond viewport load lazily
2. **Format Detection**: Done once per session, cached
3. **Animation**: Uses RAF for smooth 60fps scrolling
4. **Memory**: Proper cleanup of event listeners and animations

## Maintenance Notes

- Update browser detection logic as new versions release
- Monitor WebP/AVIF adoption rates
- Test on actual devices, not just browser dev tools
- Keep vendor prefixes updated based on caniuse.com data
