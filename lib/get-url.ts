/**
 * Returns the correct base URL for the application based on the environment.
 * - In production/preview on Vercel, it uses the Vercel URL.
 * - In local development, it defaults to localhost:3000.
 */
export const getURL = () => {
  // On the client side, window.location.origin is the most reliable source of truth.
  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin;
  }

  let url =
    process?.env?.NEXT_PUBLIC_APP_URL ??
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000'

  // If we're on Vercel and the URL is still localhost (potentially misconfigured env var), 
  // prioritize the automatic Vercel URL.
  if (process?.env?.NEXT_PUBLIC_VERCEL_URL && url.includes('localhost')) {
    url = process.env.NEXT_PUBLIC_VERCEL_URL;
  }

  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`
  // Make sure to remove trailing `/`.
  url = url.charAt(url.length - 1) === '/' ? url.slice(0, -1) : url
  
  return url
}
