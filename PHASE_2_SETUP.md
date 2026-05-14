# Phase 2 Implementation Guide

## Overview
This document guides you through setting up and deploying Phase 2 of the Maharashtra Sepaktakraw Association platform.

## Prerequisites
- Supabase project created and connected via environment variables
- Node.js 18+ and pnpm installed
- All Phase 1 components still functioning (backward compatible)

## Setup Steps

### 1. Environment Variables
Create or update `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_USE_SUPABASE=false  # Start with false, enable after testing
NEXT_PUBLIC_ENABLE_REALTIME=false  # Enable once RLS policies are verified
NEXT_PUBLIC_ENABLE_ADMIN_DASHBOARD=false  # Enable after testing
NEXT_PUBLIC_ENABLE_AUTH=false  # Enable once auth is verified
```

### 2. Database Schema
1. Go to Supabase SQL Editor
2. Copy the SQL from `supabase/migrations/001_initial_schema.sql`
3. Run the SQL to create all tables, indexes, and RLS policies
4. Verify that all tables were created successfully

### 3. Test Authentication
1. Go to `http://localhost:3000/auth/signup`
2. Create a test account
3. Verify email confirmation (check Supabase auth)
4. Login with your test account
5. Check dashboard at `/dashboard`

### 4. Test API Routes
```bash
# Get all teams
curl http://localhost:3000/api/teams

# Create a tournament (requires auth)
curl -X POST http://localhost:3000/api/tournaments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Tournament",
    "start_date": "2024-06-01",
    "end_date": "2024-06-10",
    "location": "Pune",
    "format": "league"
  }'
```

### 5. Enable Features Gradually
Once testing is complete, enable features one at a time:

1. **Enable Supabase Data Source**
   - Set `NEXT_PUBLIC_USE_SUPABASE=true`
   - Test all pages load correctly
   - Verify data displays from database

2. **Enable Real-Time**
   - Set `NEXT_PUBLIC_ENABLE_REALTIME=true`
   - Test live match updates
   - Verify performance

3. **Enable Admin Dashboard**
   - Set `NEXT_PUBLIC_ENABLE_ADMIN_DASHBOARD=true`
   - Test admin features
   - Verify role-based access

4. **Enable Auth Requirement**
   - Set `NEXT_PUBLIC_ENABLE_AUTH=true`
   - Update RLS policies as needed
   - Test public vs authenticated access

## Migration Strategy

### Phase: Development (Current)
- Both localStorage and Supabase available
- Feature flags allow switching between data sources
- No data loss if reverting
- Parallel testing recommended

### Phase: Testing
- All features enabled but behind feature flags
- Users can opt-in to new features
- Gradual rollout to user groups
- Monitor performance and bugs

### Phase: Production
- All features enabled by default
- localStorage data migrated to Supabase
- Old localStorage cleared
- Full deprecation of Phase 1 data structures

## Data Migration

### Automatic Migration (Coming Soon)
```typescript
// Run in admin console to migrate existing localStorage data
async function migrateLocalStorageToSupabase() {
  const tournaments = JSON.parse(localStorage.getItem('tournaments') || '[]');
  const teams = JSON.parse(localStorage.getItem('teams') || '[]');
  const players = JSON.parse(localStorage.getItem('players') || '[]');
  
  // Batch insert into Supabase
  // This will be automated in a future update
}
```

## Testing Checklist

- [ ] Database schema created successfully
- [ ] Authentication (signup/login/logout) works
- [ ] API routes return correct data
- [ ] Dashboard displays stats
- [ ] Create tournament form submits successfully
- [ ] Create team form submits successfully
- [ ] Real-time updates work (if enabled)
- [ ] RLS policies prevent unauthorized access
- [ ] Mobile navigation works with auth buttons
- [ ] Feature flags can be toggled without errors

## Troubleshooting

### Auth Issues
- Check that Supabase URL and Anon Key are correct
- Verify email authentication is enabled in Supabase settings
- Check that `auth.users` table exists

### Database Issues
- Verify all migrations were applied
- Check RLS policies are enabled
- Ensure tables have correct schema

### API Route Issues
- Check network requests in browser DevTools
- Verify authentication token is sent
- Check Supabase logs for errors

## Next Steps

1. Deploy database schema
2. Test authentication locally
3. Test API routes
4. Enable Supabase as primary data source
5. Monitor for issues
6. Gradually enable additional features
7. Plan data migration
8. Full production rollout

## Support

For issues:
1. Check Supabase logs and error messages
2. Review RLS policy restrictions
3. Verify environment variables are set correctly
4. Check browser console for client-side errors
