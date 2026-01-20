/**
 * CyberQRG Web Suite - Cloudflare Worker
 * Handles cross-app routing and API endpoints
 *
 * Routes:
 * - cyberqrgai.com/* -> Web app
 * - sentinel.cyberqrgai.com/* -> Sentinel app
 * - privacy.cyberqrgai.com/* -> Privacy app
 * - api.cyberqrgai.com/* -> API endpoints
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const hostname = url.hostname;

    // Handle API routes
    if (hostname === 'api.cyberqrgai.com') {
      return handleAPI(request, env);
    }

    // Handle cross-app redirects for old localhost links
    if (url.pathname.includes('localhost:9999') ||
        url.pathname.includes('localhost:9998') ||
        url.pathname.includes('localhost:9997')) {
      return handleLegacyRedirects(request);
    }

    // Add security headers to all responses
    const response = await fetch(request);

    const newResponse = new Response(response.body, response);
    addSecurityHeaders(newResponse);

    return newResponse;
  },
};

/**
 * Handle API endpoints
 */
async function handleAPI(request, env) {
  const url = new URL(request.url);

  // CORS headers for API
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Route API calls
  if (url.pathname.startsWith('/api/web')) {
    return handleWebAPI(request, env, corsHeaders);
  } else if (url.pathname.startsWith('/api/sentinel')) {
    return handleSentinelAPI(request, env, corsHeaders);
  } else if (url.pathname.startsWith('/api/privacy')) {
    return handlePrivacyAPI(request, env, corsHeaders);
  }

  // Default API response
  return new Response(JSON.stringify({
    error: 'API endpoint not found',
    available: ['/api/web', '/api/sentinel', '/api/privacy']
  }), {
    status: 404,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

/**
 * Handle web app API calls
 */
async function handleWebAPI(request, env, corsHeaders) {
  const url = new URL(request.url);

  if (url.pathname === '/api/web/status') {
    return new Response(JSON.stringify({
      app: 'web',
      status: 'operational',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ error: 'Web API endpoint not found' }), {
    status: 404,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

/**
 * Handle sentinel app API calls
 */
async function handleSentinelAPI(request, env, corsHeaders) {
  const url = new URL(request.url);

  if (url.pathname === '/api/sentinel/status') {
    return new Response(JSON.stringify({
      app: 'sentinel',
      status: 'operational',
      timestamp: new Date().toISOString(),
      threats: 'monitoring',
      version: '1.0.0'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ error: 'Sentinel API endpoint not found' }), {
    status: 404,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

/**
 * Handle privacy app API calls
 */
async function handlePrivacyAPI(request, env, corsHeaders) {
  const url = new URL(request.url);

  if (url.pathname === '/api/privacy/status') {
    return new Response(JSON.stringify({
      app: 'privacy',
      status: 'operational',
      timestamp: new Date().toISOString(),
      privacy: 'protected',
      version: '1.0.0'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ error: 'Privacy API endpoint not found' }), {
    status: 404,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

/**
 * Handle legacy localhost redirects
 */
function handleLegacyRedirects(request) {
  const url = new URL(request.url);
  let newUrl = url.href;

  // Replace localhost URLs with production domains
  newUrl = newUrl.replace(/http:\/\/localhost:9999/g, 'https://cyberqrgai.com');
  newUrl = newUrl.replace(/http:\/\/localhost:9998/g, 'https://sentinel.cyberqrgai.com');
  newUrl = newUrl.replace(/http:\/\/localhost:9997/g, 'https://privacy.cyberqrgai.com');

  return new Response(null, {
    status: 301,
    headers: { 'Location': newUrl }
  });
}

/**
 * Add security headers to responses
 */
function addSecurityHeaders(response) {
  const headers = response.headers;

  // Security headers
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  // HTTPS enforcement
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  // Content Security Policy
  headers.set('Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' data:; " +
    "connect-src 'self' https://api.cyberqrgai.com; " +
    "frame-ancestors 'none';"
  );
}</content>
<parameter name="filePath">/Users/michaelhoch/Library/Mobile Documents/com~apple~CloudDocs/CyberQRG-Rebuild/cloudflare-worker.js