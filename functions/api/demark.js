import { demark, DEFAULT_OPTIONS } from '../../src/modules/demark.js';

/**
 * Standard CORS headers for Cloudflare Pages Functions
 */
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

/**
 * Helper to build JSON responses using native Web Standard Response API
 */
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...CORS_HEADERS,
    },
  });
}

/**
 * OPTIONS handler for CORS preflight
 */
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

/**
 * GET handler: Returns API documentation and default options schema
 */
export async function onRequestGet() {
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
  });
}

/**
 * POST handler: Strips markdown from the provided text according to options
 */
export async function onRequestPost(context) {
  const { request } = context;

  // Verify content type
  const contentType = request.headers.get('content-type') || '';
  let payload;

  try {
    if (contentType.includes('application/json')) {
      payload = await request.json();
    } else {
      const text = await request.text();
      payload = { markdown: text };
    }
  } catch (err) {
    return jsonResponse(
      {
        success: false,
        error: 'Invalid request body. Expected JSON with "markdown" field or raw text.',
        details: err.message,
      },
      400
    );
  }

  const markdown = typeof payload.markdown === 'string' ? payload.markdown : '';
  const options = typeof payload.options === 'object' && payload.options !== null ? payload.options : {};

  try {
    const { result, stats } = demark(markdown, options);

    return jsonResponse({
      success: true,
      result,
      stats,
    });
  } catch (err) {
    return jsonResponse(
      {
        success: false,
        error: 'Failed to process markdown AST.',
        details: err.message,
      },
      500
    );
  }
}
