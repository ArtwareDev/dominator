/**
 * Types mirrored from /cms/src/payload-types.ts.
 * After any CMS schema change, run `cd cms && npm run generate:types`
 * and update these interfaces to match.
 */

export interface Media {
  id: number
  alt: string
  url?: string | null
  width?: number | null
  height?: number | null
}

export interface HeroBlock {
  blockType: 'hero'
  tagline: string
  heading: string
  description: string
  button: {
    label: string
    link: string
  }
  images?:
    | {
        image: number | Media
        id?: string | null
      }[]
    | null
  id?: string | null
  blockName?: string | null
}

export type LayoutBlock = HeroBlock

export interface Page {
  id: number
  title: string
  slug: string
  layout?: LayoutBlock[] | null
  updatedAt: string
  createdAt: string
}
