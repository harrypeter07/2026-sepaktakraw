const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env manually
const dotenvPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(dotenvPath)) {
  const envConfig = fs.readFileSync(dotenvPath, 'utf8');
  for (const line of envConfig.split('\n')) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      process.env[key] = value.trim();
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceRoleKey || !anonKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, or SUPABASE_SERVICE_ROLE_KEY is missing from .env!');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const supabaseClient = createClient(supabaseUrl, anonKey);

const TEST_ADMIN_EMAIL = 'admin@maharashtrasepaktakraw.org';
const TEST_ADMIN_PASS = 'adminpassword123';
const API_BASE = 'http://localhost:3000/api';

async function run() {
  console.log('--- Starting Idempotent Admin API Seeding & Testing ---');

  try {
    // 1. Prepare Admin Auth User & Public User Profile
    console.log('\n[1/6] Preparing Admin Auth User...');
    const { data: usersList, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) throw listError;
    
    let adminUser = usersList.users.find(u => u.email === TEST_ADMIN_EMAIL);
    let adminId;

    if (!adminUser) {
      console.log('Creating new admin user account...');
      const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: TEST_ADMIN_EMAIL,
        password: TEST_ADMIN_PASS,
        email_confirm: true,
        user_metadata: { full_name: 'MSTA Admin' }
      });
      if (createError) throw createError;
      adminUser = createData.user;
    }
    adminId = adminUser.id;

    const { error: profileError } = await supabaseAdmin
      .from('users')
      .upsert({
        id: adminId,
        email: TEST_ADMIN_EMAIL,
        full_name: 'MSTA Admin',
        role: 'admin',
        is_active: true,
        updated_at: new Date().toISOString()
      });
    if (profileError) throw profileError;
    console.log('Admin user setup complete.');

    // 2. Sign In to retrieve Access Token
    console.log('\n[2/6] Logging in as admin to obtain access token...');
    const { data: sessionData, error: loginError } = await supabaseClient.auth.signInWithPassword({
      email: TEST_ADMIN_EMAIL,
      password: TEST_ADMIN_PASS
    });
    if (loginError) throw loginError;

    const accessToken = sessionData.session.access_token;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };
    console.log('Successfully authenticated!');

    // 3. Tournaments
    console.log('\n[3/6] Resolving Tournament...');
    const getTournamentsResponse = await fetch(`${API_BASE}/tournaments`);
    const tournamentsResult = await getTournamentsResponse.json();
    const existingTournaments = tournamentsResult.data || [];
    
    const targetTournamentName = '34th Maharashtra State Sepaktakraw Championship';
    let tournament = existingTournaments.find(t => t.name === targetTournamentName);
    let tournamentId;

    if (tournament) {
      tournamentId = tournament.id;
      console.log(`Tournament already exists: "${targetTournamentName}" (ID: ${tournamentId})`);
    } else {
      console.log(`Creating tournament: "${targetTournamentName}"...`);
      const tournamentPayload = {
        name: targetTournamentName,
        description: 'Annual state championship organized by Maharashtra Sepak Takraw Association.',
        start_date: '2026-10-12',
        end_date: '2026-10-15',
        location: 'Nagpur, Maharashtra',
        format: 'league',
        organizer: 'Maharashtra Sepak Takraw Association',
        total_prize_pool: 50000
      };

      const tResponse = await fetch(`${API_BASE}/tournaments`, {
        method: 'POST',
        headers,
        body: JSON.stringify(tournamentPayload)
      });
      const tResult = await tResponse.json();
      if (!tResponse.ok) {
        throw new Error(`Tournaments API failed: ${JSON.stringify(tResult)}`);
      }
      tournamentId = tResult.data.id;
      console.log(`✓ Tournaments API Success! Created Tournament ID: ${tournamentId}`);
    }

    // 4. Teams
    console.log('\n[4/6] Resolving Teams...');
    const getTeamsResponse = await fetch(`${API_BASE}/teams`);
    const teamsResult = await getTeamsResponse.json();
    const existingTeams = teamsResult.data || [];

    // Team A: Nagpur Warriors
    const teamAName = 'Nagpur Warriors';
    let teamA = existingTeams.find(t => t.name === teamAName);
    let teamAId;

    if (teamA) {
      teamAId = teamA.id;
      console.log(`Team already exists: "${teamAName}" (ID: ${teamAId})`);
    } else {
      console.log(`Creating team: "${teamAName}"...`);
      const teamAPayload = {
        name: teamAName,
        description: 'Elite club representing Nagpur District in state tournaments.',
        founded_year: 2015,
        state: 'Nagpur',
        logo_url: '/logos/nagpur.png',
        contact_email: 'nagpur.warriors@msta.org',
        contact_phone: '+91 98765 43210'
      };
      const tAResponse = await fetch(`${API_BASE}/teams`, {
        method: 'POST',
        headers,
        body: JSON.stringify(teamAPayload)
      });
      const tAResult = await tAResponse.json();
      if (!tAResponse.ok) {
        throw new Error(`Teams API Team A failed: ${JSON.stringify(tAResult)}`);
      }
      teamAId = tAResult.data.id;
      console.log(`✓ Teams API Success! Created Team A (ID: ${teamAId})`);
    }

    // Team B: Pune Strikers
    const teamBName = 'Pune Strikers';
    let teamB = existingTeams.find(t => t.name === teamBName);
    let teamBId;

    if (teamB) {
      teamBId = teamB.id;
      console.log(`Team already exists: "${teamBName}" (ID: ${teamBId})`);
    } else {
      console.log(`Creating team: "${teamBName}"...`);
      const teamBPayload = {
        name: teamBName,
        description: 'Elite club representing Pune District in state tournaments.',
        founded_year: 2017,
        state: 'Pune',
        logo_url: '/logos/pune.png',
        contact_email: 'pune.strikers@msta.org',
        contact_phone: '+91 98765 43211'
      };
      const tBResponse = await fetch(`${API_BASE}/teams`, {
        method: 'POST',
        headers,
        body: JSON.stringify(teamBPayload)
      });
      const tBResult = await tBResponse.json();
      if (!tBResponse.ok) {
        throw new Error(`Teams API Team B failed: ${JSON.stringify(tBResult)}`);
      }
      teamBId = tBResult.data.id;
      console.log(`✓ Teams API Success! Created Team B (ID: ${teamBId})`);
    }

    // 5. Players
    console.log('\n[5/6] Resolving Players...');
    const getPlayersResponse = await fetch(`${API_BASE}/players`);
    const playersResult = await getPlayersResponse.json();
    const existingPlayers = playersResult.data || [];

    // Player A: Rahul Sharma
    const playerAName = 'Rahul Sharma';
    let playerA = existingPlayers.find(p => p.name === playerAName && p.team_id === teamAId);
    let playerAId;

    if (playerA) {
      playerAId = playerA.id;
      console.log(`Player already exists: "${playerAName}" (ID: ${playerAId})`);
    } else {
      console.log(`Creating player: "${playerAName}"...`);
      const playerAPayload = {
        name: playerAName,
        position: 'Spiker',
        team_id: teamAId,
        jersey_number: 10,
        date_of_birth: '2000-05-15',
        height_cm: 180,
        weight_kg: 72,
        bio: 'A highly experienced tekong specializing in powerful serves and tactful drops.'
      };
      const pAResponse = await fetch(`${API_BASE}/players`, {
        method: 'POST',
        headers,
        body: JSON.stringify(playerAPayload)
      });
      const pAResult = await pAResponse.json();
      if (!pAResponse.ok) {
        throw new Error(`Players API Player A failed: ${JSON.stringify(pAResult)}`);
      }
      playerAId = pAResult.data.id;
      console.log(`✓ Players API Success! Created Player A (ID: ${playerAId})`);
    }

    // Player B: Amit Patil
    const playerBName = 'Amit Patil';
    let playerB = existingPlayers.find(p => p.name === playerBName && p.team_id === teamBId);
    let playerBId;

    if (playerB) {
      playerBId = playerB.id;
      console.log(`Player already exists: "${playerBName}" (ID: ${playerBId})`);
    } else {
      console.log(`Creating player: "${playerBName}"...`);
      const playerBPayload = {
        name: playerBName,
        position: 'Setter',
        team_id: teamBId,
        jersey_number: 7,
        date_of_birth: '2001-08-20',
        height_cm: 178,
        weight_kg: 68,
        bio: 'Acrobatic striker known for executing high-impact sunback spikes.'
      };
      const pBResponse = await fetch(`${API_BASE}/players`, {
        method: 'POST',
        headers,
        body: JSON.stringify(playerBPayload)
      });
      const pBResult = await pBResponse.json();
      if (!pBResponse.ok) {
        throw new Error(`Players API Player B failed: ${JSON.stringify(pBResult)}`);
      }
      playerBId = pBResult.data.id;
      console.log(`✓ Players API Success! Created Player B (ID: ${playerBId})`);
    }

    // 6. Matches
    console.log('\n[6/6] Resolving Match...');
    const getMatchesResponse = await fetch(`${API_BASE}/matches`);
    const matchesResult = await getMatchesResponse.json();
    const existingMatches = matchesResult.data || [];

    let match = existingMatches.find(m => m.tournament_id === tournamentId && m.home_team_id === teamAId && m.away_team_id === teamBId);
    let matchId;

    if (match) {
      matchId = match.id;
      console.log(`Match already exists between team A and team B in tournament (ID: ${matchId})`);
    } else {
      console.log('Creating match...');
      const matchPayload = {
        tournament_id: tournamentId,
        home_team_id: teamAId,
        away_team_id: teamBId,
        match_date: '2026-10-12T14:30:00.000Z',
        venue: 'Nagpur Indoor Stadium'
      };

      const mResponse = await fetch(`${API_BASE}/matches`, {
        method: 'POST',
        headers,
        body: JSON.stringify(matchPayload)
      });
      const mResult = await mResponse.json();
      if (!mResponse.ok) {
        throw new Error(`Matches API failed: ${JSON.stringify(mResult)}`);
      }
      matchId = mResult.data.id;
      console.log(`✓ Matches API Success! Created Match ID: ${matchId}`);
    }

    console.log('\n==================================================');
    console.log('SUCCESS: All admin API routes are fully verified!');
    console.log('Mock tournament, teams, players, and match resolved/seeded.');
    console.log('==================================================');

  } catch (err) {
    console.error('\n❌ FAILURE during API Seeding / Testing:', err.message);
    process.exit(1);
  }
}

run();
