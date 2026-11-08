/*
 * Runtime configuration for the static frontend.
 *
 * The API is a separate deployable (Render); the page is a static site (Vercel).
 * Change `apiBase` here when the backend moves. The value is read at runtime, so
 * a redeploy is not required for a query-string override:
 *
 *   https://cu-route-assistant.vercel.app/?api=https://staging.example.org
 *
 * Keep this file same-origin. The site's Content-Security-Policy allows
 * `script-src 'self'` and lists the API origin in `connect-src`.
 */
window.CU_ROUTE_CONFIG = {
  apiBase: "https://cu-route-assistant-api.onrender.com",
};
