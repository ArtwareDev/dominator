import type { Page, Media } from '../types/cms'

export type { Page, Media }

const CMS_URL = import.meta.env.PUBLIC_CMS_URL ?? 'http://localhost:3000'

export async function getPage(slug: string): Promise<Page | null> {
  const url = `${CMS_URL}/api/pages?where[slug][equals]=${encodeURIComponent(slug)}&depth=1&limit=1`
  try {
    const res = await fetch(url)
    if (!res.ok) {
      console.error(`[cms] GET ${url} → ${res.status} ${res.statusText}`)
      return null
    }
    const data: { docs: Page[] } = await res.json()
    return data.docs[0] ?? null
  } catch (err) {
    console.error(`[cms] fetch failed for "${slug}":`, err)
    return null
  }
}

/** Resolves a Payload upload field to an absolute URL. */
export function getMediaUrl(image: number | Media): string {
  if (typeof image === 'number') return ''
  const { url } = image
  if (!url) return ''
  return url.startsWith('http') ? url : `${CMS_URL}${url}`
}
