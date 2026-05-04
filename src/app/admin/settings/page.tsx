"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Save, Plus, Trash2, ChevronDown, ChevronUp, ExternalLink } from "lucide-react"
import Image from "next/image"

type SettingsKey =
  | "hero_slides"
  | "site_info"
  | "contact_info"
  | "social_links"
  | "calculator_settings"
  | "stats"
  | "footer_links"
  | "about_content"

type Section = {
  key: SettingsKey
  label: string
  icon: string
}

const sections: Section[] = [
  { key: "hero_slides", label: "Hero Slideshow", icon: "🖼️" },
  { key: "site_info", label: "Site Info", icon: "🏢" },
  { key: "contact_info", label: "Contact Info", icon: "📞" },
  { key: "social_links", label: "Social Links", icon: "🔗" },
  { key: "calculator_settings", label: "Calculator", icon: "🧮" },
  { key: "stats", label: "Stats Counters", icon: "📊" },
  { key: "footer_links", label: "Footer Links", icon: "🔻" },
  { key: "about_content", label: "About Page", icon: "📝" },
]

const defaultValues: Record<SettingsKey, unknown> = {
  hero_slides: [
    { image: "", title: "", subtitle: "", ctaText: "Get Free Quote", ctaLink: "/quote" },
  ],
  site_info: { siteName: "", tagline: "", logoText: "North", logoAccent: "Renewable", favicon: "🌞" },
  contact_info: { address: "", phone: "", email: "", businessHours: "", mapEmbed: "" },
  social_links: { facebook: "", twitter: "", linkedin: "", instagram: "" },
  calculator_settings: { currency: "$", defaultBill: 200, defaultRoofSize: 500, costPerKw: 2500, savingsRate: 0.7, co2Factor: 1.5 },
  stats: { installations: "", capacity: "", satisfaction: "", experience: "" },
  footer_links: { services: [], company: [] },
  about_content: { heroTitle: "", heroDescription: "", storyTitle: "", storyParagraphs: [], values: [] },
}

