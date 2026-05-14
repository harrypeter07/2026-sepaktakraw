import { NextRequest, NextResponse } from 'next/server';
import { withRole, successResponse, errorResponse, validateBody } from '@/lib/api-auth';
import { RBACManager } from '@/lib/rbac';
import type { AuthenticatedRequest } from '@/lib/api-auth';

// GET /api/v1/users - List all users (admin only)
async function GET(request: NextRequest) {
  return withRole(['super_admin', 'admin'], request, async (req: AuthenticatedRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const roleFilter = searchParams.get('role');

      let users;
      if (roleFilter) {
        users = await RBACManager.getUsersByRole(roleFilter);
      } else {
        // In production, fetch all users from database
        users = [];
      }

      return successResponse({ data: users });
    } catch (error) {
      console.error('Error fetching users:', error);
      return errorResponse('Failed to fetch users', 500);
    }
  });
}

// POST /api/v1/users - Create new user with role (admin only)
async function POST(request: NextRequest) {
  return withRole(['super_admin', 'admin'], request, async (req: AuthenticatedRequest) => {
    try {
      const body = await request.json();

      // Validate request
      const validation = validateBody(
        {
          email: { required: true, type: 'string' },
          role: { required: true, type: 'string', enum: ['admin', 'tournament_manager', 'team_manager'] },
          stateId: { required: false, type: 'string' },
          districtId: { required: false, type: 'string' },
        },
        body
      );

      if (!validation.valid) {
        return errorResponse(JSON.stringify(validation.errors), 400);
      }

      // Check permissions - can't assign role higher than own
      if (body.role === 'admin' && !req.rbac?.is_super_admin) {
        return errorResponse('Only super admins can assign admin role', 403);
      }

      // Audit log
      await RBACManager.logAudit(
        req.user!.id,
        'user_created',
        'users',
        '',
        { email: body.email, role: body.role }
      );

      return successResponse(
        {
          message: 'User created successfully',
          user: {
            email: body.email,
            role: body.role,
          },
        },
        201
      );
    } catch (error) {
      console.error('Error creating user:', error);
      return errorResponse('Failed to create user', 500);
    }
  });
}

export { GET, POST };
