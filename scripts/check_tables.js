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

async function check() {
  const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name");
  console.log('Public tables in Supabase:');
  for (const row of res.rows) {
    try {
      const countRes = await client.query('SELECT count(*) FROM public."' + row.table_name + '"');
      console.log(' - ' + row.table_name.padEnd(25) + ': ' + countRes.rows[0].count + ' rows');
    } catch (e) {
      console.log(' - ' + row.table_name.padEnd(25) + ': (cannot count: ' + e.message + ')');
    }
  }
  await client.end();
}
check();
