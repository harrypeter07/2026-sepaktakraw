// RBAC Type Definitions for Phase 3

export type RoleType = 'super_admin' | 'admin' | 'district_official' | 'tournament_manager' | 'team_manager' | 'viewer';

export type PermissionModule = 'users' | 'tournaments' | 'matches' | 'teams' | 'players' | 'reports' | 'roles';
export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'approve';

export interface State {
  id: string;
  code: string;
  name: string;
  created_at: string;
}

export interface District {
  id: string;
  state_id: string;
  code: string;
  name: string;
  created_at: string;
}

export interface Role {
  id: string;
  name: RoleType;
  description?: string;
  level: number;
  created_at: string;
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
  module: PermissionModule;
  action: PermissionAction;
  created_at: string;
}

export interface RolePermission {
  id: string;
  role_id: string;
  permission_id: string;
  created_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  scope_state_id?: string;
  scope_district_id?: string;
  assigned_by?: string;
  created_at: string;
  updated_at: string;
}

export interface OfficialProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  designation?: string;
  state_id?: string;
  district_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  changes?: Record<string, any>;
  ip_address?: string;
  created_at: string;
}

export interface RBACContext {
  user_id?: string;
  roles: RoleType[];
  permissions: string[];
  scope_state_id?: string;
  scope_district_id?: string;
  is_admin: boolean;
  is_super_admin: boolean;
  portal: 'public' | 'admin' | 'officials';
}

export interface PortalConfig {
  name: string;
  subdomain?: string;
  requiresAuth: boolean;
  minRoleLevel?: number;
  allowedRoles: RoleType[];
}