type FooterLinkItem = { label: string; href: string }

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, unknown>>({})
  const [activeSection, setActiveSection] = useState<SettingsKey | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [heroExpanded, setHeroExpanded] = useState<Record<number, boolean>>({})
  const [footerExpanded, setFooterExpanded] = useState<Record<string, boolean>>({ services: true })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    const supabase = createClient() as any
    const { data } = await supabase.from("site_settings").select("key, value")
    if (data) {
      const map: Record<string, unknown> = {}
      data.forEach((row: { key: string; value: unknown }) => {
        map[row.key] = row.value
      })
      for (const key of Object.keys(defaultValues)) {
        if (!map[key]) {
          map[key] = defaultValues[key as SettingsKey]
        }
      }
      setSettings(map)
    } else {
      setSettings({ ...defaultValues })
    }
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient() as any

    for (const [key, value] of Object.entries(settings)) {
      const { data: existing } = await supabase.from("site_settings").select("id").eq("key", key).single()
      if (existing) {
        await supabase.from("site_settings").update({ value }).eq("key", key)
      } else {
        await supabase.from("site_settings").insert({ key, value })
      }
    }

    try {
      await fetch("/api/revalidate-settings")
    } catch {
    }

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const updateSetting = (key: SettingsKey, value: unknown) => {
    setSettings({ ...settings, [key]: value })
  }

  const updateField = (key: SettingsKey, field: string, value: string | number) => {
    const current = (settings[key] as Record<string, unknown>) || {}
    setSettings({ ...settings, [key]: { ...current, [field]: value } })
  }

  const addHeroSlide = () => {
    const slides = (settings.hero_slides as Array<Record<string, unknown>>) || []
    updateSetting("hero_slides", [...slides, { image: "", title: "", subtitle: "", ctaText: "Get Free Quote", ctaLink: "/quote" }])
    setHeroExpanded({ ...heroExpanded, [slides.length]: true })
  }

  const removeHeroSlide = (index: number) => {
    const slides = (settings.hero_slides as Array<Record<string, unknown>>) || []
    updateSetting("hero_slides", slides.filter((_, i) => i !== index))
  }

  const updateHeroSlide = (index: number, field: string, value: string) => {
    const slides = (settings.hero_slides as Array<Record<string, unknown>>) || []
    slides[index] = { ...slides[index], [field]: value }
    updateSetting("hero_slides", [...slides])
  }

  const toggleHeroSlide = (index: number) => {
    setHeroExpanded({ ...heroExpanded, [index]: !heroExpanded[index] })
  }

  const addFooterLink = (group: "services" | "company") => {
    const links = (settings.footer_links as { services: FooterLinkItem[]; company: FooterLinkItem[] }) || { services: [], company: [] }
    const updated = { ...links, [group]: [...(links[group] || []), { label: "", href: "/" }] }
    updateSetting("footer_links", updated)
  }

  const removeFooterLink = (group: "services" | "company", index: number) => {
    const links = (settings.footer_links as { services: FooterLinkItem[]; company: FooterLinkItem[] }) || { services: [], company: [] }
    const updated = { ...links, [group]: (links[group] || []).filter((_, i) => i !== index) }
    updateSetting("footer_links", updated)
  }

  const updateFooterLink = (group: "services" | "company", index: number, field: "label" | "href", value: string) => {
    const links = (settings.footer_links as { services: FooterLinkItem[]; company: FooterLinkItem[] }) || { services: [], company: [] }
    const groupLinks = [...(links[group] || [])]
    groupLinks[index] = { ...groupLinks[index], [field]: value }
    const updated = { ...links, [group]: groupLinks }
    updateSetting("footer_links", updated)
  }

  const toggleFooterGroup = (group: string) => {
    setFooterExpanded({ ...footerExpanded, [group]: !footerExpanded[group] })
  }

  const addValue = () => {
    const about = (settings.about_content as Record<string, unknown>) || {}
    const values = (about.values as Array<{ icon: string; title: string; description: string }>) || []
    const updated = { ...about, values: [...values, { icon: "Shield", title: "", description: "" }] }
    updateSetting("about_content", updated)
  }

  const removeValue = (index: number) => {
    const about = (settings.about_content as Record<string, unknown>) || {}
    const values = (about.values as Array<unknown>) || []
    const updated = { ...about, values: values.filter((_, i) => i !== index) }
    updateSetting("about_content", updated)
  }

  const updateValue = (index: number, field: string, value: string) => {
    const about = (settings.about_content as Record<string, unknown>) || {}
    const values = [...((about.values as Array<Record<string, unknown>>) || [])]
    values[index] = { ...values[index], [field]: value }
    const updated = { ...about, values }
    updateSetting("about_content", updated)
  }

  const addStoryParagraph = () => {
    const about = (settings.about_content as Record<string, unknown>) || {}
    const paragraphs = (about.storyParagraphs as string[]) || []
    const updated = { ...about, storyParagraphs: [...paragraphs, ""] }
    updateSetting("about_content", updated)
  }

  const updateStoryParagraph = (index: number, value: string) => {
    const about = (settings.about_content as Record<string, unknown>) || {}
    const paragraphs = [...((about.storyParagraphs as string[]) || [])]
    paragraphs[index] = value
    const updated = { ...about, storyParagraphs: paragraphs }
    updateSetting("about_content", updated)
  }

  const removeStoryParagraph = (index: number) => {
    const about = (settings.about_content as Record<string, unknown>) || {}
    const paragraphs = ((about.storyParagraphs as string[]) || []).filter((_, i) => i !== index)
    const updated = { ...about, storyParagraphs: paragraphs }
    updateSetting("about_content", updated)
  }

  const renderSection = useCallback(() => {
    if (!activeSection) return null

    switch (activeSection) {
      case "hero_slides": {
        const slides = (settings.hero_slides as Array<Record<string, unknown>>) || []
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Hero Slides</h3>
              <button onClick={addHeroSlide} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-full text-sm hover:bg-emerald-700">
                <Plus className="w-4 h-4" /> Add Slide
              </button>
            </div>
            {slides.length === 0 && <p className="text-gray-400 text-sm">No slides added yet.</p>}
            {slides.map((slide, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <button onClick={() => toggleHeroSlide(index)} className="flex items-center gap-2 font-medium text-gray-700">
                    {heroExpanded[index] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    Slide {index + 1}: {(slide.title as string) || "Untitled"}
                  </button>
                  <button onClick={() => removeHeroSlide(index)} className="p-2 hover:bg-red-50 rounded-lg text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {heroExpanded[index] && (
                  <div className="space-y-3 ml-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                      <input type="url" value={(slide.image as string) || ""} onChange={(e) => updateHeroSlide(index, "image", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm" />
                      {(slide.image as string) && (
                        <div className="mt-2 relative rounded-lg overflow-hidden h-24">
                          <Image src={slide.image as string} alt="" fill className="object-cover" />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input type="text" value={(slide.title as string) || ""} onChange={(e) => updateHeroSlide(index, "title", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                      <textarea rows={2} value={(slide.subtitle as string) || ""} onChange={(e) => updateHeroSlide(index, "subtitle", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm resize-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                        <input type="text" value={(slide.ctaText as string) || ""} onChange={(e) => updateHeroSlide(index, "ctaText", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                        <input type="text" value={(slide.ctaLink as string) || ""} onChange={(e) => updateHeroSlide(index, "ctaLink", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      }

      case "site_info": {
        const info = (settings.site_info as Record<string, string>) || {}
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Site Information</h3>
            {[
              { field: "siteName", label: "Site Name" },
              { field: "tagline", label: "Tagline" },
              { field: "logoText", label: "Logo Main Text" },
              { field: "logoAccent", label: "Logo Accent Text" },
            ].map(({ field, label }) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input type="text" value={info[field] || ""} onChange={(e) => updateField("site_info", field, e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" />
              </div>
            ))}
          </div>
        )
      }

      case "contact_info": {
        const info = (settings.contact_info as Record<string, string>) || {}
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
            {[
              { field: "address", label: "Address", type: "text" },
              { field: "phone", label: "Phone", type: "tel" },
              { field: "email", label: "Email", type: "email" },
            ].map(({ field, label, type }) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input type={type} value={info[field] || ""} onChange={(e) => updateField("contact_info", field, e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Hours</label>
              <textarea rows={3} value={info.businessHours || ""} onChange={(e) => updateField("contact_info", "businessHours", e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none" placeholder={"Mon - Fri: 8AM - 6PM\nSat: 9AM - 2PM\nSun: Closed"} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Embed URL</label>
              <input type="url" value={info.mapEmbed || ""} onChange={(e) => updateField("contact_info", "mapEmbed", e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" />
            </div>
          </div>
        )
      }

      case "social_links": {
        const links = (settings.social_links as Record<string, string>) || {}
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Social Media Links</h3>
            {["facebook", "twitter", "linkedin", "instagram"].map((platform) => (
              <div key={platform}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{platform}</label>
                <input type="url" value={links[platform] || ""} onChange={(e) => updateField("social_links", platform, e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" placeholder={`https://${platform}.com/...`} />
              </div>
            ))}
          </div>
        )
      }

      case "calculator_settings": {
        const calc = (settings.calculator_settings as Record<string, string | number>) || {}
        const currency = (calc.currency as string) || "$"
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Calculator Settings</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency Symbol</label>
              <input type="text" value={calc.currency as string || "$"} onChange={(e) => updateField("calculator_settings", "currency", e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost per kW ({currency})</label>
              <input type="number" value={calc.costPerKw as number || 2500} onChange={(e) => updateField("calculator_settings", "costPerKw", Number(e.target.value))} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Savings Rate (0-1)</label>
              <input type="number" step="0.01" min="0" max="1" value={calc.savingsRate as number || 0.7} onChange={(e) => updateField("calculator_settings", "savingsRate", Number(e.target.value))} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CO2 Offset Factor</label>
              <input type="number" step="0.1" value={calc.co2Factor as number || 1.5} onChange={(e) => updateField("calculator_settings", "co2Factor", Number(e.target.value))} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" />
            </div>
          </div>
        )
      }

      case "stats": {
        const stats = (settings.stats as Record<string, string>) || {}
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Stats Counters (Homepage)</h3>
            {[
              { field: "installations", label: "Installations Count" },
              { field: "capacity", label: "Total Capacity" },
              { field: "satisfaction", label: "Customer Satisfaction" },
              { field: "experience", label: "Years Experience" },
            ].map(({ field, label }) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input type="text" value={stats[field] || ""} onChange={(e) => updateField("stats", field, e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" />
              </div>
            ))}
          </div>
        )
      }

      case "footer_links": {
        const links = (settings.footer_links as { services: FooterLinkItem[]; company: FooterLinkItem[] }) || { services: [], company: [] }
        return (
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => toggleFooterGroup("services")} className="flex items-center gap-2 font-semibold text-gray-900">
                  {footerExpanded.services ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  Services Links
                </button>
                <button onClick={() => addFooterLink("services")} className="flex items-center gap-2 bg-emerald-600 text-white px-3 py-1.5 rounded-full text-sm hover:bg-emerald-700">
                  <Plus className="w-3.5 h-3.5" /> Add Link
                </button>
              </div>
              {footerExpanded.services && (
                <div className="space-y-3 ml-2">
                  {(links.services || []).length === 0 && <p className="text-gray-400 text-sm">No service links added.</p>}
                  {(links.services || []).map((link, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-500">Link {index + 1}</span>
                        <button onClick={() => removeFooterLink("services", index)} className="p-1 hover:bg-red-50 rounded text-red-500">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Label</label>
                          <input type="text" value={link.label || ""} onChange={(e) => updateFooterLink("services", index, "label", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">URL</label>
                          <input type="text" value={link.href || ""} onChange={(e) => updateFooterLink("services", index, "href", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => toggleFooterGroup("company")} className="flex items-center gap-2 font-semibold text-gray-900">
                  {footerExpanded.company ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  Company Links
                </button>
                <button onClick={() => addFooterLink("company")} className="flex items-center gap-2 bg-emerald-600 text-white px-3 py-1.5 rounded-full text-sm hover:bg-emerald-700">
                  <Plus className="w-3.5 h-3.5" /> Add Link
                </button>
              </div>
              {footerExpanded.company && (
                <div className="space-y-3 ml-2">
                  {(links.company || []).length === 0 && <p className="text-gray-400 text-sm">No company links added.</p>}
                  {(links.company || []).map((link, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-500">Link {index + 1}</span>
                        <button onClick={() => removeFooterLink("company", index)} className="p-1 hover:bg-red-50 rounded text-red-500">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Label</label>
                          <input type="text" value={link.label || ""} onChange={(e) => updateFooterLink("company", index, "label", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">URL</label>
                          <input type="text" value={link.href || ""} onChange={(e) => updateFooterLink("company", index, "href", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      }

      case "about_content": {
        const about = (settings.about_content as Record<string, unknown>) || {}
        const values = (about.values as Array<{ icon: string; title: string; description: string }>) || []
        const paragraphs = (about.storyParagraphs as string[]) || []
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">About Hero Section</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
                <input type="text" value={(about.heroTitle as string) || ""} onChange={(e) => updateField("about_content", "heroTitle", e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hero Description</label>
                <textarea rows={3} value={(about.heroDescription as string) || ""} onChange={(e) => updateField("about_content", "heroDescription", e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Our Story</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Story Title</label>
                <input type="text" value={(about.storyTitle as string) || ""} onChange={(e) => updateField("about_content", "storyTitle", e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Paragraphs</label>
                  <button onClick={addStoryParagraph} className="flex items-center gap-1 text-emerald-600 text-sm hover:underline">
                    <Plus className="w-3.5 h-3.5" /> Add Paragraph
                  </button>
                </div>
                <div className="space-y-3">
                  {paragraphs.length === 0 && <p className="text-gray-400 text-sm">No paragraphs added. Default content will show.</p>}
                  {paragraphs.map((p, index) => (
                    <div key={index} className="flex gap-2">
                      <textarea rows={2} value={p} onChange={(e) => updateStoryParagraph(index, e.target.value)} className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm resize-none" />
                      <button onClick={() => removeStoryParagraph(index)} className="p-2 hover:bg-red-50 rounded-lg text-red-500 self-start mt-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Core Values</h3>
                <button onClick={addValue} className="flex items-center gap-2 bg-emerald-600 text-white px-3 py-1.5 rounded-full text-sm hover:bg-emerald-700">
                  <Plus className="w-3.5 h-3.5" /> Add Value
                </button>
              </div>
              <div className="space-y-3">
                {values.length === 0 && <p className="text-gray-400 text-sm">No values added. Default values will show.</p>}
                {values.map((val, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-500">Value {index + 1}</span>
                      <button onClick={() => removeValue(index)} className="p-1 hover:bg-red-50 rounded text-red-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Icon Name</label>
                        <input type="text" value={val.icon || ""} onChange={(e) => updateValue(index, "icon", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm" placeholder="Shield, Award, Users, Leaf" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                        <input type="text" value={val.title || ""} onChange={(e) => updateValue(index, "title", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm" />
                      </div>
                    </div>
                    <div className="mt-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                      <textarea rows={2} value={val.description || ""} onChange={(e) => updateValue(index, "description", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm resize-none" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      }

      default:
        return <p className="text-gray-500">Select a section to edit</p>
    }
  }, [activeSection, settings, heroExpanded, footerExpanded])

  if (loading) return <div className="text-center py-12 text-gray-500">Loading settings...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Website Settings</h2>
          <p className="text-gray-500 text-sm mt-1">Changes will reflect on the site after saving</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full transition-all disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? "Saving..." : saved ? "Saved!" : "Save All"}
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Sections</h3>
            <div className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left text-sm ${
                    activeSection === section.key
                      ? "bg-emerald-50 text-emerald-700 font-semibold"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <span>{section.icon}</span>
                  {section.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  )
}
