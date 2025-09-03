# Horizontal Mouse Wheel Scroll Pattern

## Overview
This pattern enables horizontal scrolling with mouse wheel using the existing `useCrossBrowserScroll` hook.

## Implementation Steps

### 1. Convert to Client Component
Add `"use client";` directive at the top of your file.

### 2. Import Required Dependencies
```tsx
import { useCrossBrowserScroll } from "../../../hooks/useCrossBrowserScroll";
import { useEffect, useState } from "react";
```

### 3. Setup Hook in Component
```tsx
const { ref: scrollRef, onWheel } = useCrossBrowserScroll({ 
  direction: 'horizontal',
  sensitivity: 50,        // Adjust scroll speed
  smoothness: 0.15       // Adjust animation smoothness
});
```

### 4. Apply to Scroll Container
```tsx
<div 
  ref={scrollRef}
  onWheel={onWheel}
  className="overflow-x-auto hide-scrollbar cursor-grab active:cursor-grabbing"
>
  {/* Your horizontally scrolling content */}
</div>
```

### 5. Handle Async Data Loading
Convert server components to client components with state management:

```tsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function loadData() {
    try {
      const resolvedParams = await params;
      const result = await fetchData(resolvedParams);
      setData(result);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }
  loadData();
}, [params]);
```

## Configuration Options

- **sensitivity**: Controls scroll speed (default: 1, recommended: 30-100)
- **smoothness**: Controls animation smoothness (default: 0.1, recommended: 0.1-0.2)
- **direction**: 'horizontal' or 'vertical' (default: 'horizontal')

## Applied To
- ✅ `/app/tjanster/[slug]/page.tsx` - Services category page
- ⏳ `/app/nyheter/[slug]/page.tsx` - News article page (pending)

## Notes
- The hook provides smooth, cross-browser compatible scrolling
- Cursor changes to indicate draggable content
- Works with existing CSS classes like `hide-scrollbar`
