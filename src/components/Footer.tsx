import Link from "next/link"
import { Sun, Mail, Phone, MapPin } from "lucide-react"

type FooterLink = { href: string; label: string }
type SocialLink = { href: string; icon: string }

type FooterLinks = {
  services: FooterLink[]
  company: FooterLink[]
}

type ContactInfo = {
  address?: string
  phone?: string
  email?: string
}

interface FooterProps {
  siteName?: string
  logoText?: string
  logoAccent?: string
  tagline?: string
  footerLinks?: FooterLinks
  contactInfo?: ContactInfo
  socialLinks?: Record<string, string>
}

const defaultFooterLinks: FooterLinks = {
  services: [
    { href: "/services", label: "Residential Solar" },
    { href: "/services", label: "Commercial Solar" },
    { href: "/services", label: "Battery Storage" },
    { href: "/services", label: "EV Chargers" },
    { href: "/services", label: "Maintenance" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
    { href: "/quote", label: "Get a Quote" },
  ],
}

const defaultContactInfo: ContactInfo = {
  address: "123 Solar Street, Energy City, EC 10001",
  phone: "+1 (555) 123-4567",
  email: "info@northrenewable.com",
}

const socialIcons: Record<string, string> = {
  facebook: "https://www.facebook.com/",
  twitter: "https://twitter.com/",
  linkedin: "https://www.linkedin.com/",
  instagram: "https://www.instagram.com/",
}

function SocialIcon({ platform }: { platform: string }) {
  const icons: Record<string, React.ReactNode> = {
    facebook: (
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    ),
    twitter: (
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    ),
    linkedin: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
    instagram: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </>
    ),
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[platform] || <GlobeIcon />}
    </svg>
  )
}

function GlobeIcon() {
  return (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </>
  )
}

export default function Footer({
  siteName = "North Renewable Energies",
  logoText = "North",
  logoAccent = "Renewable",
  tagline = "Leading the transition to clean energy with professional solar installations for homes and businesses.",
  footerLinks = defaultFooterLinks,
  contactInfo = defaultContactInfo,
  socialLinks = {},
}: FooterProps) {
  const socialEntries = Object.entries(socialLinks).filter(([, href]) => href && href !== "#")

  return (
    <footer className="bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Sun className="w-8 h-8 text-accent" />
              <span className="text-xl font-bold">
                {logoText}<span className="text-accent">{logoAccent}</span>
              </span>
            </Link>
            <p className="text-white/60 mb-6">{tagline}</p>
            {socialEntries.length > 0 && (
              <div className="flex gap-4">
                {socialEntries.map(([platform, href]) => (
                  <a
                    key={platform}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-dark transition-all"
                  >
                    <SocialIcon platform={platform} />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/60 hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/60 hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              {contactInfo.address && (
                <li className="flex items-start gap-3 text-white/60">
                  <MapPin className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>{contactInfo.address}</span>
                </li>
              )}
              {contactInfo.phone && (
                <li className="flex items-center gap-3 text-white/60">
                  <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                  <span>{contactInfo.phone}</span>
                </li>
              )}
              {contactInfo.email && (
                <li className="flex items-center gap-3 text-white/60">
                  <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                  <span>{contactInfo.email}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-white/40">
            <Link href="#" className="hover:text-accent transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-accent transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
