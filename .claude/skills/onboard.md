---
name: onboard
description: Personalize a fresh passionfruit template — asks for company name, colors, pages, and configures everything.
---

# Onboarding

This skill personalizes a fresh passionfruit template for a new website.

## When to trigger

- User explicitly runs `/onboard`
- Claude detects "Greenleaf Digital" placeholder text still present in the codebase

## Process

Ask these questions ONE AT A TIME using the AskUserQuestion tool:

1. "What's your company or project name?"
2. "What do you do?" (one sentence — becomes meta description + hero tagline)
3. "What's your primary language?" (German at root, or English at root?)
4. "Do you need a second language?" If no: remove /en/ pages, strip i18n JSON to single locale, disable bilingual check, simplify page-registry to single-slug entries. If yes: ask which locale and configure accordingly.
5. "Pick an accent color" — offer 4 presets (indigo #6366f1, emerald #10b981, amber #f59e0b, rose #f43f5e) or let them describe their brand colors
6. "Which pages do you need?" — multi-select: Home, About, Services, Blog, Team, Contact
7. "Contact details?" — email, phone, address for footer and contact page
8. "Social media links?" — LinkedIn, Instagram, X/Twitter, etc.

## After answers

Replace all "Greenleaf Digital" references with the company name across:

- `src/i18n/de.json` and `src/i18n/en.json` (site.name, site.tagline, site.description, footer.copyright)
- `src/lib/structured-data.ts` (ORGANIZATION_LD name)
- `src/layouts/BaseLayout.astro` (title suffix)
- `README.md` (project description)

Update `astro.config.mjs` site URL if provided.

Update `global.css` accent color tokens (--color-accent, --color-accent-hover).

Remove unused pages from:

- `src/components/pages/` directory
- `PAGES` array in `src/lib/page-registry.ts`
- Navigation items in Header.astro and Footer.astro
- Content collection entries that belong to removed pages

Rewrite CLAUDE.md section 1 with actual company context (name, what they do, which pages exist).

Update STYLE_GUIDE.md with chosen colors.

Update i18n JSON files with company name, tagline, and adjusted navigation labels.

## Final step

Stage and commit everything:

```
git add -A
git commit -m "Initial setup: [Company Name] website"
```

Then tell the user: "Your website is ready! Run `pnpm dev` to see it, or tell me what you'd like to change."
