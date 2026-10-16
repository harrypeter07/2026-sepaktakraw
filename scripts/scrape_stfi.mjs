import fs from 'fs'

async function scrapeSTFI() {
  try {
    const res = await fetch('https://sepaktakrawindia.com')
    const html = await res.text()
    
    // Find all img tags
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi
    const images = []
    let match
    while ((match = imgRegex.exec(html)) !== null) {
      images.push(match[1])
    }

    console.log(`Found ${images.length} images on sepaktakrawindia.com:`)
    console.log(JSON.stringify(images, null, 2))

    // Look for logos and links
    const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi
    const links = []
    while ((match = linkRegex.exec(html)) !== null) {
      links.push({ href: match[1], text: match[2].replace(/<[^>]+>/g, '').trim() })
    }
    console.log(`\nFound ${links.length} links on sepaktakrawindia.com:`)
    fs.writeFileSync('scripts/stfi_data.json', JSON.stringify({ images, links }, null, 2))
  } catch (err) {
    console.error('Error scraping:', err)
  }
}

scrapeSTFI()
