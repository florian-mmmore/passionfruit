# passionfruit — Greenleaf Digital

## 1. Project

This is a passionfruit website for Greenleaf Digital. passionfruit is a template for building professional, bilingual marketing websites with Claude Code. Non-technical users describe what they want; Claude builds it.

## 2. Self-improvement rule

**Claude must keep CLAUDE.md, STYLE_GUIDE.md, and CONTRIBUTING.md in sync with reality.** Update these files when:

- The user establishes a preference ("always use rounded buttons" → add to STYLE_GUIDE.md button section)
- A new content collection is added → document its schema, paths, and workflow in CONTRIBUTING.md
- A recurring issue is fixed → add to the quality checklist so it doesn't happen again
- A new component pattern emerges → document it in STYLE_GUIDE.md
- Routing changes → update the routing section below
- New commands are added → update the commands table

This is not optional. These files are the project's memory. If they drift from reality, future sessions will produce wrong code.

## 3. First-time setup

If the site still shows "Greenleaf Digital", run `/onboard` to personalize it for your business.

## 4. Tech stack

| Tool            | Version / notes                                                              |
| --------------- | ---------------------------------------------------------------------------- |
| Astro           | 6, static output                                                             |
| Tailwind        | v4 via `@tailwindcss/vite` (theme in `src/styles/global.css` `@theme` block) |
| TypeScript      | strict — no `any`, ever                                                      |
| Package manager | pnpm                                                                         |
| Icons           | `@lucide/astro` (no emojis)                                                  |
| Consent         | vanilla-cookieconsent                                                        |
| Analytics       | PostHog (EU instance, env-var-gated)                                         |
| Font            | Inter Variable (self-hosted via `@fontsource-variable/inter`)                |
| React           | Dependency present; only use when interactivity genuinely demands it         |

## 5. Bilingual rule

**Hard rule: every page and every collection entry must exist in both DE and EN.**

- Pairing is via `translationKey` frontmatter field — same value across both locale files.
- `scripts/check-bilingual.mjs` runs as `prebuild` and exits 1 if any entry is monolingual.
- Never commit a single-locale entry. Always update both DE and EN in the same commit.

## 6. Content workflows

See CONTRIBUTING.md for full details. Summary:

**Blog post:** `src/content/blog/{de,en}/<slug>.md` — needs translationKey, title, description, publishedAt, author, tags.

**Team member:** `src/content/team/{de,en}/<slug>.md` — needs translationKey, name, role, displayOrder.

**Page:** `src/content/pages/{de,en}/<slug>.md` — needs translationKey, title, description. Also update `src/lib/page-registry.ts`.

**Translations:** Always update both `src/i18n/de.json` and `src/i18n/en.json` in lockstep. Nested key structure, accessed via `t('section.key')`.

## 7. Component conventions

- Prefer Astro components over React.
- Brand tokens via Tailwind utility classes only — no hex literals in components.
- Icons via `@lucide/astro`. No emojis.
- Translation strings via `useTranslations(locale)` from `~/i18n`.
- Images via `<Image>` component from `astro:assets`.
- Always update both i18n JSON files when adding strings.

## 8. Styling

**Read `STYLE_GUIDE.md` before touching any UI.** It is the single source of truth for colors, typography, buttons, cards, layout, and accessibility.

Key rules:

- No hex literals in components — use Tailwind tokens that map to `global.css` `@theme` values
- Buttons use variant (primary / secondary / ghost) x tone (on-light / on-dark)
- One card component per content type (BlogCard, TeamCard)
- 44px minimum touch targets
- `focus-visible` ring on all interactive elements

## 9. Analytics and consent

`vanilla-cookieconsent` dispatches `passionfruit:consent-changed` events. PostHog listens for that event and loads on demand. PostHog is env-var-gated (`PUBLIC_POSTHOG_KEY`, `PUBLIC_POSTHOG_HOST`); it no-ops when the env vars are absent.

## 10. Routing

- URL scheme: **apex-locale** — DE at root (`/`), EN under `/en/`.
- Localized slugs: `/leistungen` (DE) ↔ `/en/services` (EN).
- Single source of truth: `src/lib/page-registry.ts` — `PAGES` array maps `PageKey` to `{ de, en }` slug pairs.
- Catch-all route: `src/pages/[...path].astro`.
- Home pages: `src/pages/index.astro` (DE), `src/pages/en/index.astro` (EN).

## 11. Quality checklist

Before committing:

- [ ] `pnpm build` passes (runs lint, typecheck, bilingual check)
- [ ] Both DE and EN locales render correctly
- [ ] No `any` in TypeScript
- [ ] Mobile layout intact at 375px
- [ ] No hex literals in components
- [ ] New collection entries have `translationKey` in both locales
- [ ] New i18n strings added to both `de.json` and `en.json`
- [ ] Changes align with STYLE_GUIDE.md

## 12. Image generation

Generate images for blog heroes, page backgrounds, and assets using GPT Image models:

```bash
pnpm generate-image "your prompt here" -o src/assets/blog/my-image.png
```

**Requires `OPENAI_API_KEY` in `.env`.** The user must provide their own OpenAI API key. If the key is missing, the script will error with a clear message — prompt the user to add it.

Options: `--size` (1536x1024 for landscapes, 1024x1536 for portraits), `--quality high`, `--background transparent` (png/webp only, not gpt-image-2), `--format` (png/jpeg/webp).

**Prompt guidelines for good results:**

- Be specific about composition, lighting, and mood
- Reference a visual style ("editorial photography", "Kinfolk magazine", "minimal tech aesthetic")
- Specify colors to match brand tokens (accent: #6366f1, dark: #1a1a2e)
- Always end with "No text, no logos" unless text is wanted
- Use `--size 1536x1024` for hero/banner images, `1024x1024` for square thumbnails

## 13. Commands

| Command               | Purpose                                                    |
| --------------------- | ---------------------------------------------------------- |
| `pnpm dev`            | Local dev server                                           |
| `pnpm build`          | Production build (runs lint + typecheck + bilingual check) |
| `pnpm preview`        | Preview built output                                       |
| `pnpm typecheck`      | `astro check` + `tsc --noEmit`                             |
| `pnpm lint`           | ESLint + Prettier with autofix                             |
| `pnpm lint:a11y`      | Accessibility lint for `.astro` files                      |
| `pnpm test`           | Bilingual check unit tests                                 |
| `pnpm generate-image` | Generate images via GPT Image (needs `OPENAI_API_KEY`)     |
