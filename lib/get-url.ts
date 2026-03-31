/**
 * Returns the correct base URL for the application based on the environment.
 * - In production/preview on Vercel, it uses the Vercel URL.
 * - In local development, it defaults to localhost:3000.
 */
export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_APP_URL ??
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000'

  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`
  // Make sure to remove trailing `/`.
  url = url.charAt(url.length - 1) === '/' ? url.slice(0, -1) : url
  
  return url
}
