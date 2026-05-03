import { auth, signIn } from "@/auth"
import { redirect } from "next/navigation"
import { Sun } from "lucide-react"

export default async function LoginPage() {
  const session = await auth()

  if (session?.user) {
    redirect("/admin")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sun className="w-10 h-10 text-amber-400" />
            <span className="text-2xl font-bold text-white">
              North<span className="text-amber-400">Renewable</span>
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Admin Login</h1>
          <p className="text-gray-400">Sign in to manage your website</p>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
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
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all"
                placeholder="admin@northrenewable.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                name="password"
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold py-4 rounded-full transition-all hover:scale-[1.02]"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
