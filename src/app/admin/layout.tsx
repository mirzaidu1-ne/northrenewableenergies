import { auth, signOut } from "@/auth"
import AdminSidebar from "@/components/AdminSidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 ml-64">
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-dark">Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium text-dark">{session.user.name || "Admin"}</p>
                <p className="text-sm text-muted">{session.user.email}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                {(session.user.name || "A")[0]}
              </div>
              <form
                action={async () => {
                  "use server"
                  await signOut({ redirectTo: "/admin/login" })
                }}
              >
                <button type="submit" className="text-sm text-muted hover:text-dark transition-colors">
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}
