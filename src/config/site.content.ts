import type { TaskKey } from '@/lib/site-config'

export const siteContent = {
  navbar: {
    tagline: 'Filed for later, found faster',
  },
  footer: {
    tagline: 'Save the signal. Skip the feed noise.',
  },
  hero: {
    badge: 'Signal archive',
    title: ['Dig through useful links,', 'research trails, and saved signals.'],
    description:
      'Browse a deliberately organized archive of links, tools, references, and rabbit holes without the noise of a generic content feed.',
    primaryCta: {
      label: 'Open bookmark archive',
      href: '/sbm',
    },
    secondaryCta: {
      label: 'Browse collections',
      href: '/sbm/collections',
    },
    searchPlaceholder: 'Search links, hosts, tags, and references',
    focusLabel: 'Shelf focus',
    featureCardBadge: 'archive snapshot',
    featureCardTitle: 'Collections surface the strongest references without turning the site into a generic blog.',
    featureCardDescription:
      'Bookmark activity drives the presentation layer while the underlying task routes and platform behavior remain unchanged.',
  },
  home: {
    metadata: {
      title: 'Curated links, collections, and research trails',
      description:
        'Explore curated links, saved resources, and organized collections through a distinctive archive-style browsing experience.',
      openGraphTitle: 'Curated links, collections, and research trails',
      openGraphDescription:
        'Discover useful links, saved references, and organized collections through a calmer archive-style browsing experience.',
      keywords: ['social bookmarking', 'curated links', 'resource archive', 'collection library'],
    },
    introBadge: 'About the archive',
    introTitle: 'Built for saving better links, revisiting them faster, and keeping the signal easy to scan.',
    introParagraphs: [
      'Digginfordirt is designed like a modern field archive: links are grouped, categories are readable at a glance, and strong resources stay easy to come back to.',
      'The homepage prioritizes social bookmarking first, while the rest of the platform remains available through search, direct URLs, and secondary navigation layers.',
      'Instead of borrowing a blog or marketplace layout, the interface treats each saved resource like an index card in a living library.',
    ],
    sideBadge: 'Why it feels different',
    sidePoints: [
      'Bookmark-first homepage with archive, shelf, and note-card patterns.',
      'Primary navigation emphasizes collections and saved resources, not every task equally.',
      'Lower-emphasis routes stay accessible through the footer, search, and direct URLs.',
      'Lightweight motion and image-light layouts keep the experience fast and readable.',
    ],
    primaryLink: {
      label: 'Browse bookmarks',
      href: '/sbm',
    },
    secondaryLink: {
      label: 'Open collections',
      href: '/sbm/collections',
    },
  },
  cta: {
    badge: 'Start curating',
    title: 'Save better sources, build sharper collections, and keep your best references close.',
    description:
      'Use the same task logic underneath, but with a clearer social-bookmarking interface built for collecting, organizing, and returning to useful links.',
    primaryCta: {
      label: 'Start your archive',
      href: '/register',
    },
    secondaryCta: {
      label: 'Search the archive',
      href: '/search',
    },
  },
  taskSectionHeading: 'Latest {label}',
  taskSectionDescriptionSuffix: 'Browse the newest posts in this section.',
} as const

export const taskPageMetadata: Record<Exclude<TaskKey, 'comment' | 'org' | 'social'>, { title: string; description: string }> = {
  article: {
    title: 'Articles and stories',
    description: 'Read articles, stories, guides, and long-form posts across topics and interests.',
  },
  listing: {
    title: 'Listings and discoverable pages',
    description: 'Explore listings, services, brands, and structured pages organized for easier browsing.',
  },
  classified: {
    title: 'Classifieds and announcements',
    description: 'Browse classifieds, offers, notices, and time-sensitive posts across categories.',
  },
  image: {
    title: 'Images and visual posts',
    description: 'Explore image-led posts, galleries, and visual stories from across the platform.',
  },
  profile: {
    title: 'Profiles and public pages',
    description: 'Discover public profiles, brand pages, and identity-focused posts in one place.',
  },
  sbm: {
    title: 'Curated links, archive shelves, and revisitable resources',
    description: 'Browse useful links, research references, and curated bookmark collections organized like a living archive.',
  },
  pdf: {
    title: 'PDFs and downloadable resources',
    description: 'Open reports, documents, and downloadable resources shared across the platform.',
  },
}

export const taskIntroCopy: Record<
  TaskKey,
  { title: string; paragraphs: string[]; links: { label: string; href: string }[] }
