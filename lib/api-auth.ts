import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { RBACManager } from './rbac';
import type { RBACContext, PermissionModule, PermissionAction } from './rbac-types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export interface AuthenticatedRequest extends NextRequest {
  user?: { id: string; email: string };
  rbac?: RBACContext;
}

/**
 * Get authenticated user from request
 */
export async function getAuthenticatedUser(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.slice(7);
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      return null;
    }

    return {
      id: data.user.id,
      email: data.user.email || '',
    };
  } catch (error) {
    console.error('Error authenticating user:', error);
    return null;
  }
}

/**
 * Middleware to check authentication
 */
export async function withAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const authRequest = request as AuthenticatedRequest;
  authRequest.user = user;

  // Get RBAC context
  authRequest.rbac = (await RBACManager.getUserRBACContext(user.id)) || undefined;

  return handler(authRequest);
}

/**
 * Middleware to check specific permission
 */
export async function withPermission(
  permission: `${PermissionModule}:${PermissionAction}`,
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const hasPermission = await RBACManager.hasPermission(user.id, permission);

  if (!hasPermission) {
    return NextResponse.json(
      { error: 'Forbidden - Insufficient permissions' },
      { status: 403 }
    );
  }

  const authRequest = request as AuthenticatedRequest;
  authRequest.user = user;
  authRequest.rbac = (await RBACManager.getUserRBACContext(user.id)) || undefined;

  return handler(authRequest);
}

/**
 * Middleware to check specific role
 */
export async function withRole(
  roles: string[],
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const context = await RBACManager.getUserRBACContext(user.id);

  if (!context || !context.roles.some(role => roles.includes(role))) {
    return NextResponse.json(
      { error: 'Forbidden - Insufficient role' },
      { status: 403 }
    );
  }

  const authRequest = request as AuthenticatedRequest;
  authRequest.user = user;
  authRequest.rbac = context;

  return handler(authRequest);
}

/**
 * Validate request body
 */
export function validateBody<T>(
  schema: Record<string, any>,
  body: any
): { valid: boolean; data?: T; errors?: Record<string, string> } {
  const errors: Record<string, string> = {};

  for (const [key, rules] of Object.entries(schema)) {
    const value = body[key];

    if (rules.required && (value === undefined || value === null || value === '')) {
      errors[key] = `${key} is required`;
    }

    if (rules.type && value !== undefined && value !== null) {
      const actualType = Array.isArray(value) ? 'array' : typeof value;
      if (actualType !== rules.type) {
        errors[key] = `${key} must be of type ${rules.type}`;
      }
    }

    if (rules.minLength && value && value.length < rules.minLength) {
      errors[key] = `${key} must be at least ${rules.minLength} characters`;
    }

    if (rules.maxLength && value && value.length > rules.maxLength) {
      errors[key] = `${key} must not exceed ${rules.maxLength} characters`;
    }

    if (rules.enum && value && !rules.enum.includes(value)) {
      errors[key] = `${key} must be one of: ${rules.enum.join(', ')}`;
    }
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, data: body as T };
}

/**
 * Create success response
 */
export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

/**
 * Create error response
 */
export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Check data ownership (for district-scoped operations)
 */
export function canAccessDistrict(
  rbac: RBACContext | undefined,
  districtId: string
): boolean {
  if (!rbac) return false;
  if (rbac.is_admin) return true;
  return rbac.scope_district_id === districtId;
}

/**
 * Check state ownership
 */
export function canAccessState(
  rbac: RBACContext | undefined,
  stateId: string
): boolean {
  if (!rbac) return false;
  if (rbac.is_admin) return true;
  return rbac.scope_state_id === stateId;
}
