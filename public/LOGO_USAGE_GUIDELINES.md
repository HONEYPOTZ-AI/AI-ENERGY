# Logo Usage Guidelines

## Overview

This document provides comprehensive guidelines for the proper use of our logo across all digital and print applications. Consistent logo usage strengthens our brand identity and ensures professional presentation across all touchpoints.

**Logo Source:** https://newoaks.s3.us-west-1.amazonaws.com/AutoDev/59275/ca742850-fe9e-4a16-9efc-a791f65af5c7.webp

---

## 1. Logo Sizing Standards

### Minimum Size Requirements

| Context | Minimum Width | Recommended Width | Use Case |
|---------|---------------|-------------------|----------|
| **Header Logo** | 120px | 140-160px | Main site header, navigation |
| **Footer Logo** | 100px | 120-140px | Footer branding |
| **Card Header** | 40px | 48-64px | Feature cards, product cards |
| **Button Icon** | 24px | 24-32px | Call-to-action buttons |
| **Favicon** | 16px | 32-64px | Browser tab, bookmarks |
| **Social Media** | 200px | 256-512px | LinkedIn, Twitter, Facebook |
| **Email Header** | 150px | 150-200px | Email signatures, newsletters |
| **Print (Business Card)** | 0.8" | 1.0-1.2" | Business cards |
| **Print (Letterhead)** | 1.5" | 1.5-2.0" | Letterhead documents |

### Maximum Size Recommendations

- **Web Header:** 240px maximum width
- **Full-page Background:** 600px maximum width
- **Print Large Format:** 4" maximum width

### Responsive Sizing Guidelines

```
Mobile (< 640px):    80-100px (header), 24-32px (footer)
Tablet (640-1024px): 120-140px (header), 48-64px (footer)
Desktop (> 1024px):  140-160px (header), 80-100px (footer)
```

---

## 2. Spacing and Padding Guidelines

### Clear Space (Minimum Clearance)

Maintain a minimum clear space around the logo equal to **25% of the logo's width** on all sides to ensure visual prominence.

**Examples:**
- 100px logo → 25px minimum clear space on all sides
- 150px logo → 37.5px minimum clear space on all sides
- 200px logo → 50px minimum clear space on all sides

### Horizontal Spacing in Navigation

| Layout | Left Spacing | Right Spacing | Top/Bottom |
|--------|--------------|---------------|-----------|
| Header Navigation | 16px | 24px | 12px |
| Horizontal Menu | 12px | 16px | 8px |
| Logo + Text Combo | 8px | 16px | 8px |

### Vertical Spacing in Cards

| Element | Top | Bottom | Left | Right |
|---------|-----|--------|------|-------|
| Card Logo | 16px | 16px | 16px | 16px |
| Footer Logo | 24px | 24px | 24px | 24px |
| Hero Section Logo | 32px | 32px | 0 | 0 |

### Safe Margin Rules

Always maintain at least:
- **Header:** 16px padding inside header element
- **Footer:** 24px padding inside footer element
- **Card:** 16px padding inside card component
- **Standalone:** 40px minimum clear space around logo

---

## 3. Color Usage and Background Recommendations

### Primary Logo Colors

