import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '~/i18n';

export type { Locale };

export type PageKey = 'about' | 'services' | 'blog-index' | 'team' | 'contact';

export type CollectionName = 'blog' | 'team' | 'pages';

export interface PageEntry {
	key: PageKey;
	slug: { de: string; en: string };
	component: () => Promise<{ default: unknown }>;
	noindex?: boolean;
}

// ---------------------------------------------------------------------------
// Route match discriminated union
// ---------------------------------------------------------------------------

export type StaticPageMatch = { kind: 'static-page'; entry: PageEntry };

export type CollectionDetailMatch = {
	kind: 'collection-detail';
	collection: CollectionName;
	entry: CollectionEntry<'blog'> | CollectionEntry<'team'> | CollectionEntry<'pages'>;
};

export type RouteMatch = StaticPageMatch | CollectionDetailMatch;

// ---------------------------------------------------------------------------
// Static pages
// ---------------------------------------------------------------------------

export const PAGES = [
	{
		key: 'about' as const,
		slug: { de: 'ueber-uns', en: 'about' },
		component: () => import('~/components/pages/about.astro'),
	},
	{
		key: 'services' as const,
		slug: { de: 'leistungen', en: 'services' },
		component: () => import('~/components/pages/services.astro'),
	},
	{
		key: 'blog-index' as const,
		slug: { de: 'blog', en: 'blog' },
		component: () => import('~/components/pages/blog-index.astro'),
	},
	{
		key: 'team' as const,
		slug: { de: 'team', en: 'team' },
		component: () => import('~/components/pages/team.astro'),
	},
	{
		key: 'contact' as const,
		slug: { de: 'kontakt', en: 'contact' },
		component: () => import('~/components/pages/contact.astro'),
	},
] satisfies PageEntry[];

// ---------------------------------------------------------------------------
// Collection → registry key mapping
// ---------------------------------------------------------------------------

const COLLECTION_REGISTRY_KEY: Record<CollectionName, PageKey> = {
	blog: 'blog-index',
	team: 'team',
	pages: 'about', // pages collection detail routes nest under about
};

// ---------------------------------------------------------------------------
// Helpers for static pages
// ---------------------------------------------------------------------------

export function findPageByKey(key: PageKey): PageEntry | undefined {
	return PAGES.find((p) => p.key === key);
}

export function findPageBySlug(lang: Locale, slug: string): PageEntry | undefined {
	return PAGES.find((p) => p.slug[lang] === slug);
}

// ---------------------------------------------------------------------------
// Collection detail paths
// ---------------------------------------------------------------------------

type AnyCollectionEntry =
	| CollectionEntry<'blog'>
	| CollectionEntry<'team'>
	| CollectionEntry<'pages'>;

type CollectionDetailPath = {
	params: { path: string };
	props: {
		kind: 'collection-detail';
		lang: Locale;
		slug: string;
		collection: CollectionName;
		entry: AnyCollectionEntry;
	};
};

/** Route param for the apex catch-all: DE without prefix, EN under en/. */
function toPathParam(lang: Locale, slug: string): string {
	return lang === 'de' ? slug : `en/${slug}`;
}

/** Pushes detail paths for a single collection into `paths`. */
function pushDetailPaths(
	paths: CollectionDetailPath[],
	collectionName: CollectionName,
	entries: AnyCollectionEntry[],
	locales: Locale[],
): void {
	const registryKey = COLLECTION_REGISTRY_KEY[collectionName];
	const pageEntry = findPageByKey(registryKey);

	for (const entry of entries) {
		// Entry IDs from the glob loader are like "de/welcome" or "en/about".
		const slashIndex = entry.id.indexOf('/');
		if (slashIndex === -1) continue;

		const entryLocale = entry.id.slice(0, slashIndex) as Locale;
		const entrySlug = entry.id.slice(slashIndex + 1);

		if (!locales.includes(entryLocale)) continue;

		const parentSlug = pageEntry?.slug[entryLocale] ?? registryKey;
		const fullSlug = `${parentSlug}/${entrySlug}`;

		paths.push({
			params: { path: toPathParam(entryLocale, fullSlug) },
			props: {
				kind: 'collection-detail',
				lang: entryLocale,
				slug: fullSlug,
				collection: collectionName,
				entry,
			},
		});
	}
}

export async function getCollectionDetailPaths(): Promise<CollectionDetailPath[]> {
	const locales: Locale[] = ['de', 'en'];
	const paths: CollectionDetailPath[] = [];

	// Team has no detail pages — shown on team index only.
	const [blog, pages] = await Promise.all([getCollection('blog'), getCollection('pages')]);

	pushDetailPaths(paths, 'blog', blog, locales);
	pushDetailPaths(paths, 'pages', pages, locales);

	return paths;
}

// ---------------------------------------------------------------------------
// getAllPaths — static + collection detail
// ---------------------------------------------------------------------------

type StaticPagePath = {
	params: { path: string };
	props: { kind: 'static-page'; lang: Locale; slug: string };
};

export async function getAllPaths(): Promise<Array<StaticPagePath | CollectionDetailPath>> {
	const staticPaths: StaticPagePath[] = [];
	for (const entry of PAGES) {
		staticPaths.push({
			params: { path: toPathParam('de', entry.slug.de) },
			props: { kind: 'static-page', lang: 'de', slug: entry.slug.de },
		});
		staticPaths.push({
			params: { path: toPathParam('en', entry.slug.en) },
			props: { kind: 'static-page', lang: 'en', slug: entry.slug.en },
		});
	}

	const detailPaths = await getCollectionDetailPaths();
	return [...staticPaths, ...detailPaths];
}

// ---------------------------------------------------------------------------
// Alternate locale slug helpers
// ---------------------------------------------------------------------------

export function getAlternateLocaleSlug(
	currentLang: Locale,
	currentSlug: string,
): { lang: Locale; slug: string } | undefined {
	const entry = findPageBySlug(currentLang, currentSlug);
	if (!entry) return undefined;
	const otherLang: Locale = currentLang === 'de' ? 'en' : 'de';
	return { lang: otherLang, slug: entry.slug[otherLang] };
}

export async function getAlternateCollectionSlug(
	currentLang: Locale,
	collectionName: CollectionName,
	translationKey: string,
): Promise<string | undefined> {
	const otherLang: Locale = currentLang === 'de' ? 'en' : 'de';
	const entries = await getCollection(collectionName);
	const paired = entries.find((e: AnyCollectionEntry) => {
		const data = e.data as { translationKey: string };
		return data.translationKey === translationKey && e.id.startsWith(`${otherLang}/`);
	});
	if (!paired) return undefined;

	const registryKey = COLLECTION_REGISTRY_KEY[collectionName];
	const pageEntry = findPageByKey(registryKey);
	const parentSlug = pageEntry?.slug[otherLang] ?? registryKey;
	const entrySlug = paired.id.slice(paired.id.indexOf('/') + 1);
	return `${parentSlug}/${entrySlug}`;
}
