import { getPayload } from 'payload'
import config from '@payload-config'

async function verify() {
  const payload = await getPayload({ config })

  const { docs, totalDocs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    depth: 1,
    limit: 1,
  })

  if (totalDocs === 0) {
    console.log('RESULT: NOT_FOUND — Home page does not exist in the DB.')
    process.exit(1)
  }

  const page = docs[0]
  const hero = page.layout?.find((b) => b.blockType === 'hero')

  if (!hero) {
    console.log('RESULT: NO_HERO — Home page exists but has no hero block.')
    process.exit(1)
  }

  console.log('RESULT: OK')
  console.log('Page ID     :', page.id)
  console.log('Title       :', page.title)
  console.log('Tagline     :', hero.tagline)
  console.log('Heading     :', hero.heading)
  console.log('Description :', hero.description)
  console.log('Button      :', JSON.stringify(hero.button))
  console.log('Images      :', hero.images?.length ?? 0, 'uploaded')

  process.exit(0)
}

verify().catch((err) => {
  console.error('Verify failed:', err)
  process.exit(1)
})
