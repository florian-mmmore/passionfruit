# Visual Style Guide

**The definitive reference for all visual decisions.** If something contradicts this guide, this guide wins.

---

## Design Philosophy

Clean, professional, accessible. Not sterile, not flashy.

- No generic AI aesthetics (floating dashboards, gradient blobs, "AI brain" imagery)
- White space is a feature, not a waste
- Confidence through restraint — say less, mean more
- Every visual decision must serve readability or brand recognition

---

## 1. Color System

All colors are defined in `src/styles/global.css` under `@theme`. Use Tailwind utility classes — never hex literals in components.

### Core Tokens

| Token                  | Hex       | Purpose                                   |
| ---------------------- | --------- | ----------------------------------------- |
| `--color-surface`      | `#ffffff` | Page background                           |
| `--color-surface-dark` | `#1a1a2e` | Dark sections, footer                     |
| `--color-text`         | `#374151` | Body text                                 |
| `--color-text-heading` | `#111827` | Headings                                  |
| `--color-text-on-dark` | `#ffffff` | Text on dark backgrounds                  |
| `--color-accent`       | `#6366f1` | Primary accent (swappable via `/onboard`) |
| `--color-accent-hover` | `#4f46e5` | Hover state                               |
| `--color-border`       | `#e5e7eb` | Borders, dividers                         |
| `--color-muted`        | `#6b7280` | Secondary text, captions, metadata        |

---

## 2. Typography

**Inter Variable** for everything — headings and body. Self-hosted via `@fontsource-variable/inter`.

| Element             | Weight | Line-height | Notes              |
| ------------------- | ------ | ----------- | ------------------ |
| Headings (h1-h3)    | 700    | 1.2         | `--font-heading`   |
| Body                | 400    | 1.6         | `--font-body`      |
| Buttons             | 600    | —           | `font-semibold`    |
| Captions / metadata | 400    | 1.4         | `text-muted` color |

- Sentence case throughout — no ALL CAPS except eyebrow labels
- Eyebrow labels: `text-sm uppercase tracking-wide text-muted font-medium`

---

## 3. Buttons

Variant (primary / secondary / ghost) x tone (on-light / on-dark).

| Variant   | On light                                | On dark                                   |
| --------- | --------------------------------------- | ----------------------------------------- |
| Primary   | Accent bg, white text                   | Accent bg, white text                     |
| Secondary | Border + transparent bg, accent text    | White/15 bg, white text                   |
| Ghost     | No border, accent text, underline hover | No border, white/75 text, underline hover |

### Rules

- Minimum touch target: 44px height
- Border-radius: `var(--radius-button)` (8px)
- Padding: `px-6 py-3` (default), `px-8 py-4` (large)
- Always use `focus-visible` ring: `ring-2 ring-accent ring-offset-2`
- Text: `font-semibold` for primary/secondary, `font-medium` for ghost

---

## 4. Cards

One card component per content type. No multipurpose "Card" with 12 props.

### Standard Card (`.card` in global.css)

- Background: `var(--color-surface)`
- Border: `1px solid var(--color-border)`
- Border-radius: `var(--radius-card)` (12px)
- Padding: `1.5rem`
- Hover: subtle `translateY(-2px)` + border color shift. No shadow lift.

### Content Cards

- **BlogCard**: image top, title, date, excerpt, read-more link
- **TeamCard**: photo, name, role, specializations

---

## 5. Layout

### Container

- Max-width: `71.25rem` (1140px)
- Padding: `1rem` mobile → `1.5rem` sm → `2rem` lg

### Section Spacing

- Standard: `py-16` mobile, `py-24` desktop (`.section` class)
- Hero: `py-20` mobile, `py-32` desktop

### Responsive Breakpoints

| Prefix | Width                       |
| ------ | --------------------------- |
| (none) | < 640px (mobile-first base) |
| `sm:`  | 640px                       |
| `md:`  | 768px                       |
| `lg:`  | 1024px                      |

### Grid Patterns

- Feature cards: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`
- Text + visual: `grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`

---

## 6. Accessibility

WCAG AA minimum.

- Semantic HTML: `<section>`, `<nav>`, `<main>`, `<article>`
- Skip-link at top of page
- Heading hierarchy: h1 → h2 → h3 (never skip levels)
- `html lang` attribute set per locale
- Touch targets: 44px minimum
- `prefers-reduced-motion` respected — collapse animation durations
- Focus styles: `focus-visible` ring on all interactive elements
- `aria-expanded`, `aria-label`, `aria-controls` on interactive elements
- Color contrast: 4.5:1 body text, 3:1 large text

---

## 7. Page Patterns

### Hero Section

- Full-width, generous vertical padding
- Eyebrow + headline + subtitle + dual CTA

### Feature Grid

- Centered section heading (eyebrow + h2 + subtitle)
- 2-3 column grid of cards with icons

### Testimonials

- Quote text, attribution (name + role), optional photo
- Subtle card or blockquote styling

### CTA Section

- Dark background, bold headline, subtitle, dual buttons
- Used as page closer before footer

### FAQ Accordion

- `<details>` / `<summary>` elements
- Border, rounded corners, chevron rotates on open

---

## 8. Icons

Lucide only, via `@lucide/astro`. No emojis, no icon fonts.

Standard sizes: `w-4 h-4` (inline), `w-5 h-5` (buttons), `w-6 h-6` (features).

Icon containers: `w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center`.

---

## 9. Images

- Use `<Image>` from `astro:assets` for all images (automatic optimization)
- Hero images: full-width or contained, rounded corners
- Blog hero: 16:9 aspect ratio
- Team photos: square aspect ratio, rounded
- No stock photos of people pointing at screens
- No generic AI imagery
