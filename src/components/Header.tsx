"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Sun } from "lucide-react"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-dark/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2">
            <Sun className="w-8 h-8 text-accent" />
            <span className="text-xl font-bold text-white">
              North<span className="text-accent">Renewable</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/80 hover:text-accent transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/quote"
              className="bg-accent hover:bg-accent-dark text-dark font-semibold px-6 py-2.5 rounded-full transition-all hover:scale-105"
            >
              Get a Quote
            </Link>
          </nav>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-dark/95 backdrop-blur-md border-t border-white/10">
          <nav className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-white/80 hover:text-accent transition-colors py-2"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/quote"
              onClick={() => setIsOpen(false)}
              className="block bg-accent hover:bg-accent-dark text-dark font-semibold px-6 py-3 rounded-full text-center transition-all"
            >
              Get a Quote
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
