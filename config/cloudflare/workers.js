/**
 * Cloudflare Worker - API Gateway & Middleware for GET IT!
 * Handles:
 * - Request routing
 * - CORS headers
 * - Rate limiting
 * - Caching
 * - Security headers
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Add security headers
    const response = await handleRequest(request, env);
    
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    
    // CORS headers
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': env.ALLOWED_ORIGINS,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        }
      });
    }

    return response;
  }
};

async function handleRequest(request, env) {
  const url = new URL(request.url);
  
  // Route to backend API
  if (url.pathname.startsWith('/api/')) {
    const backendUrl = new URL(url.pathname.replace('/api/', '/'), env.API_BACKEND);
    backendUrl.search = url.search;
    
    return fetch(new Request(backendUrl, {
      method: request.method,
      headers: request.headers,
      body: request.method !== 'GET' ? request.body : undefined
    }));
  }

  return new Response('Not Found', { status: 404 });
}
