# Phase 3: Multi-Portal Federation System Documentation

## Overview

Phase 3 transforms the Maharashtra Sepaktakraw Association platform into a sophisticated multi-portal federation system with role-based access control (RBAC), subdomain-based routing, and district-level governance.

## Architecture

### Portal Structure

The platform now runs as a single Next.js application serving three distinct portals via subdomain routing:

1. **Public Portal** (main domain)
   - No authentication required
   - View-only access to tournaments, teams, players, news
   - Sign-up and login interface

2. **Admin Portal** (admin.domain.com)
   - Full system administration
   - User and role management
   - All data management and reporting
   - Audit logs and system settings

3. **Officials Portal** (officials.domain.com or officials-mumbai.domain.com)
   - District-level management
   - Tournament and match coordination
   - Match scoring and result approval
   - District-scoped reporting

### Middleware & Routing

**middleware.ts** implements subdomain detection and automatic routing:
- Parses incoming request hostname
- Sets `x-portal-type` header (public, admin, officials)
- Redirects based on portal type and route
- Protects routes from cross-portal access

### RBAC System

#### Roles Hierarchy

```
super_admin (level 0)
├── Full system access
├── Can manage all users and roles
└── Can access all portals

admin (level 1)
├── Administrative functions
├── User and role management
└── All data operations

district_official (level 2)
├── District-level operations
├── Scoped to specific district
└── Can't access other districts

tournament_manager (level 3)
├── Create and manage tournaments
└── Match scoring

team_manager (level 4)
├── Manage own team
└── Player management

viewer (level 5)
└── Read-only access
```

#### Permission System

Permissions follow the format: `module:action`
- **Modules**: users, tournaments, matches, teams, players, reports, roles
- **Actions**: create, read, update, delete, approve

Example permissions:
- `tournaments:create` - Can create tournaments
- `matches:score` - Can update match scores
- `users:delete` - Can delete users
- `reports:export` - Can export reports

#### User Roles Table

The `user_roles` table links users to roles with optional scoping:
- `user_id`: User reference
- `role_id`: Role reference
- `scope_state_id`: (Optional) Restrict to specific state
- `scope_district_id`: (Optional) Restrict to specific district
- `assigned_by`: Admin who assigned the role

### Database Schema Enhancements

#### New Tables

**states**
```sql
id, code (MH), name (Maharashtra), created_at
```

**districts**
```sql
id, state_id, code, name, created_at
```

**roles**
```sql
id, name, description, level, created_at
```

**permissions**
```sql
id, name (e.g., 'tournaments:create'), description, module, action, created_at
```

**role_permissions**
```sql
id, role_id, permission_id, created_at
-- Junction table linking roles to permissions
```

**user_roles**
```sql
id, user_id, role_id, scope_state_id, scope_district_id, assigned_by, created_at, updated_at
-- Links users to roles with optional geographic scoping
```

**official_profiles**
```sql
id, user_id, first_name, last_name, phone, designation, state_id, district_id, is_active, created_at, updated_at
-- Extended user profile for officials
```

**audit_logs**
```sql
id, user_id, action, entity_type, entity_id, changes (JSONB), ip_address, created_at
-- Complete audit trail of system changes
```

#### Extended Columns

Existing tables now include:
- `state_id`: Reference to state
- `district_id`: Reference to district

Applied to:
- teams
- tournaments
- players

## Implementation Guide

### 1. Environment Setup

Ensure Supabase is connected with:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
NEXT_PUBLIC_APP_DOMAIN=your-domain.com
```

### 2. Apply Database Migrations

Run the migration to create RBAC tables and indexes:

```bash
# Via Supabase CLI
supabase db push

# Or copy SQL from supabase/migrations/002_rbac_and_multistate.sql
# and run in Supabase SQL editor
```

### 3. Local Development Setup

For local development, subdomains won't work naturally. Use query parameters or path prefixes:

```
http://localhost:3000              → Public portal
http://localhost:3000/admin        → Admin portal (in dev)
http://localhost:3000/officials    → Officials portal (in dev)
```

Or configure your hosts file:
```
127.0.0.1  localhost.sepaktakraw.local
127.0.0.1  admin.localhost.sepaktakraw.local
127.0.0.1  officials.localhost.sepaktakraw.local
```

Then update your dev server configuration.

### 4. Create Initial Roles & Permissions

Roles and permissions are auto-inserted via migration, but you can manage them via:

```typescript
import { RBACManager } from '@/lib/rbac';

