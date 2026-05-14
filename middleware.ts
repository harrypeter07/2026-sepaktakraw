import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

interface PortalInfo {
  type: 'public' | 'admin' | 'officials';
  subdomain?: string;
}

function getPortalFromHost(host: string): PortalInfo {
  // Remove port if present
  const hostname = host.split(':')[0];

  // Handle localhost development
  if (hostname === 'localhost' || hostname.startsWith('127.0.0.1')) {
    // Use query param or path to determine portal in dev
    return { type: 'public' };
  }

  // Parse subdomain
  const parts = hostname.split('.');

  // Check for admin and officials subdomains
  if (parts.length >= 3) {
    const subdomain = parts[0];

    if (subdomain === 'admin') {
      return { type: 'admin', subdomain: 'admin' };
    }

    // Match officials.* subdomains for district-specific portals
    // e.g., officials.maharashtra.com or officials-mumbai.maharashtra.com
    if (subdomain.startsWith('officials')) {
      const districtCode = subdomain.split('-')[1]; // e.g., 'mumbai' from 'officials-mumbai'
      return { type: 'officials', subdomain: districtCode ? `officials-${districtCode}` : 'officials' };
    }
  }

  // Default to public portal
  return { type: 'public' };
}

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  // Get portal info from subdomain
  const portal = getPortalFromHost(host);

  // Clone request headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-portal-type', portal.type);
  if (portal.subdomain) {
    requestHeaders.set('x-portal-subdomain', portal.subdomain);
  }

  // Handle routing based on portal type
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Set portal info as response headers for client-side access
  response.headers.set('x-portal-type', portal.type);
  if (portal.subdomain) {
    response.headers.set('x-portal-subdomain', portal.subdomain);
  }

  // Redirect based on portal and path
  if (portal.type === 'admin' && !pathname.startsWith('/admin')) {
    // Admin portal: redirect non-admin routes to /admin
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  if (portal.type === 'officials' && !pathname.startsWith('/officials')) {
    // Officials portal: redirect non-officials routes to /officials
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/officials', request.url));
    }
  }

  // Protect admin routes when not on admin subdomain
  if (!portal.type.includes('admin') && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Protect officials routes when not on officials subdomain
  if (!portal.type.includes('officials') && pathname.startsWith('/officials')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}
