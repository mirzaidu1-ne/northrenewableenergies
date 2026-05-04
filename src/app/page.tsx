import Header from "@/components/Header"
import Footer from "@/components/Footer"
import HeroSlideshow from "@/components/HeroSlideshow"
import AnimatedCounters from "@/components/AnimatedCounters"
import ServicesSection from "@/components/ServicesSection"
import ProjectsSection from "@/components/ProjectsSection"
import TestimonialsSection from "@/components/TestimonialsSection"
import SolarCalculator from "@/components/SolarCalculator"
import CTASection from "@/components/CTASection"
import { createClient } from "@/lib/supabase/server"

type SiteSettings = {
  hero_slides: Array<{
    image: string
    title: string
    subtitle: string
    ctaText?: string
    ctaLink?: string
  }>
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
  calculator_settings: {
    currency: string
    defaultBill: number
    defaultRoofSize: number
    costPerKw: number
    savingsRate: number
    co2Factor: number
  }
  stats: Record<string, string> | Array<{ value: string; label: string }>
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

export default async function Home() {
  const settings = await fetchSettings()

  const siteInfo = settings.site_info || {}
  const heroSlides = settings.hero_slides || []
  const statsRaw = settings.stats || {}
  const statsArray = Array.isArray(statsRaw)
    ? statsRaw
    : Object.entries(statsRaw as Record<string, string>).map(([label, value]) => ({
        value,
        label: label.charAt(0).toUpperCase() + label.slice(1),
      }))
  const calculatorSettings = settings.calculator_settings
  const footerLinks = settings.footer_links
  const contactInfo = settings.contact_info || {}
  const socialLinks = settings.social_links || {}

  return (
    <>
      <Header
        logoText={siteInfo.logoText || "North"}
        logoAccent={siteInfo.logoAccent || "Renewable"}
      />
      <main>
        <HeroSlideshow
          slides={heroSlides}
          companyName={siteInfo.siteName || "North Renewable Energies"}
        />
        <AnimatedCounters
          stats={statsArray.map((s) => ({ value: s.value, label: s.label }))}
        />
        <ServicesSection />
        <ProjectsSection />
        <SolarCalculator settings={calculatorSettings} />
        <TestimonialsSection />
        <CTASection />
      </main>
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
