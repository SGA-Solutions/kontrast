# Futura BQ Font Setup

## Required Font Files

You need to obtain the following Futura BQ font files and place them in the `public/fonts/` directory:

### For Headings (Futura BQ Medium):
- `FuturaBQ-Medium.woff2`
- `FuturaBQ-Medium.woff`

### For Body Text (Futura BQ Light):
- `FuturaBQ-Light.woff2`
- `FuturaBQ-Light.woff`

## File Structure
```
web/
├── public/
│   └── fonts/
│       ├── FuturaBQ-Medium.woff2
│       ├── FuturaBQ-Medium.woff
│       ├── FuturaBQ-Light.woff2
│       └── FuturaBQ-Light.woff
└── app/
    ├── fonts.ts (✓ already created)
    ├── layout.tsx (✓ already updated)
    └── globals.css (✓ already updated)
```

## How to Use

### Automatic Application:
- **Body text**: Automatically uses Futura BQ Light
- **Headings** (h1-h6): Automatically uses Futura BQ Medium

### Manual Application:
- Use `font-heading` class for Futura BQ Medium
- Use `font-body` class for Futura BQ Light
- Use `font-sans` in Tailwind for body text
- Use `font-heading` in Tailwind for headings

### Example Usage:
```tsx
<h1 className="font-heading">This uses Futura BQ Medium</h1>
<p className="font-body">This uses Futura BQ Light</p>
<div className="font-sans">This also uses Futura BQ Light</div>
```

## Font Sources

You can obtain Futura BQ fonts from:
1. Adobe Fonts (if you have a subscription)
2. MyFonts.com
3. Fonts.com
4. Your organization's font license

## Fallbacks

If the Futura BQ fonts aren't loaded, the system will fall back to:
1. Arial
2. Helvetica  
3. System sans-serif fonts
