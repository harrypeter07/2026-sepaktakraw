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

async function seedSettings() {
  const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();

  const settings = [
    { key: 'site.footer_logo_1', value: { url: '/official/stfi-logo.png', name: 'Sepaktakraw Federation of India' } },
    { key: 'site.footer_logo_2', value: { url: '/official/astaf-logo.jpg', name: 'Asian Sepaktakraw Federation' } },
    { key: 'site.footer_logo_3', value: { url: '/official/istaf-logo.jpg', name: 'International Sepaktakraw Federation' } },
    { key: 'site.footer_logo_4', value: { url: '/official/sai-logo.png', name: 'Sports Authority of India' } },
    { key: 'site.footer_logo_5', value: { url: '/official/fit-india.jpg', name: 'Fit India' } },
    { key: 'site.footer_logo_6', value: { url: '/official/khelo-india.jpg', name: 'Khelo India' } },
    { key: 'site.footer_logo_7', value: { url: '/official/nada-logo.jpg', name: 'National Anti-Doping Agency' } },
    { key: 'site.footer_contact_address', value: { text: 'MSTA 152-Firefox, Kamdar Bhavan, Pt. Malviya Road, Sitabuldi, Nagpur - 440012, Maharashtra, India' } },
    { key: 'site.footer_contact_phone', value: { text: '+91 94221 10610 / +91 93731 03328' } },
    { key: 'site.footer_contact_email', value: { text: 'MSTASecretary2021@gmail.com' } },
    { key: 'site.footer_title', value: { text: 'Maharashtra Sepaktakraw' } },
    { key: 'site.footer_desc', value: { text: 'The apex state governing body for Sepaktakraw in Maharashtra. Legally registered under Reg. No. MAHARASHTRA/910/98 (Nagpur), affiliated with Sepaktakraw Federation of India (STFI) & recognized by Maharashtra Olympic Association.' } }
  ];

  for (const s of settings) {
    await client.query(`
      INSERT INTO public.site_settings (key, value, updated_at)
      VALUES ($1, $2, now())
      ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = now()
    `, [s.key, s.value]);
  }

  console.log(`✓ Upserted ${settings.length} official site settings into Supabase!`);
  await client.end();
}

seedSettings().catch(console.error);
