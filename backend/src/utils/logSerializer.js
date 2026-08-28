/**
 * Log Serializers Utility
 * 
 * Provides clean, minimal serialization for Pino and Pino-HTTP logging.
 * Filters request, response, and error objects to display only essential fields
 * in terminal output, omitting bloated internal Node/Express properties and stack traces.
 */

// Essential headers allowed in request logs
const ALLOWED_HEADERS = ['host', 'user-agent', 'content-type', 'authorization', 'accept'];

/**
 * Serializes HTTP request objects, keeping only essential metadata and sanitized body/query/params.
 */
export const reqSerializer = (req) => {
    if (!req) return req;

    const rawReq = req.raw || req;
    const headers = rawReq.headers || req.headers;

    // Filter headers to avoid header bloat and mask sensitive authorization data
    const filteredHeaders = {};
    if (headers) {
        for (const key of ALLOWED_HEADERS) {
            if (headers[key] !== undefined) {
                if (key === 'authorization' && typeof headers[key] === 'string') {
                    filteredHeaders[key] = headers[key].startsWith('Bearer ') ? 'Bearer [REDACTED]' : '[REDACTED]';
                } else {
                    filteredHeaders[key] = headers[key];
                }
            }
        }
    }

    const query = rawReq.query || req.query;
    const params = rawReq.params || req.params;
    const body = rawReq.body || req.body;

    return {
        id: req.id || rawReq.id || req.requestId,
        method: rawReq.method || req.method,
        url: rawReq.originalUrl || rawReq.url || req.url,
        ...(query && Object.keys(query).length > 0 ? { query } : {}),
        ...(params && Object.keys(params).length > 0 ? { params } : {}),
        ...(Object.keys(filteredHeaders).length > 0 ? { headers: filteredHeaders } : {}),
        ...(body && Object.keys(body).length > 0 ? { body: sanitizeBody(body) } : {}),
    };
};

/**
 * Serializes HTTP response objects, retaining only status code.
 */
export const resSerializer = (res) => {
    if (!res) return res;

    const rawRes = res.raw || res;

    return {
        statusCode: rawRes.statusCode || res.statusCode,
    };
};

/**
 * Serializes Error objects, keeping error type and message while omitting stack traces.
 */
export const errSerializer = (err) => {
    if (!err) return err;

    return {
        type: err.type || err.name || "Error",
        message: err.message,
        ...(err.code ? { code: err.code } : {}),
        ...(err.statusCode ? { statusCode: err.statusCode } : {}),
        // Stack trace omitted to keep logs concise
    };
};

/**
 * Sanitizes object payload to mask sensitive fields like passwords or tokens.
 */
function sanitizeBody(body) {
    if (typeof body !== 'object' || body === null) return body;
    if (Array.isArray(body)) return body;

    const sanitized = { ...body };
    const sensitiveKeys = ['password', 'token', 'secret', 'authorization'];

    for (const key of Object.keys(sanitized)) {
        if (sensitiveKeys.includes(key.toLowerCase())) {
            sanitized[key] = '[REDACTED]';
        }
    }
    return sanitized;
}
