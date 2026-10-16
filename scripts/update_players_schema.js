const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

function loadEnv(file) {
  if (fs.existsSync(file)) {
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        let val = match[2] || '';
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[match[1]] = val.trim();
      }
    }
  }
}
loadEnv(path.join(__dirname, '..', '.env'));
loadEnv(path.join(__dirname, '..', '.env.local'));

async function updateSchema() {
  const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log('Updating players table check constraints for Sepaktakraw...');

  await client.query(`
    ALTER TABLE public.players DROP CONSTRAINT IF EXISTS players_position_check;
    ALTER TABLE public.players ADD CONSTRAINT players_position_check 
      CHECK (position IN ('Spiker', 'Setter', 'Blocker', 'Libero', 'Tekong', 'Feeder', 'Striker', 'Killer', 'Player'));
    
    -- Drop unique constraint on (team_id, jersey_number) to allow registration roster athletes
    ALTER TABLE public.players DROP CONSTRAINT IF EXISTS players_team_id_jersey_number_key;
  `);

  console.log('✓ Successfully updated players constraints in Supabase!');
  await client.end();
}

updateSchema().catch(console.error);
