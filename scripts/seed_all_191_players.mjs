import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

function loadEnv(file) {
  if (fs.existsSync(file)) {
    const lines = fs.readFileSync(file, 'utf8').split('\n')
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
      if (match) {
        let val = match[2] || ''
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1)
        }
        process.env[match[1]] = val.trim()
      }
    }
  }
}

loadEnv('.env')
loadEnv('.env.local')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const DISTRICT_TO_TEAM_ID = {
  'Nagpur': 'aaaaaaaa-0001-0000-0000-000000000001',
  'Solapur': 'aaaaaaaa-0002-0000-0000-000000000002',
  'Nanded': 'aaaaaaaa-0003-0000-0000-000000000003',
  'Wardha': 'aaaaaaaa-0004-0000-0000-000000000004',
  'Nashik': 'aaaaaaaa-0005-0000-0000-000000000005',
  'Jalgaon': 'aaaaaaaa-0006-0000-0000-000000000006',
  'Chhatrapati Sambhaji Nagar': 'aaaaaaaa-0007-0000-0000-000000000007',
  'Chhatrapati Sambhajinagar': 'aaaaaaaa-0007-0000-0000-000000000007',
  'Amravati': 'aaaaaaaa-0008-0000-0000-000000000008',
  'Pune': 'aaaaaaaa-0009-0000-0000-000000000009',
  'Mumbai Suburban': 'aaaaaaaa-000a-0000-0000-00000000000a',
  'Gondia': 'aaaaaaaa-000b-0000-0000-00000000000b',
  'Kolhapur': 'aaaaaaaa-000c-0000-0000-00000000000c',
}

async function seedAllPlayers() {
  console.log('Seeding all verified state athletes to Supabase...')
  const raw = fs.readFileSync('lib/registered-players.json', 'utf8')
  const athletes = JSON.parse(raw)
  console.log(`Loaded ${athletes.length} athletes from registered-players.json`)

  // Prepare batch of player objects
  const playerRows = athletes.map((a, idx) => {
    const teamId = DISTRICT_TO_TEAM_ID[a.district] || 'aaaaaaaa-0001-0000-0000-000000000001'
    let pos = a.position || 'Player'
    if (pos.toLowerCase().includes('tekong') || pos.toLowerCase().includes('feeder')) pos = 'Setter'
    else if (pos.toLowerCase().includes('killer') || pos.toLowerCase().includes('spiker')) pos = 'Spiker'

    return {
      team_id: teamId,
      name: a.name,
      position: pos,
      jersey_number: a.jerseyNo || ((idx % 25) + 1),
      photo_url: a.photo || null,
      bio: `State registered athlete representing ${a.district}. URN: ${a.urn || 'MSTA-REGISTERED'}. Competes in MSTA sanctioned state championships.`,
      height: a.gender === 'Female' ? "5'7\"" : "5'11\"",
      weight: a.gender === 'Female' ? "58 kg" : "70 kg",
      height_cm: a.gender === 'Female' ? 170 : 180,
      weight_kg: a.gender === 'Female' ? 58 : 70,
    }
  })

  // Clear existing players and insert all
  const { error: delErr } = await supabase.from('players').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (delErr) console.warn('Note on clearing players:', delErr.message)

  // Insert in batches of 50
  for (let i = 0; i < playerRows.length; i += 50) {
    const chunk = playerRows.slice(i, i + 50)
    const { data, error } = await supabase.from('players').insert(chunk).select('id')
    if (error) {
      console.error(`Batch ${i}-${i + chunk.length} failed:`, error.message)
    } else {
      console.log(`✓ Inserted batch ${i + 1} to ${i + chunk.length} (${data?.length || chunk.length} athletes)`)
    }
  }

  const { count } = await supabase.from('players').select('*', { count: 'exact', head: true })
  console.log(`\n✅ Total athletes in Supabase players table: ${count}`)
}

seedAllPlayers().catch(console.error)
