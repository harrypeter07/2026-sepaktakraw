import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'

const ASSETS = [
  { url: 'https://sepaktakrawindia.com/wp-content/uploads/2022/04/cropped-STFI-LOGO.png', name: 'stfi-logo.png' },
  { url: 'https://sepaktakrawindia.com/wp-content/uploads/2022/04/Logo-Asian-Sepaktakraw-Federation.jpg', name: 'astaf-logo.jpg' },
  { url: 'https://sepaktakrawindia.com/wp-content/uploads/2022/04/Logo-International-Sepak-Takraw-Federation.jpg', name: 'istaf-logo.jpg' },
  { url: 'https://sepaktakrawindia.com/wp-content/uploads/2022/04/fitindia.jpg', name: 'fit-india.jpg' },
  { url: 'https://sepaktakrawindia.com/wp-content/uploads/2022/04/KheloIndia.jpg', name: 'khelo-india.jpg' },
  { url: 'https://sepaktakrawindia.com/wp-content/uploads/2022/04/sailogo-1.png', name: 'sai-logo.png' },
  { url: 'https://sepaktakrawindia.com/wp-content/uploads/slider/cache/20e0e9438cef86c19b1c61c2321b6586/nada-logo-only-2.jpg', name: 'nada-logo.jpg' },
  { url: 'https://sepaktakrawindia.com/wp-content/uploads/2023/10/Bonze-Medal-Team.jpg', name: 'asian-games-bronze-team.jpg' },
  { url: 'https://sepaktakrawindia.com/wp-content/uploads/slider/cache/8b70dcd9675ce20b115ed87ce126961c/slide-1.jpg', name: 'national-action-1.jpg' },
  { url: 'https://sepaktakrawindia.com/wp-content/uploads/slider/cache/fd495c72be2d0635806cc7f0330637a8/slide-2.jpg', name: 'national-action-2.jpg' },
  { url: 'https://sepaktakrawindia.com/wp-content/uploads/slider/cache/9a6862dcc92cffac075c0f9a716bb044/slide-3.jpg', name: 'national-action-3.jpg' },
  { url: 'https://sepaktakrawindia.com/wp-content/uploads/2022/04/aazadi.png', name: 'azadi-ka-amrit-mahotsav.png' },
]

const targetDirs = [
  path.resolve('public/official'),
  path.resolve('imagekit-upload/official'),
]

for (const dir of targetDirs) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

async function download(url, filename) {
  return new Promise((resolve) => {
    const fullUrl = url.startsWith('//') ? `https:${url}` : url
    const client = fullUrl.startsWith('https') ? https : http

    const req = client.get(fullUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, filename).then(resolve)
      }
      if (res.statusCode !== 200) {
        console.warn(`Failed (${res.statusCode}): ${fullUrl}`)
        return resolve(false)
      }

      const chunks = []
      res.on('data', chunk => chunks.push(chunk))
      res.on('end', () => {
        const buffer = Buffer.concat(chunks)
        for (const dir of targetDirs) {
          fs.writeFileSync(path.join(dir, filename), buffer)
        }
        console.log(`✓ Downloaded ${filename} (${buffer.length} bytes)`)
        resolve(true)
      })
    })

    req.on('error', (e) => {
      console.error(`Error downloading ${url}:`, e.message)
      resolve(false)
    })
  })
}

async function run() {
  console.log('Downloading official national logos and action assets...')
  for (const asset of ASSETS) {
    await download(asset.url, asset.name)
  }
  console.log('Download complete!')
}

run()
