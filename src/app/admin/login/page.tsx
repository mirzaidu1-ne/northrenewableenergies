import { auth, signIn, signOut } from "@/auth"
import { redirect } from "next/navigation"
import { Sun } from "lucide-react"

export default async function LoginPage() {
  const session = await auth()

  if (session?.user) {
    redirect("/admin")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark to-solar-blue px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sun className="w-10 h-10 text-accent" />
            <span className="text-2xl font-bold text-white">
              North<span className="text-accent">Renewable</span>
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Admin Login</h1>
          <p className="text-white/60">Sign in to manage your website</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
          <form
            action={async (formData) => {
              "use server"
              await signIn("credentials", {
                email: formData.get("email"),
                password: formData.get("password"),
                redirectTo: "/admin",
              })
            }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                placeholder="admin@northrenewable.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
              <input
                type="password"
                name="password"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-accent hover:bg-accent-dark text-dark font-semibold py-4 rounded-full transition-all hover:scale-[1.02]"
            >
              Sign In
            </button>
          </form>
        </div>

        <div className="mt-8">
          <form
            action={async () => {
              "use server"
              await signIn("credentials", {
                email: "demo@northrenewable.com",
                password: "demo123",
                redirectTo: "/admin",
              })
            }}
          >
            <button
              type="submit"
              className="w-full border border-white/20 hover:border-accent text-white/80 hover:text-accent font-medium py-3 rounded-full transition-all text-sm"
            >
              Use Demo Account
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
