/**
 * Full seed script: 
 * 1. Clears stale DB data
 * 2. Seeds all app data (teams, players, tournaments, matches, match_sets, articles)
 * 3. Creates missing tables: contact_responses, form_submissions (via Supabase RPC is unavailable, so we do REST upserts)
 * 
 * Run: node scripts/seed-db.js
 */

const fs = require('fs');
const path = require('path');

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

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://chcjyndgliurrmhzjmoh.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is required in .env.local to run seed script.');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  'apikey': SERVICE_ROLE_KEY,
  'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
  'Prefer': 'return=representation',
};

async function rest(method, path, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} failed (${res.status}): ${text}`);
  return text ? JSON.parse(text) : null;
}

async function clearTable(table) {
  // Delete all rows
  await rest('DELETE', `${table}?id=neq.00000000-0000-0000-0000-000000000000`);
  console.log(`  ✓ Cleared ${table}`);
}

// ─────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────

const ADMIN_USER_ID = '2c97748f-707d-48e7-8679-42836dc754d0'; // existing user in DB

const TEAMS = [
  { id: 'aaaaaaaa-0001-0000-0000-000000000001', name: 'Nagpur Titans', description: 'Elite district team representing Nagpur in MSTA championships.', founded_year: 2016, state: 'Nagpur, Maharashtra', logo_url: '/logos/nagpur.jpeg', contact_email: 'nagpur@msta.org', contact_phone: '+91 98765 43210', created_by: ADMIN_USER_ID, coach: 'Shri. Amit Ramesh Kanwar' },
  { id: 'aaaaaaaa-0002-0000-0000-000000000002', name: 'Solapur Knights', description: 'District champions from Solapur competing at state level.', founded_year: 2018, state: 'Solapur, Maharashtra', logo_url: '/logos/solapur.png', contact_email: 'solapur@msta.org', contact_phone: '+91 98765 43211', created_by: ADMIN_USER_ID, coach: 'Shri. Mahesh Gaikwad' },
  { id: 'aaaaaaaa-0003-0000-0000-000000000003', name: 'Nanded Panthers', description: 'Competitive team from Nanded district.', founded_year: 2019, state: 'Nanded, Maharashtra', logo_url: '/logos/nanded.jpeg', contact_email: 'nanded@msta.org', contact_phone: '+91 98765 43212', created_by: ADMIN_USER_ID, coach: 'Shri. Govind Pawar' },
  { id: 'aaaaaaaa-0004-0000-0000-000000000004', name: 'Wardha Warriors', description: 'Strong contenders from Wardha district.', founded_year: 2017, state: 'Wardha, Maharashtra', logo_url: '/logos/wardha.jpeg', contact_email: 'wardha@msta.org', contact_phone: '+91 98765 43213', created_by: ADMIN_USER_ID, coach: 'Shri. Vinay Divakar Moon' },
  { id: 'aaaaaaaa-0005-0000-0000-000000000005', name: 'Nashik Strikers', description: 'Fast-rising team from Nashik.', founded_year: 2018, state: 'Nashik, Maharashtra', logo_url: '/logos/nashik.png', contact_email: 'nashik@msta.org', contact_phone: '+91 98765 43214', created_by: ADMIN_USER_ID, coach: 'Shri. Nilesh Shinde' },
  { id: 'aaaaaaaa-0006-0000-0000-000000000006', name: 'Jalgaon Blasters', description: 'Youth-heavy team from Jalgaon district.', founded_year: 2020, state: 'Jalgaon, Maharashtra', logo_url: '/logos/jalgaon.jpeg', contact_email: 'jalgaon@msta.org', contact_phone: '+91 98765 43215', created_by: ADMIN_USER_ID, coach: 'Shri. Chetan G. Sawant' },
  { id: 'aaaaaaaa-0007-0000-0000-000000000007', name: 'Chhatrapati Sambhajinagar Tigers', description: 'Formidable team from Chhatrapati Sambhaji Nagar.', founded_year: 2019, state: 'Chhatrapati Sambhaji Nagar, Maharashtra', logo_url: '/logos/chhatrapati-sambhajinagar.jpeg', contact_email: 'csn@msta.org', contact_phone: '+91 98765 43216', created_by: ADMIN_USER_ID, coach: 'Shri. Sandeep Jadhav' },
  { id: 'aaaaaaaa-0008-0000-0000-000000000008', name: 'Amravati Phoenix', description: 'Rising squad from Amravati district.', founded_year: 2018, state: 'Amravati, Maharashtra', logo_url: '/logos/amravati.jpeg', contact_email: 'amravati@msta.org', contact_phone: '+91 98765 43217', created_by: ADMIN_USER_ID, coach: 'Shri. Pramod R. Patil' },
  { id: 'aaaaaaaa-0009-0000-0000-000000000009', name: 'Pune Eagles', description: 'Top club from Pune competing across all age groups.', founded_year: 2017, state: 'Pune, Maharashtra', logo_url: '/logos/pune.jpeg', contact_email: 'pune@msta.org', contact_phone: '+91 98765 43218', created_by: ADMIN_USER_ID, coach: 'Shri. Vikram Patil' },
  { id: 'aaaaaaaa-000a-0000-0000-00000000000a', name: 'Mumbai Suburban Warriors', description: 'Urban powerhouse from Mumbai Suburban.', founded_year: 2016, state: 'Mumbai Suburban, Maharashtra', logo_url: '/logos/mumbai-suburban.jpeg', contact_email: 'mumbai@msta.org', contact_phone: '+91 98765 43219', created_by: ADMIN_USER_ID, coach: 'Shri. Rajesh Sawant' },
  { id: 'aaaaaaaa-000b-0000-0000-00000000000b', name: 'Gondia Gladiators', description: 'Emerging force from Gondia district.', founded_year: 2021, state: 'Gondia, Maharashtra', logo_url: '/logos/gondia.jpeg', contact_email: 'gondia@msta.org', contact_phone: '+91 98765 43220', created_by: ADMIN_USER_ID, coach: 'Shri. Sunil T. Gavande' },
  { id: 'aaaaaaaa-000c-0000-0000-00000000000c', name: 'Kolhapur Rollers', description: 'Traditional powerhouse from Kolhapur.', founded_year: 2019, state: 'Kolhapur, Maharashtra', logo_url: '/logos/kolhapur.jpeg', contact_email: 'kolhapur@msta.org', contact_phone: '+91 98765 43221', created_by: ADMIN_USER_ID, coach: 'Shri. Rohan Kadam' },
];

const PLAYERS = [
  // Nagpur Titans
  { name: 'Ashit Shrivas', position: 'Setter', team_id: 'aaaaaaaa-0001-0000-0000-000000000001', jersey_number: 4, height: "5'9\"", weight: '68 kg', height_cm: 175, weight_kg: 68, bio: 'Skilled feeder known for precision ball placement.', photo_url: '/players/ashit.jpg' },
  { name: 'Altamash Pasha', position: 'Setter', team_id: 'aaaaaaaa-0001-0000-0000-000000000001', jersey_number: 6, height: "5'11\"", weight: '70 kg', height_cm: 180, weight_kg: 70, bio: 'Elite tekong with powerful cross-court serves.', photo_url: '/players/altamash.jpg' },
  { name: 'Kunal Evanate', position: 'Spiker', team_id: 'aaaaaaaa-0001-0000-0000-000000000001', jersey_number: 9, height: "6'0\"", weight: '73 kg', height_cm: 183, weight_kg: 73, bio: 'Explosive killer with dominant spike execution.', photo_url: '/players/kunal.jpg' },
  { name: 'Mohammad Sohail', position: 'Spiker', team_id: 'aaaaaaaa-0001-0000-0000-000000000001', jersey_number: 11, height: "6'1\"", weight: '74 kg', height_cm: 185, weight_kg: 74, bio: 'Powerful spiker with cross-court precision.', photo_url: '/players/sohail.jpg' },
  { name: 'Shahnawaz Khan', position: 'Spiker', team_id: 'aaaaaaaa-0001-0000-0000-000000000001', jersey_number: 15, height: "6'0\"", weight: '72 kg', height_cm: 183, weight_kg: 72, bio: 'Dynamic killer known for acrobatic strikes.', photo_url: '/players/shahnawaz.jpg' },
  { name: 'Chetana Sankaram Rongala', position: 'Setter', team_id: 'aaaaaaaa-0001-0000-0000-000000000001', jersey_number: 2, height: "5'8\"", weight: '60 kg', height_cm: 173, weight_kg: 60, bio: 'Women state squad tekong and Nagpur captain.', photo_url: '/players/chetana.jpg' },
  // Wardha Warriors
  { name: 'Lekhanshu Ladke', position: 'Setter', team_id: 'aaaaaaaa-0004-0000-0000-000000000004', jersey_number: 2, height: "5'10\"", weight: '69 kg', height_cm: 178, weight_kg: 69, bio: 'National squad tekong with powerful baseline drops.', photo_url: '/players/lekhanshu.jpg' },
  { name: 'Vijaysingh Tomar', position: 'Setter', team_id: 'aaaaaaaa-0004-0000-0000-000000000004', jersey_number: 5, height: "5'11\"", weight: '71 kg', height_cm: 180, weight_kg: 71, bio: 'Veteran tekong and Wardha team captain.', photo_url: '/players/vijay.jpg' },
  { name: 'Om Muley', position: 'Setter', team_id: 'aaaaaaaa-0004-0000-0000-000000000004', jersey_number: 13, height: "5'8\"", weight: '66 kg', height_cm: 173, weight_kg: 66, bio: 'Dependable feeder with strong defensive reads.', photo_url: '/players/om.jpg' },
  // Amravati
  { name: 'Aniket Kale', position: 'Spiker', team_id: 'aaaaaaaa-0008-0000-0000-000000000008', jersey_number: 1, height: "6'1\"", weight: '75 kg', height_cm: 185, weight_kg: 75, bio: 'Lead killer for Maharashtra state squad.', photo_url: '/players/kunal.jpg' },
  // Jalgaon
  { name: 'Shaikh Faizan', position: 'Spiker', team_id: 'aaaaaaaa-0006-0000-0000-000000000006', jersey_number: 3, height: "6'0\"", weight: '72 kg', height_cm: 183, weight_kg: 72, bio: 'Powerful killer from Jalgaon district.', photo_url: '/players/faizan.jpg' },
  // Gondia
  { name: 'Sandip Meshram', position: 'Spiker', team_id: 'aaaaaaaa-000b-0000-0000-00000000000b', jersey_number: 7, height: "5'11\"", weight: '70 kg', height_cm: 180, weight_kg: 70, bio: 'Versatile spike-and-block specialist.', photo_url: '/players/sandip.jpg' },
  // Nashik
  { name: 'Sukumar Tiwari', position: 'Setter', team_id: 'aaaaaaaa-0005-0000-0000-000000000005', jersey_number: 8, height: "5'10\"", weight: '68 kg', height_cm: 178, weight_kg: 68, bio: 'Senior tekong and Nashik team pillar.', photo_url: '/players/sandeep.jpg' },
  { name: 'Amol Rathod', position: 'Setter', team_id: 'aaaaaaaa-0005-0000-0000-000000000005', jersey_number: 12, height: "5'11\"", weight: '70 kg', height_cm: 180, weight_kg: 70, bio: 'Aggressive tekong known for fast serves.', photo_url: '/players/vinay.jpeg' },
  { name: 'Madhura Anant Tepale', position: 'Setter', team_id: 'aaaaaaaa-0005-0000-0000-000000000005', jersey_number: 3, height: "5'6\"", weight: '56 kg', height_cm: 168, weight_kg: 56, bio: 'Women state squad feeder from Nashik.', photo_url: '/players/madhura.jpg' },
  // Nanded
  { name: 'Asang Jondhale', position: 'Setter', team_id: 'aaaaaaaa-0003-0000-0000-000000000003', jersey_number: 14, height: "5'10\"", weight: '67 kg', height_cm: 178, weight_kg: 67, bio: 'Consistent tekong and Nanded captain.', photo_url: '/players/asang.jpg' },
  // Solapur
  { name: 'Apeksha Anil Dadas', position: 'Spiker', team_id: 'aaaaaaaa-0002-0000-0000-000000000002', jersey_number: 1, height: "5'7\"", weight: '58 kg', height_cm: 170, weight_kg: 58, bio: 'Lead women killer and state squad star.', photo_url: '/players/apeksha.jpg' },
  // Pune Eagles
  { name: 'Aditya Shinde', position: 'Setter', team_id: 'aaaaaaaa-0009-0000-0000-000000000009', jersey_number: 7, height: "5'11\"", weight: '70 kg', height_cm: 180, weight_kg: 70, bio: 'Tekong with exceptional footwork.', photo_url: '/hero/gallery_1.jpg' },
  { name: 'Rohan Mane', position: 'Spiker', team_id: 'aaaaaaaa-0009-0000-0000-000000000009', jersey_number: 10, height: "6'0\"", weight: '73 kg', height_cm: 183, weight_kg: 73, bio: 'Killer with high spike success rate.', photo_url: '/hero/gallery_2.jpg' },
  // Mumbai Suburban
  { name: 'Tanmay Kadam', position: 'Spiker', team_id: 'aaaaaaaa-000a-0000-0000-00000000000a', jersey_number: 18, height: "6'1\"", weight: '74 kg', height_cm: 185, weight_kg: 74, bio: 'Dominant spiker from Mumbai Suburban.', photo_url: '/hero/gallery_4.jpg' },
  { name: 'Saurabh Varma', position: 'Setter', team_id: 'aaaaaaaa-000a-0000-0000-00000000000a', jersey_number: 21, height: "5'10\"", weight: '69 kg', height_cm: 178, weight_kg: 69, bio: 'Tekong with national-level experience.', photo_url: '/hero/gallery_5.jpg' },
  // CSN Tigers
  { name: 'Vaibhav Pawar', position: 'Spiker', team_id: 'aaaaaaaa-0007-0000-0000-000000000007', jersey_number: 99, height: "6'0\"", weight: '75 kg', height_cm: 183, weight_kg: 75, bio: 'Power killer and team leader.', photo_url: '/hero/gallery_3.jpg' },
  { name: 'Sagar Bhosle', position: 'Setter', team_id: 'aaaaaaaa-0007-0000-0000-000000000007', jersey_number: 5, height: "5'10\"", weight: '68 kg', height_cm: 178, weight_kg: 68, bio: 'Quick tekong with strong reading ability.', photo_url: '/hero/gallery_4.jpg' },
];

const TOURNAMENTS = [
  { id: 'bbbbbbbb-0001-0000-0000-000000000001', name: '36th Senior Maharashtra State Sepaktakraw Championship 2026 (Men & Women)', description: 'The premier annual state championship bringing together the best senior district teams from across Maharashtra. Features Regu, Double Regu, Quad, and Team events to scout the state squad for the National Championship.', start_date: '2026-06-04', end_date: '2026-06-07', location: 'Divisional Sports Complex, Mankapur, Nagpur, Maharashtra', format: 'league', status: 'ongoing', organizer: 'Nagpur District Sepaktakraw Association & MSTA', total_prize_pool: 350000, max_teams: 22, image_url: '/hero/tournaments_hero.jpg', created_by: ADMIN_USER_ID },
  { id: 'bbbbbbbb-0002-0000-0000-000000000002', name: '27th Junior State Sepaktakraw Championship 2026', description: 'State junior level tournament featuring under-19 district athletes competing in Regu and Team events for state junior colors.', start_date: '2026-07-10', end_date: '2026-07-14', location: 'Shree Shiv Chhatrapati Sports Complex, Balewadi, Pune, Maharashtra', format: 'group_stage', status: 'upcoming', organizer: 'Maharashtra Sepaktakraw Association & Pune District Unit', total_prize_pool: 200000, max_teams: 20, image_url: '/hero/gallery_4.jpg', created_by: ADMIN_USER_ID },
  { id: 'bbbbbbbb-0003-0000-0000-000000000003', name: 'Maharashtra State Sub-Junior Sepaktakraw Championship 2026', description: 'Grassroots championship for under-14 players across all 20 affiliated district units.', start_date: '2026-08-15', end_date: '2026-08-19', location: 'Khashaba Jadhav Sports Complex, Kolhapur, Maharashtra', format: 'knockout', status: 'upcoming', organizer: 'Amateur Kolhapur District Sepak Takraw Association', total_prize_pool: 150000, max_teams: 18, image_url: '/hero/gallery_2.jpg', created_by: ADMIN_USER_ID },
  { id: 'bbbbbbbb-0004-0000-0000-000000000004', name: '35th Senior Maharashtra State Sepaktakraw Championship 2025', description: 'Concluded state championship where Nagpur and Wardha contested the men team final and Solapur claimed women titles.', start_date: '2025-12-08', end_date: '2025-12-12', location: 'District Sports Complex, Wardha, Maharashtra', format: 'knockout', status: 'completed', organizer: 'Wardha District Sepaktakraw Association', total_prize_pool: 250000, max_teams: 20, image_url: '/hero/gallery_5.jpg', created_by: ADMIN_USER_ID },
  { id: 'bbbbbbbb-0005-0000-0000-000000000005', name: 'Maharashtra State Coaching Camp & Selection Trials 2025', description: 'High performance coaching camp led by National Coach Sandeep Saroha to prepare the state squad for National Games.', start_date: '2025-10-03', end_date: '2025-10-26', location: 'Shree Shiv Chhatrapati Sports Complex, Pune, Maharashtra', format: 'league', status: 'completed', organizer: 'MSTA Technical Committee', total_prize_pool: 100000, max_teams: 16, image_url: '/hero/gallery_3.jpg', created_by: ADMIN_USER_ID },
  { id: 'bbbbbbbb-0006-0000-0000-000000000006', name: 'Maharashtra State Beach Sepaktakraw Trophy 2026', description: 'High-energy beach Sepaktakraw tournament on sand under international ASTAF beach rules.', start_date: '2026-10-15', end_date: '2026-10-19', location: 'Versova Beach Arena, Mumbai Suburban, Maharashtra', format: 'knockout', status: 'upcoming', organizer: 'MSTA Beach Committee', total_prize_pool: 150000, max_teams: 12, image_url: '/hero/gallery_6.jpg', created_by: ADMIN_USER_ID },
];

const MATCHES = [
  { id: 'cccccccc-0001-0000-0000-000000000001', tournament_id: 'bbbbbbbb-0001-0000-0000-000000000001', home_team_id: 'aaaaaaaa-0001-0000-0000-000000000001', away_team_id: 'aaaaaaaa-0004-0000-0000-000000000004', match_date: '2026-06-05T15:30:00+05:30', venue: 'Court 1, Divisional Sports Complex, Mankapur, Nagpur', status: 'live', home_score: 1, away_score: 1, duration_minutes: 52 },
  { id: 'cccccccc-0002-0000-0000-000000000002', tournament_id: 'bbbbbbbb-0001-0000-0000-000000000001', home_team_id: 'aaaaaaaa-0002-0000-0000-000000000002', away_team_id: 'aaaaaaaa-0003-0000-0000-000000000003', match_date: '2026-06-05T17:00:00+05:30', venue: 'Court 2, Divisional Sports Complex, Mankapur, Nagpur', status: 'scheduled', home_score: 0, away_score: 0, duration_minutes: null },
  { id: 'cccccccc-0003-0000-0000-000000000003', tournament_id: 'bbbbbbbb-0001-0000-0000-000000000001', home_team_id: 'aaaaaaaa-0005-0000-0000-000000000005', away_team_id: 'aaaaaaaa-0006-0000-0000-000000000006', match_date: '2026-06-06T10:00:00+05:30', venue: 'Court 1, Divisional Sports Complex, Mankapur, Nagpur', status: 'scheduled', home_score: 0, away_score: 0, duration_minutes: null },
  { id: 'cccccccc-0004-0000-0000-000000000004', tournament_id: 'bbbbbbbb-0004-0000-0000-000000000004', home_team_id: 'aaaaaaaa-0004-0000-0000-000000000004', away_team_id: 'aaaaaaaa-0001-0000-0000-000000000001', match_date: '2025-12-12T18:30:00+05:30', venue: 'Indoor Stadium, Wardha', status: 'completed', home_score: 2, away_score: 1, duration_minutes: 58 },
  { id: 'cccccccc-0005-0000-0000-000000000005', tournament_id: 'bbbbbbbb-0004-0000-0000-000000000004', home_team_id: 'aaaaaaaa-0002-0000-0000-000000000002', away_team_id: 'aaaaaaaa-0005-0000-0000-000000000005', match_date: '2025-12-11T16:00:00+05:30', venue: 'Indoor Stadium, Wardha', status: 'completed', home_score: 2, away_score: 0, duration_minutes: 41 },
  { id: 'cccccccc-0006-0000-0000-000000000006', tournament_id: 'bbbbbbbb-0002-0000-0000-000000000002', home_team_id: 'aaaaaaaa-0009-0000-0000-000000000009', away_team_id: 'aaaaaaaa-000a-0000-0000-00000000000a', match_date: '2026-07-10T11:00:00+05:30', venue: 'Balewadi Sports Complex, Pune', status: 'scheduled', home_score: 0, away_score: 0, duration_minutes: null },
];

const MATCH_SETS = [
  // Match 1 (Nagpur vs Wardha - live)
  { match_id: 'cccccccc-0001-0000-0000-000000000001', set_number: 1, home_points: 21, away_points: 18 },
  { match_id: 'cccccccc-0001-0000-0000-000000000001', set_number: 2, home_points: 19, away_points: 21 },
  { match_id: 'cccccccc-0001-0000-0000-000000000001', set_number: 3, home_points: 15, away_points: 13 },
  // Match 4 (Wardha vs Nagpur - completed)
  { match_id: 'cccccccc-0004-0000-0000-000000000004', set_number: 1, home_points: 21, away_points: 17 },
  { match_id: 'cccccccc-0004-0000-0000-000000000004', set_number: 2, home_points: 18, away_points: 21 },
  { match_id: 'cccccccc-0004-0000-0000-000000000004', set_number: 3, home_points: 21, away_points: 19 },
  // Match 5 (Solapur vs Nashik - completed)
  { match_id: 'cccccccc-0005-0000-0000-000000000005', set_number: 1, home_points: 21, away_points: 16 },
  { match_id: 'cccccccc-0005-0000-0000-000000000005', set_number: 2, home_points: 21, away_points: 14 },
];

const ARTICLES = [
  { title: '36th Senior Maharashtra State Sepaktakraw Championship 2026 Commences in Nagpur', content: 'The 36th Senior Maharashtra State Sepaktakraw Championship for Men and Women kicked off at the Divisional Sports Complex in Mankapur, Nagpur. Hosted by the Nagpur District Sepaktakraw Association under the aegis of the Maharashtra Sepaktakraw Association (MSTA), the four-day championship has attracted over 350 athletes from 22 district units across Maharashtra. Matches will be conducted in Regu, Double Regu, Quad, and Team categories, with live electronic scoring and ASTAF official oversight.', category: 'tournament', featured_image_url: '/hero/news_hero.jpg', is_published: true, published_at: '2026-06-04T10:00:00Z', author_id: ADMIN_USER_ID },
  { title: 'MSTA Unveils Official Maharashtra State Squad for Senior National Championship', content: 'The Maharashtra Sepaktakraw Association selection committee has officially finalized the 15-member men squad and women squad for the upcoming Senior National Sepaktakraw Championship. Led by National Coach Sandeep Ramkanwar Saroha and Team Manager Amit Ramesh Kanwar, the squad features seasoned spikers Aniket Kale, Kunal Evanate, and Shahnawaz Khan alongside stellar Tekongs Lekhanshu Ladke and Altamash Pasha. The women contingent is headlined by Apeksha Dadas and Chetana Rongala.', category: 'team', featured_image_url: '/hero/gallery_1.jpg', is_published: true, published_at: '2026-05-28T14:30:00Z', author_id: ADMIN_USER_ID },
  { title: 'Nagpur, Solapur, and Wardha Lead Historical State Championship Medal Tally', content: 'According to official MSTA records spanning 2021 through 2026, Nagpur, Solapur, Nanded, and Wardha hold the top podium standings across state championships. With over 240 medal finishes recorded in Senior, Junior, and Sub-Junior divisions, Maharashtra district associations continue to showcase exceptional athlete development and competitive depth.', category: 'news', featured_image_url: '/hero/gallery_7.jpg', is_published: true, published_at: '2026-05-15T09:00:00Z', author_id: ADMIN_USER_ID },
  { title: 'MSTA Grassroots Coaching Clinic and Referee Certification Concludes in Kolhapur', content: 'A three-day technical referee clinic and youth grassroots development program concluded at Khashaba Jadhav Sports Complex in Kolhapur. Over 45 technical officials from 20 district associations completed their Level-2 certification, ensuring high standards of judging and officiating for upcoming championships.', category: 'other', featured_image_url: '/hero/milestone_3.jpg', is_published: true, published_at: '2026-04-10T12:00:00Z', author_id: ADMIN_USER_ID },
];

// ─────────────────────────────────────────────────────────────────
// SEED
// ─────────────────────────────────────────────────────────────────

async function seed() {
  console.log('🌱 Starting DB seed...\n');

  // 1. Clear in reverse dependency order
  console.log('Clearing existing data...');
  await clearTable('match_sets');
  await clearTable('matches');
  await clearTable('tournament_teams');
  await clearTable('articles');
  await clearTable('players');
  await clearTable('tournaments');
  await clearTable('teams');

  // 2. Insert Teams
  console.log('\nSeeding teams...');
  const teamsResult = await rest('POST', 'teams', TEAMS);
  console.log(`  ✓ Inserted ${teamsResult?.length ?? TEAMS.length} teams`);

  // 3. Insert Tournaments
  console.log('Seeding tournaments...');
  const tourResult = await rest('POST', 'tournaments', TOURNAMENTS);
  console.log(`  ✓ Inserted ${tourResult?.length ?? TOURNAMENTS.length} tournaments`);

  // 4. Insert Players
  console.log('Seeding players...');
  const playersResult = await rest('POST', 'players', PLAYERS);
  console.log(`  ✓ Inserted ${playersResult?.length ?? PLAYERS.length} players`);

  // 5. Insert Matches
  console.log('Seeding matches...');
  const matchesResult = await rest('POST', 'matches', MATCHES);
  console.log(`  ✓ Inserted ${matchesResult?.length ?? MATCHES.length} matches`);

  // 6. Insert Match Sets
  console.log('Seeding match sets...');
  const setsResult = await rest('POST', 'match_sets', MATCH_SETS);
  console.log(`  ✓ Inserted ${setsResult?.length ?? MATCH_SETS.length} match sets`);

  // 7. Insert Articles
  console.log('Seeding articles...');
  const articlesResult = await rest('POST', 'articles', ARTICLES);
  console.log(`  ✓ Inserted ${articlesResult?.length ?? ARTICLES.length} articles`);

  // 8. Insert tournament_teams links
  console.log('Seeding tournament_teams...');
  const ttLinks = TEAMS.slice(0, 8).map((t, i) => ({
    tournament_id: 'bbbbbbbb-0001-0000-0000-000000000001',
    team_id: t.id,
    seeding_rank: i + 1,
  }));
  const ttResult = await rest('POST', 'tournament_teams', ttLinks);
  console.log(`  ✓ Inserted ${ttResult?.length ?? ttLinks.length} tournament_team links`);

  console.log('\n✅ Seed complete!\n');

  // 9. Verify
  console.log('=== Verification ===');
  const tables = ['teams', 'tournaments', 'players', 'matches', 'match_sets', 'articles', 'tournament_teams'];
  for (const t of tables) {
    const rows = await rest('GET', `${t}?select=id`);
    console.log(`  ${t.padEnd(20)} ${rows?.length ?? 0} rows`);
  }
}

seed().catch(e => {
  console.error('❌ Seed failed:', e.message);
  process.exit(1);
});
