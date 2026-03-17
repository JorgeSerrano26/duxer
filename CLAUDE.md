# Landing Page Implementation Guide (Astro + Tailwind)

## Context

You must build a **landing page in Astro** based on a visual design file located at:

/public/maqueta.png

The goal is to replicate the design as faithfully as possible, respecting layout, spacing, hierarchy, and structure.

---

## Tech Stack

- Astro
- TypeScript
- TailwindCSS
- Zod
- Resend
- Google reCAPTCHA
- Rate Limiting

---

## Core Requirements

### Layout
- Recreate the design from maqueta.png
- Respect spacing, typography, and hierarchy
- Use placeholders if images are missing:
  https://via.placeholder.com/800x600

---

## Accessibility
- Semantic HTML
- Labels in inputs
- Keyboard navigation
- Alt text in images
- Proper contrast

---

## Contact Form

Fields:
- Name
- Email
- Message

### Validation
Frontend + Backend using Zod:
- Name: min 2 chars
- Email: valid format
- Message: min 10 chars

---

## API (Astro)
File: /src/pages/api/contact.ts

Responsibilities:
- Validate with Zod
- Verify reCAPTCHA
- Apply rate limiting
- Send email (Resend)

---

## Environment Variables (.env.example)

RESEND_API_KEY=
RESEND_FROM_EMAIL=
RECAPTCHA_SECRET_KEY=
PUBLIC_RECAPTCHA_SITE_KEY=
RATE_LIMIT_MAX_REQUESTS=5
RATE_LIMIT_WINDOW_MS=60000

---

## SEO

- title
- meta description
- Open Graph
- Twitter cards

---

## GEO (AI Optimization)

### Structured Content
Use clear headings (h1, h2, h3)

### JSON-LD
Include Organization schema

### AI Readability
- Clear sections
- Descriptive content
- No hidden text

### Geo Metadata
<meta name="geo.region" content="AR" />
<meta name="geo.placename" content="Buenos Aires" />

---

## Improvements

If improvements are found, create:
mejoras.md

Include:
- UX improvements
- Technical improvements
- Conversion improvements

---

## Final Output

- Full Astro structure
- Components
- API
- Validation
- Security
- SEO + GEO
- .env.example
