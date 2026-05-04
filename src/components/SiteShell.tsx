import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { createClient } from "@/lib/supabase/server"

type SiteSettings = {
  site_info: {
    siteName?: string
    tagline?: string
    logoText?: string
    logoAccent?: string
  }
  contact_info: {
    address?: string
    phone?: string
    email?: string
  }
  social_links: Record<string, string>
  footer_links: {
    services: Array<{ href: string; label: string }>
    company: Array<{ href: string; label: string }>
  }
}

async function fetchSettings(): Promise<Partial<SiteSettings>> {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from("site_settings").select("key, value")
    if (!data) return {}

    const settings: Partial<SiteSettings> = {}
    for (const row of data as { key: string; value: unknown }[]) {
      settings[row.key as keyof SiteSettings] = row.value as never
    }
    return settings
  } catch {
    return {}
  }
}

type SiteShellProps = {
  children: React.ReactNode
}

export default async function SiteShell({ children }: SiteShellProps) {
  const settings = await fetchSettings()

  const siteInfo = settings.site_info || {}
  const contactInfo = settings.contact_info || {}
  const socialLinks = settings.social_links || {}
  const footerLinks = settings.footer_links

  return (
    <>
      <Header
        logoText={siteInfo.logoText || "North"}
        logoAccent={siteInfo.logoAccent || "Renewable"}
      />
      {children}
      <Footer
        siteName={siteInfo.siteName || "North Renewable Energies"}
        logoText={siteInfo.logoText || "North"}
        logoAccent={siteInfo.logoAccent || "Renewable"}
        tagline={siteInfo.tagline || "Leading the transition to clean energy with professional solar installations for homes and businesses."}
        footerLinks={footerLinks}
        contactInfo={contactInfo}
        socialLinks={socialLinks}
      />
    </>
  )
}
