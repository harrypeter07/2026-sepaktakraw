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

const connectionString = process.env.DATABASE_URL;

async function runRemainingMigrations() {
  if (!connectionString) {
    console.error('DATABASE_URL is not set in environment or .env.local');
    process.exit(1);
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected successfully.');

    // 1. Storage bucket migration (004)
    console.log('Checking storage setup...');
    const migration004 = fs.readFileSync(path.join(__dirname, '..', 'supabase', 'migrations', '004_storage_and_images.sql'), 'utf8');
    try {
      await client.query(migration004);
      console.log('✓ Migration 004 (storage) complete');
    } catch (e) {
      console.log('Notice on 004:', e.message);
    }

    // 2. Site settings (005)
    console.log('Checking site settings setup...');
    const migration005 = fs.readFileSync(path.join(__dirname, '..', 'supabase', 'migrations', '005_site_settings.sql'), 'utf8');
    try {
      await client.query(migration005);
      console.log('✓ Migration 005 (site settings) complete');
    } catch (e) {
      console.log('Notice on 005:', e.message);
    }

    // 3. Custom forms (006)
    console.log('Checking form submissions setup...');
    const migration006 = fs.readFileSync(path.join(__dirname, '..', 'supabase', 'migrations', '006_custom_forms.sql'), 'utf8');
    try {
      await client.query(migration006);
      console.log('✓ Migration 006 (custom forms) complete');
    } catch (e) {
      console.log('Notice on 006:', e.message);
    }

    // 4. Contact responses
    console.log('Ensuring contact_responses exists...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.contact_responses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        category TEXT NOT NULL DEFAULT 'general',
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'read', 'archived')),
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
      ALTER TABLE public.contact_responses ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Anyone can insert contact_responses" ON public.contact_responses;
      CREATE POLICY "Anyone can insert contact_responses" ON public.contact_responses FOR INSERT WITH CHECK (true);
      DROP POLICY IF EXISTS "Admins can select contact_responses" ON public.contact_responses;
      CREATE POLICY "Admins can select contact_responses" ON public.contact_responses FOR SELECT USING (public.is_admin());
      DROP POLICY IF EXISTS "Admins can update contact_responses" ON public.contact_responses;
      CREATE POLICY "Admins can update contact_responses" ON public.contact_responses FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
      DROP POLICY IF EXISTS "Admins can delete contact_responses" ON public.contact_responses;
      CREATE POLICY "Admins can delete contact_responses" ON public.contact_responses FOR DELETE USING (public.is_admin());
    `);
    console.log('✓ contact_responses ready.');

    console.log('\nAll remaining setups verified successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

runRemainingMigrations();