- **Primary:** Use full color version on light backgrounds (#FFFFFF, #F8F9FA, #FFFFFF)
- **White:** Use white logo on dark backgrounds (#1F2937, #111827, brand colors)
- **Monochrome (Dark):** Use dark/black version for printing or watermarks

### Background Color Recommendations

| Logo Version | Recommended Background | Avoid |
|--------------|------------------------|-------|
| **Full Color** | White, Light Gray (#F3F4F6) | Medium/Dark backgrounds |
| **White** | Dark Blue (#1E3A8A), Navy (#0F172A), Black (#000000) | Light colors, white |
| **Dark/Black** | White, Light Gray, Cream | Dark backgrounds |

### Contrast Requirements

Maintain a **minimum contrast ratio of 4.5:1** (WCAG AA) between logo and background:

```
Light backgrounds:   Use dark or full-color logo
Dark backgrounds:    Use white or light logo
Medium backgrounds:  Test contrast with accessibility tools
```

### Color Variations

**Do use:**
- Full color logo on appropriate backgrounds
- White logo on brand colors
- Black/dark logo for print or monochrome applications

**Do not use:**
- Inverted colors (reversed color schemes)
- Gradients on the logo
- Adding drop shadows that blur the logo
- Changing logo colors to match brands

---

## 4. Accessibility Requirements

### Alt Text Standards

#### Header Logo

```html
<img 
  src="/logo.webp" 
  alt="Company Name - AI-Powered Energy Intelligence Platform"
  width="160"
  height="auto"
/>
```

#### Logo as Link

```html
<a href="/" aria-label="Company Name - Return to homepage">
  <img 
    src="/logo.webp" 
    alt=""
    width="160"
    height="auto"
  />
</a>
```

#### Footer Logo

```html
<img 
  src="/logo.webp" 
  alt="Company Name Logo"
  width="120"
  height="auto"
/>
```

#### Logo in Cards

```html
<img 
  src="/logo.webp" 
  alt="Company Logo"
  width="48"
  height="auto"
/>
```

### ARIA Labels

- **Links containing only logo:** Use `aria-label` for context
- **Logo with text:** Logo can have empty `alt=""` since text provides context
- **Decorative use:** Use `aria-hidden="true"` and empty `alt=""`

### Best Practices

1. ✓ Always include meaningful alt text
2. ✓ Keep alt text concise (under 125 characters)
3. ✓ Include context (e.g., platform name)
4. ✓ Use `aria-label` on linked logos
5. ✗ Don't use "logo" as standalone alt text
6. ✗ Don't include filename or redundant text
7. ✗ Don't use `alt="click here"`

### Screen Reader Optimization

```html
<!-- Good: Logo with aria-label for navigation -->
<nav aria-label="Main navigation">
  <a href="/" aria-label="Company Name - Home">
    <img src="/logo.webp" alt="" width="160" height="auto" />
  </a>
</nav>

<!-- Good: Logo in footer with context -->
<footer>
  <img 
    src="/logo.webp" 
    alt="Company Name Logo - AI-Powered Energy Intelligence" 
    width="120" 
    height="auto"
  />
</footer>
```

---

## 5. File Format and Optimization Guidelines

### File Format Specifications

| Format | Use Case | Pros | Cons |
|--------|----------|------|------|
| **WebP** | Primary web format | Best compression, modern | Limited legacy support |
| **PNG** | Fallback/transparency | Lossless, transparency | Larger file size |
| **SVG** | Scalable vector | Resolution-independent | Not suitable for photos |
| **JPEG** | Print documents | Small file size | Quality loss, limited colors |
| **ICO** | Favicon | Browser standard | Limited size |

### Recommended Format: WebP

**File:** `logo.webp` (Primary)

**Optimization Settings:**
- Quality: 85-90 (balance quality and size)
- Width: 1200px (max dimension)
- Progressive: Enabled

**File Size Goals:**
- Logo < 30KB
- Logo optimized < 15KB
- Header version < 8KB

### Fallback Formats

Provide PNG fallback for older browser support:

```html
<picture>
  <source srcset="/logo.webp" type="image/webp">
  <img 
    src="/logo.png" 
    alt="Company Logo"
    width="160"
    height="auto"
  />
</picture>
```

### Optimization Tools

- **ImageOptim** (Mac): Lossless optimization
- **TinyPNG/TinyJPG**: Online optimization
- **Squoosh** (Google): WebP conversion
- **ImageMagick CLI**: Batch processing

### Current Logo Information

**Source URL:** https://newoaks.s3.us-west-1.amazonaws.com/AutoDev/59275/ca742850-fe9e-4a16-9efc-a791f65af5c7.webp

**Download Instructions:**
1. Open the URL in your browser
2. Right-click and select "Save image as..."
3. Save as `logo.webp` in the `/public` folder

---

## 6. Usage Examples for Common UI Patterns

### Example 1: Header Navigation

```html
<header className="bg-white border-b border-gray-200 sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      <a href="/" className="flex items-center" aria-label="Company Name - Home">
        <img 
          src="/logo.webp" 
          alt="" 
          width="140" 
          height="auto"
          className="h-10 w-auto"
        />
      </a>
      <nav className="flex space-x-8">
        {/* Navigation items */}
      </nav>
    </div>
  </div>
</header>
```

### Example 2: Footer Logo

```html
<footer className="bg-gray-900 text-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="flex justify-between items-start">
      <div>
        <img 
          src="/logo.webp" 
          alt="Company Name Logo" 
          width="120" 
          height="auto"
          className="mb-4"
        />
        <p className="text-gray-400">AI-Powered Energy Intelligence</p>
      </div>
      {/* Footer links */}
    </div>
  </div>
</footer>
```

### Example 3: Feature Card

```html
<div className="p-6 bg-white rounded-lg border border-gray-200">
  <div className="flex items-center gap-4 mb-4">
    <img 
      src="/logo.webp" 
      alt="Company Logo" 
      width="48" 
      height="auto"
      className="h-12 w-auto"
    />
    <h3 className="text-lg font-semibold">Feature Title</h3>
  </div>
  <p className="text-gray-600">Feature description</p>
</div>
```

### Example 4: Authentication Page

```html
<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
  <img 
    src="/logo.webp" 
    alt="Company Name Logo" 
    width="160" 
    height="auto"
    className="mb-8"
  />
  <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
    {/* Login form */}
  </div>
</div>
```

### Example 5: Email Header

```html
<table width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td style="padding: 20px; border-bottom: 2px solid #e5e7eb;">
      <img 
        src="https://example.com/logo.webp" 
        alt="Company Name Logo" 
        width="160" 
        height="auto"
        style="display: block; max-width: 100%; height: auto;"
      />
    </td>
  </tr>
</table>
```

### Example 6: Responsive Header

```tsx
import { useState } from 'react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <a href="/" className="flex items-center" aria-label="Home">
            {/* Mobile: 100px, Tablet: 120px, Desktop: 140px */}
            <img 
              src="/logo.webp" 
              alt="" 
              width="140" 
              height="auto"
              className="h-10 sm:h-12 w-auto"
            />
          </a>
          {/* Navigation */}
        </div>
      </div>
    </header>
  );
}
```

---

## 7. Do's and Don'ts

### ✅ DO'S

**Sizing & Scaling**
- ✓ Scale the logo proportionally (maintain aspect ratio)
- ✓ Use specified minimum sizes for different contexts
- ✓ Scale up from minimum sizes, not down
- ✓ Use CSS `width: auto; height: auto;` for responsiveness
- ✓ Test logo visibility at all intended sizes

**Colors & Backgrounds**
- ✓ Use full color on light backgrounds
- ✓ Use white logo on dark/brand colored backgrounds
- ✓ Maintain minimum 4.5:1 contrast ratio (WCAG AA)
- ✓ Test logo on actual background colors
- ✓ Use high-quality versions of the logo

**Spacing & Placement**
- ✓ Maintain 25% clear space around logo
- ✓ Position logo consistently in headers/footers
- ✓ Use recommended padding guidelines
- ✓ Align logo baseline properly in navigation
- ✓ Group logo with related branding elements

**Implementation**
- ✓ Use WebP format with PNG fallback
- ✓ Include descriptive alt text
- ✓ Use `aria-label` on linked logos
- ✓ Optimize images before deployment
- ✓ Test across devices and browsers

---

### ❌ DON'TS

**Sizing & Scaling**
- ✗ Don't stretch or compress the logo (distort aspect ratio)
- ✗ Don't use logo smaller than minimum specified sizes
- ✗ Don't scale logo non-proportionally
- ✗ Don't make logo blurry or pixelated
- ✗ Don't use low-resolution versions

**Colors & Backgrounds**
- ✗ Don't change logo colors
- ✗ Don't invert colors (unless in approved monochrome version)
- ✗ Don't use logo on backgrounds with poor contrast
- ✗ Don't add effects (gradients, glows, shadows) to logo
- ✗ Don't use logo on busy/distracting backgrounds

**Spacing & Placement**
- ✗ Don't crowd the logo with other elements
- ✗ Don't place logo without proper clear space
- ✗ Don't rotate or skew the logo
- ✗ Don't overlay text directly on logo
- ✗ Don't place logo off-center without reason

**Implementation**
- ✗ Don't use outdated file formats (GIF, old JPEG)
- ✗ Don't use alt text like "logo" or "click here"
- ✗ Don't forget alt text for accessibility
- ✗ Don't upload unoptimized high-resolution images
- ✗ Don't use logo as favicon without proper sizing

---

## 8. Implementation Checklist

Use this checklist when implementing the logo in any new section:

```
Sizing
  ☐ Logo sized appropriately for context
  ☐ Minimum size requirements met
  ☐ Maintains aspect ratio
  ☐ Responsive at different breakpoints

Spacing & Layout
  ☐ Clear space maintained (25% rule)
  ☐ Padding guidelines followed
  ☐ Proper alignment achieved
  ☐ No overlap with other elements

Colors & Contrast
  ☐ Appropriate logo version selected
  ☐ Contrast ratio ≥ 4.5:1
  ☐ Tested on actual background
  ☐ Looks professional and clear

Accessibility
  ☐ Alt text is descriptive and concise
  ☐ Linked logos have aria-label
  ☐ Tested with screen readers
  ☐ Keyboard navigation works

Performance
  ☐ Image is optimized (< 30KB)
  ☐ WebP format used with fallback
  ☐ Lazy loading implemented (if below fold)
  ☐ Load time verified

Quality Assurance
  ☐ Tested on mobile devices
  ☐ Tested on tablets
  ☐ Tested on desktop
  ☐ Tested in different browsers
```

---

## 9. File Organization

### Recommended File Structure

```
public/
├── logo.webp              # Primary WebP format (optimized)
├── logo.png               # Fallback PNG format
├── logo-dark.png          # Dark/monochrome version
├── logo-white.png         # White version
└── LOGO_USAGE_GUIDELINES.md  # This document
```

### Naming Conventions

- `logo.webp` - Primary high-resolution version
- `logo-sm.webp` - Optimized for small contexts (< 100px)
- `logo-dark.webp` - Dark background version
- `logo-white.webp` - Light background version (inverted)

---

## 10. Common Issues and Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Logo appears blurry | Low resolution or upscaling | Use properly sized file, don't scale up |
| Poor contrast | Wrong logo version | Choose appropriate version for background |
| Logo distorted | Non-proportional scaling | Maintain aspect ratio in CSS |
| Alt text missing | Oversight in implementation | Add descriptive alt text to all instances |
| Layout shift | Logo width/height not specified | Add `width` and `height` attributes |
| Slow load time | Large unoptimized file | Optimize and convert to WebP format |
| Logo cut off | Insufficient clear space | Apply 25% clear space rule |
| Mobile appearance poor | Not responsive | Use CSS media queries for sizing |

---

## 11. Accessibility Testing

### Tools and Methods

**Automated Testing:**
- WAVE (WebAIM): Check alt text and contrast
- Lighthouse: Accessibility audit
- axe DevTools: Comprehensive accessibility scan
- Color Contrast Analyzer: Verify contrast ratios

**Manual Testing:**
- Screen reader testing (NVDA, JAWS, VoiceOver)
- Keyboard navigation verification
- Visual inspection of logo clarity
- Testing across different zoom levels

### Accessibility Standards

- **WCAG 2.1 Level AA:** Minimum requirement (4.5:1 contrast)
- **WCAG 2.1 Level AAA:** Enhanced (7:1 contrast)
- **Section 508:** US government compliance

---

## 12. Future Logo Versions

When updating or creating new logo versions, maintain consistency with these guidelines:

1. **Maintain proportions** across all versions
2. **Create variants** for different background colors
3. **Export in multiple formats** (WebP, PNG, SVG)
4. **Update all instances** across the application
5. **Document changes** with dates and reasons
6. **Test thoroughly** before deployment
7. **Archive old versions** for reference

---

## Support and Questions

For logo-related questions or to request new format versions:

1. Refer to the specific section in this guide
2. Check the implementation checklist
3. Review the do's and don'ts
4. Use automated accessibility tools for verification
5. Test across browsers and devices

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Logo Source:** https://newoaks.s3.us-west-1.amazonaws.com/AutoDev/59275/ca742850-fe9e-4a16-9efc-a791f65af5c7.webp