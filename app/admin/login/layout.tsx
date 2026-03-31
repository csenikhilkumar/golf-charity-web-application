export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  // This layout intentionally bypasses the parent AdminLayout's auth guard
  // so unauthenticated users can reach the admin login page
  return <>{children}</>
}
