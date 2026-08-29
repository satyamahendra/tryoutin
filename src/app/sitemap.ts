import type {MetadataRoute} from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tryoutin.svtyv.com"

export default function sitemap(): MetadataRoute.Sitemap {
    // ponytail: auth-gated routes (dashboard, tryouts, admin) excluded — redirect to /auth for crawlers
    return [
        {url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1},
        {url: `${siteUrl}/auth`, changeFrequency: "monthly", priority: 0.4},
        {url: `${siteUrl}/contact`, changeFrequency: "monthly", priority: 0.2},
        {url: `${siteUrl}/terms`, changeFrequency: "yearly", priority: 0.1},
        {url: `${siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.1},
    ]
}