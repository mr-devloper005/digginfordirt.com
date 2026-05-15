export const siteIdentity = {
  code: process.env.NEXT_PUBLIC_SITE_CODE || 'e6biavwtxx',
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Digginfordirt',
  tagline: process.env.NEXT_PUBLIC_SITE_TAGLINE || 'Filed for later, found faster',
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    'An archival social bookmarking platform for curated links, research trails, and revisitable resource collections.',
  domain: process.env.NEXT_PUBLIC_SITE_DOMAIN || 'digginfordirt.com',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://digginfordirt.com',
  ogImage: process.env.NEXT_PUBLIC_SITE_OG_IMAGE || '/og-default.png',
  googleMapsEmbedApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY || 'AIzaSyBco7dIECu3rJWjP3J0MImnR_uxlbeqAe0',

} as const

export const defaultAuthorProfile = {
  name: siteIdentity.name,
  avatar: '/placeholder.svg?height=80&width=80',
} as const

