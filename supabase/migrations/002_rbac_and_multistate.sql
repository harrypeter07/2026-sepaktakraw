-- Phase 3: RBAC and Multi-State Support

-- Create states table
CREATE TABLE IF NOT EXISTS states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(2) UNIQUE NOT NULL, -- MH for Maharashtra
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create districts table
CREATE TABLE IF NOT EXISTS districts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_id UUID NOT NULL REFERENCES states(id) ON DELETE CASCADE,
  code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL, -- super_admin, admin, tournament_manager, district_official, team_manager, viewer
  description TEXT,
  level INT NOT NULL, -- 0=super_admin, 1=admin, 2=district_official, 3=tournament_manager, 4=team_manager, 5=viewer
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'users:create', 'tournaments:edit', 'matches:score'
  description TEXT,
  module VARCHAR(50) NOT NULL, -- 'users', 'tournaments', 'matches', 'teams', 'players', 'reports'
  action VARCHAR(20) NOT NULL, -- 'create', 'read', 'update', 'delete', 'approve'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create role_permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(role_id, permission_id)
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  scope_state_id UUID REFERENCES states(id) ON DELETE SET NULL, -- For district officials
  scope_district_id UUID REFERENCES districts(id) ON DELETE SET NULL, -- For district officials
  assigned_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create official_profiles table
CREATE TABLE IF NOT EXISTS official_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  designation VARCHAR(100),
  state_id UUID REFERENCES states(id),
  district_id UUID REFERENCES districts(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Extend existing tables with location scoping
ALTER TABLE teams ADD COLUMN IF NOT EXISTS state_id UUID REFERENCES states(id);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS district_id UUID REFERENCES districts(id);

ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS state_id UUID REFERENCES states(id);
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS district_id UUID REFERENCES districts(id);

ALTER TABLE players ADD COLUMN IF NOT EXISTS state_id UUID REFERENCES states(id);
ALTER TABLE players ADD COLUMN IF NOT EXISTS district_id UUID REFERENCES districts(id);

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID,
  changes JSONB,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_state ON user_roles(scope_state_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_district ON user_roles(scope_district_id);
CREATE INDEX IF NOT EXISTS idx_official_profiles_user ON official_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_official_profiles_state ON official_profiles(state_id);
CREATE INDEX IF NOT EXISTS idx_official_profiles_district ON official_profiles(district_id);
CREATE INDEX IF NOT EXISTS idx_teams_state ON teams(state_id);
CREATE INDEX IF NOT EXISTS idx_teams_district ON teams(district_id);
CREATE INDEX IF NOT EXISTS idx_tournaments_state ON tournaments(state_id);
CREATE INDEX IF NOT EXISTS idx_tournaments_district ON tournaments(district_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

-- Enable RLS
ALTER TABLE states ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE official_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for states (public read)
CREATE POLICY "States are viewable by authenticated users" ON states
  FOR SELECT USING (auth.role() = 'authenticated_user' OR auth.role() = 'anon');

-- RLS Policies for districts (public read)
CREATE POLICY "Districts are viewable by authenticated users" ON districts
  FOR SELECT USING (auth.role() = 'authenticated_user' OR auth.role() = 'anon');

-- RLS Policies for roles (authenticated only)
CREATE POLICY "Roles viewable by authenticated users" ON roles
  FOR SELECT USING (auth.role() = 'authenticated_user');

-- RLS Policies for permissions (authenticated only)
CREATE POLICY "Permissions viewable by authenticated users" ON permissions
  FOR SELECT USING (auth.role() = 'authenticated_user');

-- RLS Policies for user_roles (own or admin)
CREATE POLICY "Users can view their own roles" ON user_roles
  FOR SELECT USING (
    user_id = auth.uid() OR 
    (SELECT EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name IN ('super_admin', 'admin')
    ))
  );

-- RLS Policies for official_profiles
CREATE POLICY "Officials can view their own profile" ON official_profiles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all profiles" ON official_profiles
  FOR SELECT USING (
    SELECT EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name IN ('super_admin', 'admin')
    )
  );

-- RLS Policies for audit_logs (admins only)
CREATE POLICY "Only admins can view audit logs" ON audit_logs
  FOR SELECT USING (
    SELECT EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name IN ('super_admin', 'admin')
    )
  );

-- Function to assign audit logging
CREATE OR REPLACE FUNCTION log_audit_action()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (user_id, action, entity_type, entity_id, changes)
  VALUES (
    auth.uid(),
    TG_ARGV[0],
    TG_TABLE_NAME,
    NEW.id,
    jsonb_build_object('old', row_to_json(OLD), 'new', row_to_json(NEW))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for audit logging on critical tables
CREATE TRIGGER audit_user_roles AFTER INSERT OR UPDATE OR DELETE ON user_roles
  FOR EACH ROW EXECUTE FUNCTION log_audit_action('user_role_change');

CREATE TRIGGER audit_tournaments AFTER INSERT OR UPDATE OR DELETE ON tournaments
  FOR EACH ROW EXECUTE FUNCTION log_audit_action('tournament_change');

-- Insert default Maharashtra state
INSERT INTO states (code, name) VALUES ('MH', 'Maharashtra')
ON CONFLICT (code) DO NOTHING;

-- Insert default roles
INSERT INTO roles (name, description, level) VALUES
  ('super_admin', 'Full system access', 0),
  ('admin', 'Administrative access', 1),
  ('district_official', 'District-level official', 2),
  ('tournament_manager', 'Can create and manage tournaments', 3),
  ('team_manager', 'Can manage own team', 4),
  ('viewer', 'Read-only access', 5)
ON CONFLICT (name) DO NOTHING;

-- Insert default permissions
INSERT INTO permissions (name, description, module, action) VALUES
  ('users:create', 'Create new users', 'users', 'create'),
  ('users:read', 'View users', 'users', 'read'),
  ('users:update', 'Update users', 'users', 'update'),
  ('users:delete', 'Delete users', 'users', 'delete'),
  ('tournaments:create', 'Create tournaments', 'tournaments', 'create'),
  ('tournaments:read', 'View tournaments', 'tournaments', 'read'),
  ('tournaments:update', 'Update tournaments', 'tournaments', 'update'),
  ('tournaments:delete', 'Delete tournaments', 'tournaments', 'delete'),
  ('tournaments:approve', 'Approve tournaments', 'tournaments', 'approve'),
  ('matches:create', 'Create matches', 'matches', 'create'),
  ('matches:score', 'Update match scores', 'matches', 'update'),
  ('matches:approve', 'Approve match results', 'matches', 'approve'),
  ('teams:create', 'Create teams', 'teams', 'create'),
  ('teams:update', 'Update teams', 'teams', 'update'),
  ('players:create', 'Create players', 'players', 'create'),
  ('players:update', 'Update players', 'players', 'update'),
  ('reports:view', 'View reports', 'reports', 'read'),
  ('reports:export', 'Export reports', 'reports', 'read'),
  ('roles:assign', 'Assign roles to users', 'roles', 'create'),
  ('roles:revoke', 'Revoke user roles', 'roles', 'delete')
ON CONFLICT (name) DO NOTHING;
