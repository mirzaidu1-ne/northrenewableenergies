"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Image,
  MessageSquare,
  FileText,
  Users,
  Mail,
  BookOpen,
  Sun,
  Settings,
} from "lucide-react"

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/services", icon: Sun, label: "Services" },
  { href: "/admin/projects", icon: Image, label: "Projects" },
  { href: "/admin/testimonials", icon: MessageSquare, label: "Testimonials" },
  { href: "/admin/blog", icon: FileText, label: "Blog Posts" },
  { href: "/admin/leads", icon: Mail, label: "Leads & Quotes" },
  { href: "/admin/team", icon: Users, label: "Team Members" },
  { href: "/admin/settings", icon: Settings, label: "Website Settings" },
]

export default function AdminSidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white z-50 flex flex-col">
      <Link href="/admin" className="p-6 border-b border-white/10">
        <span className="text-xl font-bold">
          North<span className="text-amber-400">Admin</span>
        </span>
      </Link>

      <nav className="flex-1 py-6 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <NavLink href={item.href} icon={item.icon}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/10">
        <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          View Website
        </Link>
      </div>
    </aside>
  )
}

function NavLink({
  href,
  icon: Icon,
  children,
}: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm ${
        isActive
          ? "bg-amber-400 text-gray-900 font-semibold"
          : "text-white/60 hover:text-white hover:bg-white/10"
      }`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      {children}
    </Link>
  )
}
