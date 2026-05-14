import { createClient } from '@supabase/supabase-js';
import type { RBACContext, RoleType, PermissionModule, PermissionAction } from './rbac-types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export class RBACManager {
  private static supabase = createClient(supabaseUrl, supabaseKey);

  /**
   * Get RBAC context for current user
   */
  static async getUserRBACContext(userId: string): Promise<RBACContext | null> {
    try {
      // Fetch user roles with role details
      const { data: userRoles, error: rolesError } = await this.supabase
        .from('user_roles')
        .select(`
          role_id,
          scope_state_id,
          scope_district_id,
          roles(name, level)
        `)
        .eq('user_id', userId);

      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        return null;
      }

      if (!userRoles || userRoles.length === 0) {
        return {
          user_id: userId,
          roles: ['viewer'],
          permissions: ['tournaments:read', 'teams:read', 'players:read'],
          is_admin: false,
          is_super_admin: false,
          portal: 'public',
        };
      }

      // Determine portal based on roles
      const roles = userRoles.map((ur: any) => ur.roles.name);
      const isAdmin = roles.includes('admin') || roles.includes('super_admin');
      const isSuperAdmin = roles.includes('super_admin');
      const isOfficer = roles.includes('district_official');

      let portal: 'public' | 'admin' | 'officials' = 'public';
      if (isSuperAdmin || isAdmin) portal = 'admin';
      else if (isOfficer) portal = 'officials';

      // Fetch all permissions for this user's roles
      const roleIds = userRoles.map((ur: any) => ur.role_id);
      const { data: permissions, error: permError } = await this.supabase
        .from('role_permissions')
        .select('permissions(name)')
        .in('role_id', roleIds);

      if (permError) {
        console.error('Error fetching permissions:', permError);
      }

      const permissionList = permissions?.map((p: any) => p.permissions.name) || [];

      // Get scope from first role with scope
      const scopedRole = userRoles.find(
        (ur: any) => ur.scope_state_id || ur.scope_district_id
      );

      return {
        user_id: userId,
        roles,
        permissions: permissionList,
        scope_state_id: scopedRole?.scope_state_id,
        scope_district_id: scopedRole?.scope_district_id,
        is_admin: isAdmin,
        is_super_admin: isSuperAdmin,
        portal,
      };
    } catch (error) {
      console.error('Error in getUserRBACContext:', error);
      return null;
    }
  }

  /**
   * Check if user has specific permission
   */
  static async hasPermission(
    userId: string,
    permission: `${PermissionModule}:${PermissionAction}`
  ): Promise<boolean> {
    const context = await this.getUserRBACContext(userId);
    return context?.permissions.includes(permission) || false;
  }

  /**
   * Check if user has any of the specified roles
   */
  static async hasRole(userId: string, roles: RoleType[]): Promise<boolean> {
    const context = await this.getUserRBACContext(userId);
    return context?.roles.some(role => roles.includes(role as RoleType)) || false;
  }

  /**
   * Assign role to user
   */
  static async assignRole(
    userId: string,
    roleId: string,
    assignedBy: string,
    scopeStateId?: string,
    scopeDistrictId?: string
  ) {
    try {
      const { data, error } = await this.supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role_id: roleId,
          assigned_by: assignedBy,
          scope_state_id: scopeStateId,
          scope_district_id: scopeDistrictId,
        })
        .select();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error assigning role:', error);
      return { success: false, error };
    }
  }

  /**
   * Revoke role from user
   */
  static async revokeRole(userRoleId: string) {
    try {
      const { error } = await this.supabase
        .from('user_roles')
        .delete()
        .eq('id', userRoleId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error revoking role:', error);
      return { success: false, error };
    }
  }

  /**
   * Get all users with specific role
   */
  static async getUsersByRole(roleId: string) {
    try {
      const { data, error } = await this.supabase
        .from('user_roles')
        .select('user_id, user:auth.users(email)')
        .eq('role_id', roleId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching users by role:', error);
      return [];
    }
  }

  /**
   * Create or update official profile
   */
  static async upsertOfficialProfile(
    userId: string,
    profile: {
      first_name: string;
      last_name: string;
      phone?: string;
      designation?: string;
      state_id?: string;
      district_id?: string;
      is_active?: boolean;
    }
  ) {
    try {
      const { data, error } = await this.supabase
        .from('official_profiles')
        .upsert(
          {
            user_id: userId,
            ...profile,
          },
          { onConflict: 'user_id' }
        )
        .select();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error upserting official profile:', error);
      return { success: false, error };
    }
  }

  /**
   * Get states list
   */
  static async getStates() {
    try {
      const { data, error } = await this.supabase
        .from('states')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching states:', error);
      return [];
    }
  }

  /**
   * Get districts for a state
   */
  static async getDistricts(stateId: string) {
    try {
      const { data, error } = await this.supabase
        .from('districts')
        .select('*')
        .eq('state_id', stateId)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching districts:', error);
      return [];
    }
  }

  /**
   * Log audit action
   */
  static async logAudit(
    userId: string,
    action: string,
    entityType: string,
    entityId: string,
    changes?: Record<string, any>
  ) {
    try {
      await this.supabase.from('audit_logs').insert({
        user_id: userId,
        action,
        entity_type: entityType,
        entity_id: entityId,
        changes: changes ? JSON.stringify(changes) : null,
      });
    } catch (error) {
      console.error('Error logging audit:', error);
    }
  }
}
