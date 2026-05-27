# passionfruit

**Everyone can cook.** Professional websites for everyone, powered by Claude Code.

passionfruit is a website template that turns Claude Code into your web developer.
Create a repo from this template, open Claude Code, type `/onboard`, and you have a
personalized, production-grade website. No coding required.

---

## Quick Start

1. Click **[Use this template](https://github.com/passion4it-gmbh/passionfruit/generate)** on GitHub to create your own repo
2. Clone your new repo and open it with [Claude Code](https://claude.ai)
3. Type `/onboard` and answer a few questions — Claude builds your site

That's it. Your website is ready to customize.

### Going Live

When you're happy with your site, type `/deploy`. Claude walks you through connecting to Cloudflare Pages (free) — after that, every push to `main` automatically deploys your site.

---

## What You Get

- **Bilingual out of the box** — German + English, extensible to more languages
- **Blog, team pages, and content collections** — add posts and team members in Markdown
- **Cookie consent + PostHog analytics** — GDPR-compliant, EU-hosted
- **WCAG AA accessibility** — semantic HTML, keyboard navigation, proper contrast
- **ESLint + TypeScript strict + CI pipeline** — quality guardrails from day one
- **Self-improving documentation** — CLAUDE.md evolves as you work, so Claude never forgets your preferences
- **SEO** — structured data, bilingual sitemap, Open Graph tags

---

## Why Not WordPress?

|               | passionfruit                                                       | WordPress                                   |
| ------------- | ------------------------------------------------------------------ | ------------------------------------------- |
| **Speed**     | Static site = instant page loads                                   | Dynamic rendering, plugins slow it down     |
| **Security**  | No PHP, no plugins, no attack surface                              | Constant patching, plugin vulnerabilities   |
| **Cost**      | Host for free on Cloudflare Pages, Vercel, or Netlify              | Hosting, themes, and plugins add up         |
| **AI-native** | Claude Code understands every file, can modify anything on request | Locked behind admin panels and plugin walls |

---

## Built With

- [Astro 6](https://astro.build) — static site generator
- [Tailwind CSS v4](https://tailwindcss.com) — utility-first styling
- [TypeScript](https://www.typescriptlang.org) — strict mode, no `any`
- [pnpm](https://pnpm.io) — fast, disk-efficient package manager

---

## For Developers

passionfruit uses a central **page registry** (`src/lib/page-registry.ts`) that drives
routing, i18n slug mapping, and hreflang generation. All pages go through a single
catch-all route — no scattered `.astro` files in `src/pages/`.

Content lives in `src/content/` as Markdown collections (blog, team, pages), paired
across locales via a `translationKey` frontmatter field.

Key references:

- **CLAUDE.md** — project conventions, architecture, and commands
- **STYLE_GUIDE.md** — visual system: colors, typography, spacing, component patterns
- **CONTRIBUTING.md** — content workflows for blog posts, team members, and pages

---

## Made by PASSION4IT

Built with care by [PASSION4IT](https://passion4it.de).
Need professional help with your digital project? [Get in touch](https://passion4it.de/kontakt/).

---

## License

MIT — see [LICENSE](./LICENSE).