> = {
  listing: {
    title: 'Listings, services, and structured pages',
    paragraphs: [
      'Explore listings, services, brands, and discoverable pages across categories. Each entry is organized to make browsing clearer and help visitors quickly understand what a post offers.',
      'Listings connect naturally with articles, images, resources, and other content types so supporting information stays easy to reach from the same platform.',
      'Browse by category to compare posts in context, discover related content, and move between formats without losing your place.',
    ],
    links: [
      { label: 'Read articles', href: '/articles' },
      { label: 'Explore classifieds', href: '/classifieds' },
      { label: 'View profiles', href: '/profile' },
    ],
  },
  article: {
    title: 'Articles, stories, and long-form reading',
    paragraphs: [
      'This section is built for stories, explainers, guides, and long-form reading across topics and interests.',
      'Articles connect with listings, images, resources, and other content types so deeper reading can lead naturally into related discovery.',
      'Use this section to browse thoughtful posts, revisit useful writing, and move into supporting content when you want more context.',
    ],
    links: [
      { label: 'Explore listings', href: '/listings' },
      { label: 'Open images', href: '/images' },
      { label: 'Browse resources', href: '/pdf' },
    ],
  },
  classified: {
    title: 'Classifieds, offers, and timely updates',
    paragraphs: [
      'Classified posts help surface offers, notices, deals, and time-sensitive opportunities in a faster-scanning format.',
      'They work well alongside articles, listings, and profiles, making it easier to connect short-term posts with more structured content.',
      'Browse by category to find announcements quickly, then continue into related sections when you need more detail.',
    ],
    links: [
      { label: 'Business listings', href: '/listings' },
      { label: 'Read articles', href: '/articles' },
      { label: 'View profiles', href: '/profile' },
    ],
  },
  image: {
    title: 'Image-led posts and visual stories',
    paragraphs: [
      'Images take the lead in this section through galleries, visual posts, and story-led content where imagery carries the experience.',
      'These posts connect with articles, listings, and other sections so visuals can act as entry points into deeper content.',
      'Browse the latest visual updates, then continue into related stories or supporting pages for more context.',
    ],
    links: [
      { label: 'Read articles', href: '/articles' },
      { label: 'Explore listings', href: '/listings' },
      { label: 'Open classifieds', href: '/classifieds' },
    ],
  },
  profile: {
    title: 'Profiles, identities, and public pages',
    paragraphs: [
      'Profiles capture the identity behind a business, creator, brand, or project and help visitors understand who is behind the content they are exploring.',
      'These pages work as trust anchors across the site and connect naturally with stories, listings, documents, and other post types.',
      'Browse profiles to understand people and brands more clearly, then continue into related content from the same source.',
    ],
    links: [
      { label: 'Open listings', href: '/listings' },
      { label: 'Read articles', href: '/articles' },
      { label: 'Browse images', href: '/images' },
    ],
  },
  sbm: {
    title: 'Curated links, notes, and bookmarked resources',
    paragraphs: [
      'This section is designed like a research shelf rather than a generic post feed, with calmer grouping, stronger category cues, and cleaner link-focused cards.',
      'Bookmarks stay connected to the rest of the platform, so supporting routes remain available without taking over the main visual hierarchy.',
      'Use this archive to collect useful sources, revisit strong references, and move through saved material without losing the thread.',
    ],
    links: [],
  },
  pdf: {
    title: 'PDFs, documents, and downloadable files',
    paragraphs: [
      'The PDF library hosts reports, guides, downloadable files, and longer-form document resources that support reading and discovery.',
      'These resources work alongside stories, listings, and profiles, helping document-style content stay connected to the rest of the platform.',
      'Browse by category to find relevant files quickly, then continue into related sections when you want more context.',
    ],
    links: [
      { label: 'Read articles', href: '/articles' },
      { label: 'See listings', href: '/listings' },
      { label: 'Explore profiles', href: '/profile' },
    ],
  },
  social: {
    title: 'Short updates and community signals',
    paragraphs: [
      'Short updates add quick signals that keep activity flowing across the platform.',
      'They work well with stories, listings, and resources by helping visitors move from brief updates into deeper content.',
      'Use these posts as lightweight entry points into the broader site experience.',
    ],
    links: [
      { label: 'Open listings', href: '/listings' },
      { label: 'Read articles', href: '/articles' },
      { label: 'View PDFs', href: '/pdf' },
    ],
  },
  comment: {
    title: 'Comments and contextual responses',
    paragraphs: [
      'Comments surface responses connected directly to articles and help keep discussion close to the writing it belongs to.',
      'This layer adds perspective and reaction without needing a separate standalone content format.',
      'Use comments as supporting context beneath stories, then continue exploring related content from the same topic area.',
    ],
    links: [
      { label: 'Explore articles', href: '/articles' },
      { label: 'View listings', href: '/listings' },
      { label: 'See classifieds', href: '/classifieds' },
    ],
  },
  org: {
    title: 'Organizations, teams, and structured entities',
    paragraphs: [
      'Organization pages provide structured identity surfaces for teams, brands, communities, and agencies.',
      'Used with listings, stories, profiles, and resources, they help create stronger structure across the platform.',
      'Connect organization pages with related content to build a clearer and more unified site presence.',
    ],
    links: [
      { label: 'Business listings', href: '/listings' },
      { label: 'Read articles', href: '/articles' },
      { label: 'PDF library', href: '/pdf' },
    ],
  },
}
