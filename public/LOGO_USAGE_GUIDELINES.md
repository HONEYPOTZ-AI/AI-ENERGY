# Logo Usage Guidelines

## ⚠️ IMPORTANT: Logo Component Implementation

**All logo instances in this application now use a centralized `<Logo>` component with automatic fallback handling.**

### Quick Start

```tsx
import Logo from '@/components/ui/logo';

// Use the Logo component anywhere
<Logo className="h-10 w-auto" alt="Company Logo" />
```

### Features of Logo Component

- ✅ **Automatic Fallback**: Tries local `/logo.webp` first, falls back to S3 URL
- ✅ **Error Handling**: Built-in error handling for failed image loads
- ✅ **Lazy Loading**: Optimized performance with lazy loading
- ✅ **Consistent Sizing**: Standardized across all pages
- ✅ **Accessibility**: Proper alt text support

### Logo Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | string | `"h-10 w-auto"` | CSS classes for sizing and styling |
| `alt` | string | `"Company Logo"` | Alternative text for accessibility |

### Common Sizes

```tsx
{/* Small (32px height) */}
<Logo className="h-8 w-auto" />

{/* Medium (40px height) */}
<Logo className="h-10 w-auto" />

{/* Large (48px height) */}
<Logo className="h-12 w-auto" />

{/* Extra Large (64px height) */}
<Logo className="h-16 w-auto" />

{/* Extra Extra Large (80px height) */}
<Logo className="h-20 w-auto" />
```

### Components Using Logo Component

- `SiteNavigation.tsx`
- `Footer.tsx`
- `DashboardLayout.tsx`
- `OnboardingPage.tsx`
- `WelcomeStep.tsx`

---

## Logo Source Information

**Current Logo URL:** https://newoaks.s3.us-west-1.amazonaws.com/AutoDev/59275/ca742850-fe9e-4a16-9efc-a791f65af5c7.webp

**Local Path:** `/logo.webp` (in public folder)

### Optional: Download Logo Locally

For better performance, you can download the logo to the public folder:

1. Open the logo URL in your browser
2. Right-click and select "Save image as..."
3. Save it as `logo.webp` in the `public/` folder

The Logo component will automatically use the local version if available, otherwise it falls back to the S3 URL.

---

## Implementation Guide (Legacy - Use Logo Component Instead)

> **Note**: The sections below are preserved for reference, but all new implementations should use the `<Logo>` component described above.

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

### Responsive Sizing Guidelines

```
Mobile (< 640px):    80-100px (header), 24-32px (footer)
Tablet (640-1024px): 120-140px (header), 48-64px (footer)
Desktop (> 1024px):  140-160px (header), 80-100px (footer)
```

---

## 2. Spacing and Padding Guidelines

### Clear Space (Minimum Clearance)

Maintain a minimum clear space around the logo equal to **25% of the logo's width** on all sides.

### Horizontal Spacing in Navigation

| Layout | Left Spacing | Right Spacing | Top/Bottom |
|--------|--------------|---------------|------------|
| Header Navigation | 16px | 24px | 12px |
| Horizontal Menu | 12px | 16px | 8px |
| Logo + Text Combo | 8px | 16px | 8px |

---

## 3. Color Usage and Background Recommendations

### Primary Logo Colors

- **Primary:** Full color version on light backgrounds
- **White:** White logo on dark backgrounds
- **Monochrome (Dark):** Dark/black version for printing

### Contrast Requirements

Maintain a **minimum contrast ratio of 4.5:1** (WCAG AA) between logo and background.

---

## 4. Accessibility Requirements

### Using Logo Component (Recommended)

```tsx
import Logo from '@/components/ui/logo';

// In navigation (logo as link)
<Link to="/" aria-label="Company Name - Return to homepage">
  <Logo className="h-10 w-auto" alt="" />
</Link>

// Standalone logo with context
<Logo className="h-12 w-auto" alt="Company Name - AI-Powered Energy Intelligence Platform" />
```

### Best Practices

1. ✓ Always include meaningful alt text
2. ✓ Keep alt text concise (under 125 characters)
3. ✓ Use `aria-label` on linked logos
4. ✗ Don't use "logo" as standalone alt text
5. ✗ Don't include filename or redundant text

---

## 5. Do's and Don'ts

### ✅ DO'S

**Implementation**
- ✓ Use the `<Logo>` component for all logo instances
- ✓ Scale the logo proportionally
- ✓ Use specified minimum sizes
- ✓ Maintain 25% clear space
- ✓ Include descriptive alt text
- ✓ Test across devices and browsers

**Colors & Backgrounds**
- ✓ Use full color on light backgrounds
- ✓ Use white logo on dark backgrounds
- ✓ Maintain minimum 4.5:1 contrast ratio

---

### ❌ DON'TS

**Implementation**
- ✗ Don't bypass the Logo component and reference images directly
- ✗ Don't stretch or compress the logo
- ✗ Don't use logo smaller than minimum sizes
- ✗ Don't make logo blurry or pixelated

**Colors & Backgrounds**
- ✗ Don't change logo colors
- ✗ Don't add effects (gradients, glows, shadows)
- ✗ Don't use logo on backgrounds with poor contrast

---

## 6. Implementation Checklist

Use this checklist when implementing the logo:

```
Component Usage
  ☐ Using <Logo> component from '@/components/ui/logo'
  ☐ Appropriate className for context
  ☐ Alt text is descriptive and concise

Sizing
  ☐ Logo sized appropriately for context
  ☐ Minimum size requirements met
  ☐ Maintains aspect ratio
  ☐ Responsive at different breakpoints

Spacing & Layout
  ☐ Clear space maintained (25% rule)
  ☐ Proper alignment achieved
  ☐ No overlap with other elements

Accessibility
  ☐ Alt text provided
  ☐ Linked logos have aria-label
  ☐ Keyboard navigation works

Quality Assurance
  ☐ Tested on mobile devices
  ☐ Tested on tablets
  ☐ Tested on desktop
  ☐ Tested in different browsers
```

---

## 7. Migration from Direct Image Usage

If you have existing code using direct `<img>` tags:

### Before (Old Way)
```tsx
<img 
  src="/logo.webp" 
  alt="Company Logo" 
  className="h-10 w-auto" 
/>
```

### After (New Way)
```tsx
import Logo from '@/components/ui/logo';

<Logo className="h-10 w-auto" alt="Company Logo" />
```

---

## Support and Questions

For logo-related questions:

1. Review the Logo component implementation in `src/components/ui/logo.tsx`
2. Check the implementation checklist above
3. Review the do's and don'ts
4. Test across browsers and devices

---

**Document Version:** 2.0  
**Last Updated:** 2024  
**Logo Component:** `src/components/ui/logo.tsx`  
**Logo Source:** https://newoaks.s3.us-west-1.amazonaws.com/AutoDev/59275/ca742850-fe9e-4a16-9efc-a791f65af5c7.webp