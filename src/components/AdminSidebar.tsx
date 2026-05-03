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
} from "lucide-react"

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/projects", icon: Image, label: "Projects" },
  { href: "/admin/testimonials", icon: MessageSquare, label: "Testimonials" },
  { href: "/admin/blog", icon: FileText, label: "Blog Posts" },
  { href: "/admin/leads", icon: Mail, label: "Leads & Quotes" },
  { href: "/admin/team", icon: Users, label: "Team Members" },
  { href: "/admin/content", icon: BookOpen, label: "Page Content" },
]

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <Link href="/admin" className="p-6 border-b border-white/10">
        <span className="text-xl font-bold">
          North<span className="text-accent">Admin</span>
        </span>
      </Link>

      <nav className="flex-1 py-6 px-3">
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
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        isActive
          ? "bg-accent text-dark font-semibold"
          : "text-white/60 hover:text-white hover:bg-white/10"
      }`}
    >
      <Icon className="w-5 h-5" />
      {children}
    </Link>
  )
}
