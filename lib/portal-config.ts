import type { PortalConfig, RoleType } from './rbac-types';

export const PORTAL_CONFIGS: Record<string, PortalConfig> = {
  public: {
    name: 'Public Portal',
    subdomain: undefined,
    requiresAuth: false,
    allowedRoles: ['viewer', 'team_manager', 'tournament_manager', 'district_official', 'admin', 'super_admin'],
    minRoleLevel: undefined,
  },
  admin: {
    name: 'Admin Portal',
    subdomain: 'admin',
    requiresAuth: true,
    allowedRoles: ['admin', 'super_admin'],
    minRoleLevel: 1,
  },
  officials: {
    name: 'Officials Portal',
    subdomain: 'officials',
    requiresAuth: true,
    allowedRoles: ['district_official', 'admin', 'super_admin'],
    minRoleLevel: 2,
  },
};

export type PortalType = keyof typeof PORTAL_CONFIGS;

/**
 * Get portal type from request headers (set by middleware)
 */
export function getPortalTypeFromHeaders(headers: Record<string, string>): PortalType {
  const portalType = headers['x-portal-type'];
  if (portalType === 'admin' || portalType === 'officials') {
    return portalType as PortalType;
  }
  return 'public';
}

/**
 * Get portal subdomain from request headers
 */
export function getPortalSubdomainFromHeaders(headers: Record<string, string>): string | undefined {
  return headers['x-portal-subdomain'];
}

/**
 * Check if user can access portal
 */
export function canAccessPortal(userRoles: RoleType[], portalType: PortalType): boolean {
  const config = PORTAL_CONFIGS[portalType];
  return userRoles.some(role => config.allowedRoles.includes(role));
}

/**
 * Get portal display configuration
 */
export function getPortalConfig(portalType: PortalType): PortalConfig {
  return PORTAL_CONFIGS[portalType];
}

/**
 * Get base URL for portal
 */
export function getPortalBaseUrl(
  portalType: PortalType = 'public',
  subdomain?: string,
  includeProtocol = true
): string {
  const protocol = includeProtocol ? `${typeof window !== 'undefined' ? window.location.protocol : 'https:'}//` : '';

  if (portalType === 'public') {
    if (typeof window !== 'undefined') {
      const host = window.location.host.replace(/^(admin|officials)(-[^.]*)?\./, '');
      return `${protocol}${host}`;
    }
    return `${protocol}${process.env.NEXT_PUBLIC_APP_DOMAIN || 'localhost:3000'}`;
  }

  if (portalType === 'admin') {
    if (typeof window !== 'undefined') {
      const currentHost = window.location.host;
      const domain = currentHost
        .replace(/^(admin|officials)(-[^.]*)?\./, '')
        .split(':')
        .slice(0, -1)
        .join(':');
      const port = currentHost.includes(':') ? `:${currentHost.split(':')[1]}` : '';
      return `${protocol}admin.${domain}${port}`;
    }
    return `${protocol}admin.${process.env.NEXT_PUBLIC_APP_DOMAIN || 'localhost:3000'}`;
  }

  if (portalType === 'officials') {
    const subdomainPart = subdomain ? `-${subdomain}` : '';
    if (typeof window !== 'undefined') {
      const currentHost = window.location.host;
      const domain = currentHost
        .replace(/^(admin|officials)(-[^.]*)?\./, '')
        .split(':')
        .slice(0, -1)
        .join(':');
      const port = currentHost.includes(':') ? `:${currentHost.split(':')[1]}` : '';
      return `${protocol}officials${subdomainPart}.${domain}${port}`;
    }
    return `${protocol}officials${subdomainPart}.${process.env.NEXT_PUBLIC_APP_DOMAIN || 'localhost:3000'}`;
  }

  return `${protocol}${process.env.NEXT_PUBLIC_APP_DOMAIN || 'localhost:3000'}`;
}

/**
 * Navigation items per portal
 */
export const PORTAL_NAVIGATION = {
  public: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Tournaments', href: '/tournaments' },
    { label: 'Teams', href: '/teams' },
    { label: 'Players', href: '/players' },
    { label: 'News', href: '/news' },
  ],
  admin: [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Users', href: '/admin/users' },
    { label: 'Tournaments', href: '/admin/tournaments' },
    { label: 'Teams', href: '/admin/teams' },
    { label: 'Players', href: '/admin/players' },
    { label: 'Matches', href: '/admin/matches' },
    { label: 'Reports', href: '/admin/reports' },
    { label: 'Audit Logs', href: '/admin/audit-logs' },
    { label: 'Settings', href: '/admin/settings' },
  ],
  officials: [
    { label: 'Dashboard', href: '/officials' },
    { label: 'My District', href: '/officials/district' },
    { label: 'Tournaments', href: '/officials/tournaments' },
    { label: 'Match Scoring', href: '/officials/matches' },
    { label: 'Teams', href: '/officials/teams' },
    { label: 'Players', href: '/officials/players' },
    { label: 'Reports', href: '/officials/reports' },
  ],
};
