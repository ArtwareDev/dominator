import { getPayload } from 'payload'
import config from '@payload-config'

// Exact text extracted from Figma node 953:4905 (Frame 3 — Hero section)
const HERO_CONTENT = {
  tagline: 'Local Dominator',
  heading: 'Η επιχείρησή σου, πρώτη επιλογή στη Google',
  description:
    'Φέρνουμε το κατάστημά σου στις πρώτες θέσεις των χαρτών. Ξεκάθαρες λύσεις τοπικής προβολής με αποτελέσματα που μετριούνται σε πραγματικούς πελάτες.',
  button: {
    label: 'Δωρεάν αξιολόγηση',
    link: '#contact',
  },
}

// Unsplash placeholders — local business owners theme, matching Figma collage style
const IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&fit=crop',
    alt: 'Επαγγελματίας επιχειρηματίας, ανδρικό πορτρέτο',
  },
  {
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80&fit=crop',
    alt: 'Γυναίκα επιχειρηματίας, επαγγελματικό πορτρέτο',
  },
  {
    url: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=600&q=80&fit=crop',
    alt: 'Ιδιοκτήτρια καταστήματος με ποδιά',
  },
  {
    url: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=600&q=80&fit=crop',
    alt: 'Επιχειρηματίας χαμογελά, ανδρικό πορτρέτο',
  },
  {
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=80&fit=crop',
    alt: 'Επαγγελματίας σε επιχειρηματικό περιβάλλον',
  },
]

async function uploadImage(
  payload: Awaited<ReturnType<typeof getPayload>>,
  { url, alt }: { url: string; alt: string },
) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to fetch image: ${url} (${response.status})`)

  const buffer = Buffer.from(await response.arrayBuffer())
  const mimetype = response.headers.get('content-type') || 'image/jpeg'
  const ext = mimetype.includes('png') ? 'png' : 'jpg'
  const name = `hero-${alt.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.${ext}`

  return payload.create({
    collection: 'media',
    data: { alt },
    file: { data: buffer, mimetype, name, size: buffer.length },
  })
}

async function seed() {
  const payload = await getPayload({ config })

  console.log('⬆️  Uploading hero images...')
  const mediaDocs = await Promise.all(IMAGES.map((img) => uploadImage(payload, img)))
  console.log(`✅ Uploaded ${mediaDocs.length} images`)

  const heroBlock = {
    blockType: 'hero' as const,
    ...HERO_CONTENT,
    images: mediaDocs.map((m) => ({ image: m.id })),
  }

  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    const updated = await payload.update({
      collection: 'pages',
      id: existing.docs[0].id,
      data: { layout: [heroBlock] },
    })
    console.log(`✅ Updated "Home" page (id: ${updated.id})`)
  } else {
    const created = await payload.create({
      collection: 'pages',
      data: { title: 'Home', slug: 'home', layout: [heroBlock] },
    })
    console.log(`✅ Created "Home" page (id: ${created.id})`)
  }

  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
