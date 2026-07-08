// Feature flags for Phase 2 migration
// Allows gradual rollout and fallback to localStorage if needed

export const FEATURE_FLAGS = {
  // Use Supabase as primary data source for dynamic entities (tournaments, teams, players, responses)
  USE_SUPABASE: process.env.NEXT_PUBLIC_USE_SUPABASE === 'true',

  // Enable real-time features
  ENABLE_REALTIME: process.env.NEXT_PUBLIC_ENABLE_REALTIME === 'true',

  // Show admin dashboard
  ENABLE_ADMIN_DASHBOARD: process.env.NEXT_PUBLIC_ENABLE_ADMIN_DASHBOARD === 'true',

  // Enable authentication
  ENABLE_AUTH: process.env.NEXT_PUBLIC_ENABLE_AUTH === 'true',
};

export function isFeatureEnabled(flag: keyof typeof FEATURE_FLAGS): boolean {
  const val = FEATURE_FLAGS[flag];
  return !!val;
}

// Migration state
export interface MigrationState {
  phase: 'development' | 'testing' | 'production';
  useLocalStorage: boolean;
  useSupabase: boolean;
  syncEnabled: boolean;
}

export function getMigrationState(): MigrationState {
  const env = typeof process !== 'undefined' ? process.env.NODE_ENV : 'development';
  const useSupabase = FEATURE_FLAGS.USE_SUPABASE;

  return {
    phase: (env as any) || 'development',
    useLocalStorage: !useSupabase,
    useSupabase,
    syncEnabled: useSupabase,
  };
}
