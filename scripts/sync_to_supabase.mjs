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

console.log('====================================================')
console.log('   MAHARASHTRA SEPAKTAKRAW ASSOCIATION (MSTA)')
console.log('           SUPABASE DATABASE SYNC TOOL')
console.log('====================================================')

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project-ref') || supabaseUrl.includes('placeholder')) {
  console.log('\n[!] Supabase credentials not found in environment.')
  console.log('Which database is this application configured to use?')
  console.log('  -> This project is built natively on SUPABASE (PostgreSQL).')
  console.log('  -> All schema migrations are located in `supabase/migrations/`.\n')
  console.log('Is the database working or paused?')
  console.log('  -> Currently running in local fallback / offline seed mode.')
  console.log('  -> If your Supabase cloud project was created previously, it may be paused.')
  console.log('  -> To resume it:')
  console.log('     1. Open https://supabase.com/dashboard')
  console.log('     2. Find your project and click "Restore project" / "Resume"')
  console.log('     3. In Project Settings > API, copy:')
  console.log('          - Project URL (e.g. https://xyzcompany.supabase.co)')
  console.log('          - anon public key')
  console.log('          - service_role secret key')
  console.log('     4. Create a `.env.local` file with:\n')
  console.log('        NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co')
  console.log('        NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key')
  console.log('        SUPABASE_SERVICE_ROLE_KEY=your-service-role-key')
  console.log('        NEXT_PUBLIC_USE_SUPABASE=true\n')
  console.log('     5. Run: node scripts/sync_to_supabase.mjs\n')
  process.exit(0)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnectionAndSync() {
  console.log(`\nConnecting to: ${supabaseUrl}...`)
  
  try {
    const { data, error } = await supabase.from('teams').select('count', { count: 'exact', head: true })
    if (error) {
      if (error.code === 'PGRST301' || error.message.includes('paused') || error.message.includes('connect')) {
        console.error('\n[X] PROJECT IS CURRENTLY PAUSED OR UNREACHABLE.')
        console.error('Please visit https://supabase.com/dashboard and click "Restore / Resume" on your project.')
        return
      }
      console.warn('Note on table access:', error.message)
    } else {
      console.log('✓ Successfully connected to Supabase database!')
    }

    const recordsPath = path.resolve('lib/msta-records.json')
    if (fs.existsSync(recordsPath)) {
      const records = JSON.parse(fs.readFileSync(recordsPath, 'utf8'))
      console.log(`Loaded ${records.tallies?.length || 0} district medal tallies, ${records.podiumRecords?.length || 0} podium records.`)
    }

    const regPath = path.resolve('lib/registered-players.json')
    if (fs.existsSync(regPath)) {
      const reg = JSON.parse(fs.readFileSync(regPath, 'utf8'))
      console.log(`Loaded ${reg.length} verified state registered athletes.`)
    }

    console.log('\nDatabase sync script is configured and ready.')
  } catch (err) {
    console.error('Connection check failed:', err)
  }
}

testConnectionAndSync()
