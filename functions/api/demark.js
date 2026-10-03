import { demark, DEFAULT_OPTIONS } from '../../src/modules/demark.js';

/**
 * Maximum allowed request body size (1 MB) to prevent DoS via oversized payloads
 */
const MAX_BODY_SIZE = 1 * 1024 * 1024;

/**
 * Allowed CORS origins — set to your deployed domain(s).
 * Falls back to the request's own origin for Pages preview deployments.
 */
const ALLOWED_ORIGINS = [
  'https://demark-3pj.pages.dev',
  'https://demark.pages.dev',
];

/**
 * Resolve the Access-Control-Allow-Origin value for a given request.
 * Only reflects the origin if it's in the allow-list or is a *.pages.dev preview.
 */
function resolveOrigin(request, env = null) {
  const origin = request.headers.get('Origin') || '';
  if (ALLOWED_ORIGINS.includes(origin)) return origin;
  // Allow Cloudflare Pages preview deployments (*.demark-3pj.pages.dev)
  if (/^https:\/\/[a-z0-9-]+\.demark-3pj\.pages\.dev$/.test(origin)) return origin;
  // Local development — only allowed when ENVIRONMENT is explicitly 'development' or 'local'
  const isDev = env?.ENVIRONMENT === 'development' || env?.ENVIRONMENT === 'local';
  if (isDev && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
    return origin;
  }
  return ALLOWED_ORIGINS[0]; // default; browser will block if mismatch
}

/**
 * Build CORS headers scoped to the requesting origin
 */
function corsHeaders(request, env = null) {
  return {
    'Access-Control-Allow-Origin': resolveOrigin(request, env),
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

/**
 * Standard security response headers
 */
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

/**
 * Helper to build JSON responses using native Web Standard Response API
 */
function jsonResponse(data, status = 200, request = null, env = null) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...SECURITY_HEADERS,
      ...(request ? corsHeaders(request, env) : {}),
    },
  });
}

/**
 * OPTIONS handler for CORS preflight
 */
export async function onRequestOptions(context) {
  return new Response(null, {
    status: 204,
    headers: {
      ...corsHeaders(context.request, context.env),
      ...SECURITY_HEADERS,
    },
  });
}

/**
 * GET handler: Returns API documentation and default options schema
 */
export async function onRequestGet(context) {
  return jsonResponse({
    service: 'DeMark API',
    description: 'Cloudflare Pages serverless endpoint to strip unwanted Markdown from AI-generated text using Unified/Remark AST parsing.',
    runtime: 'Cloudflare V8 / Pages Functions',
    usage: {
      method: 'POST',
      endpoint: '/api/demark',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        markdown: '# Your raw AI markdown text here...',
        options: DEFAULT_OPTIONS,
      },
    },
    defaultOptions: DEFAULT_OPTIONS,
  }, 200, context.request, context.env);
}

/**
 * POST handler: Strips markdown from the provided text according to options
 */
export async function onRequestPost(context) {
  const { request, env } = context;

  // Enforce request body size limit to prevent denial-of-service
  const contentLength = parseInt(request.headers.get('content-length') || '0', 10);
  if (contentLength > MAX_BODY_SIZE) {
    return jsonResponse(
      { success: false, error: `Request body too large. Maximum allowed size is ${MAX_BODY_SIZE / 1024}KB.` },
      413,
      request,
      env
    );
  }

  // Verify content type
  const contentType = request.headers.get('content-type') || '';
  let payload;

  try {
    let text = '';
    if (request.body) {
      const reader = request.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let totalLength = 0;
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          totalLength += value.length;
          if (totalLength > MAX_BODY_SIZE) {
            return jsonResponse(
              { success: false, error: `Request body too large. Maximum allowed size is ${MAX_BODY_SIZE / 1024}KB.` },
              413,
              request,
              env
            );
          }
          text += decoder.decode(value, { stream: true });
        }
      }
      text += decoder.decode();
    }

    if (contentType.includes('application/json')) {
      payload = text ? JSON.parse(text) : {};
    } else {
      payload = { markdown: text };
    }
  } catch (err) {
    return jsonResponse(
      {
        success: false,
        error: 'Invalid request body. Expected JSON with "markdown" field or raw text.',
      },
      400,
      request,
      env
    );
  }

  const markdown = typeof payload.markdown === 'string' ? payload.markdown : '';

  // Enforce markdown field size limit
  if (markdown.length > MAX_BODY_SIZE) {
    return jsonResponse(
      { success: false, error: `Markdown field too large. Maximum allowed size is ${MAX_BODY_SIZE / 1024}KB.` },
      413,
      request,
      env
    );
  }

  const options = typeof payload.options === 'object' && payload.options !== null ? payload.options : {};

  try {
    const { result, stats } = demark(markdown, options);

    return jsonResponse({
      success: true,
      result,
      stats,
    }, 200, request, env);
  } catch (err) {
    // Never expose internal error details to the client
    return jsonResponse(
      {
        success: false,
        error: 'Failed to process markdown AST.',
      },
      500,
      request,
      env
    );
  }
}