// Get all states
const states = await RBACManager.getStates();

// Get districts for state
const districts = await RBACManager.getDistricts(stateId);

// Assign role to user
await RBACManager.assignRole(userId, roleId, adminId);
```

## API Usage

### Authentication

All API calls require Bearer token:

```typescript
const response = await fetch('/api/v1/users', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

### Example: Create Tournament (Tournament Manager)

```typescript
// In client component
const createTournament = async (data: TournamentFormData) => {
  const response = await fetch('/api/tournaments', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create tournament');
  }

  return response.json();
};
```

### Example: API Route with Authorization

```typescript
// app/api/v1/users/route.ts
import { withRole, successResponse, errorResponse } from '@/lib/api-auth';

async function POST(request: NextRequest) {
  return withRole(['super_admin', 'admin'], request, async (req) => {
    // req.user and req.rbac are now available
    // Only super_admin and admin users reach this code
    
    return successResponse({ message: 'Success' });
  });
}
```

## Component Usage

### Using RBAC Context in Components

```typescript
'use client'

import { useAuth } from '@/lib/auth-context';
import { RBACManager } from '@/lib/rbac';

export function AdminOnlyFeature() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) return;

    const checkAdmin = async () => {
      const context = await RBACManager.getUserRBACContext(user.id);
      setIsAdmin(context?.is_admin || false);
    };

    checkAdmin();
  }, [user]);

  if (!isAdmin) {
    return <div>You don't have access</div>;
  }

  return <div>Admin Content</div>;
}
```

### Portal Configuration

```typescript
import { getPortalConfig, canAccessPortal } from '@/lib/portal-config';

const portalConfig = getPortalConfig('admin');
const canAccess = canAccessPortal(userRoles, 'admin');
```

## Security Considerations

### Row Level Security (RLS)

All sensitive tables have RLS policies enabled:
- States & Districts: Public read-only
- Roles & Permissions: Authenticated users only
- User Roles: Users can see own, admins see all
- Official Profiles: Users see own, admins see all
- Audit Logs: Admins only

### API Authorization

Every API endpoint should use authorization middleware:
- `withAuth()`: Check authentication only
- `withRole()`: Check authentication + specific roles
- `withPermission()`: Check authentication + specific permission

### Data Scoping

District-scoped data is automatically filtered:

```typescript
// Only return tournaments for user's district
if (rbac.scope_district_id) {
  query = query.eq('district_id', rbac.scope_district_id);
}
```

## Testing

### Test Subdomain Routing

```bash
# Test public portal
curl http://localhost:3000

# Test admin portal (requires setup)
curl http://admin.localhost:3000

# Test officials portal
curl http://officials.localhost:3000
```

### Test Role-Based Access

```typescript
// Test permission check
const hasAccess = await RBACManager.hasPermission(userId, 'tournaments:create');
expect(hasAccess).toBe(true);

// Test role check
const hasRole = await RBACManager.hasRole(userId, ['admin']);
expect(hasRole).toBe(true);
```

## Troubleshooting

### Subdomain Not Working

1. Check middleware.ts is in project root
2. Verify `matcher` pattern includes your routes
3. Test with `x-portal-type` header in curl:
   ```bash
   curl -H "x-portal-type: admin" http://localhost:3000/admin
   ```

### Cannot Access Admin Portal

1. Check user has admin or super_admin role
2. Verify role is in user_roles table
3. Check JWT token is valid
4. Review audit logs for role assignments

### Permission Denied on API

1. Verify user has required permission
2. Check role has permission in role_permissions
3. Test with simpler endpoint
4. Check database RLS policies

## Future Enhancements

1. **Multi-State Support**: Fully leverage state_id/district_id columns
2. **Fine-Grained RBAC**: Add module-level and resource-level permissions
3. **Real-Time Notifications**: Update officials on match changes
4. **Bulk Operations**: Import teams/players from CSV
5. **Advanced Reporting**: Custom reports by role and scope
6. **SSO Integration**: SAML/OAuth for federation members
7. **Mobile App**: React Native app using same RBAC

## Support

For issues or questions:
1. Check audit logs: `/admin/audit-logs`
2. Review RLS policies in Supabase
3. Test API with authorization headers
4. Check component RBAC context
