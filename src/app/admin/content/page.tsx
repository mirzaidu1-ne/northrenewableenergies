"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Save } from "lucide-react"

type PageContent = {
  id: string
  page: string
  section: string
  content: Record<string, unknown>
}

const pages = [
  { value: "home", label: "Home Page" },
  { value: "about", label: "About Page" },
  { value: "services", label: "Services Page" },
]

export default function AdminContent() {
  const [contents, setContents] = useState<PageContent[]>([])
  const [selectedPage, setSelectedPage] = useState("home")
  const [editingContent, setEditingContent] = useState<Record<string, unknown>>({})
  const [currentSection, setCurrentSection] = useState("")
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContents()
  }, [selectedPage])

  const fetchContents = async () => {
    const supabase = await createClient()
    const { data } = await supabase
      .from("page_content")
      .select("*")
      .eq("page", selectedPage)
      .order("section", { ascending: true })

    if (data) {
      setContents(data)
      if (data.length > 0) {
        setCurrentSection(data[0].section)
        setEditingContent(data[0].content)
      }
    }
    setLoading(false)
  }

  const handleSave = async () => {
    if (!currentSection) return
    setSaving(true)

    const supabase = await createClient()
    const existing = contents.find((c) => c.section === currentSection)

    if (existing) {
      await supabase
        .from("page_content")
        .update({ content: editingContent })
        .eq("id", existing.id)
    } else {
      await supabase.from("page_content").insert({
        page: selectedPage,
        section: currentSection,
        content: editingContent,
      })
    }

    setSaving(false)
    fetchContents()
  }

  const updateContent = (key: string, value: string) => {
    setEditingContent({ ...editingContent, [key]: value })
  }

  const selectSection = (section: string) => {
    const content = contents.find((c) => c.section === section)
    setCurrentSection(section)
    setEditingContent(content?.content || {})
  }

  const sections = {
    hero: {
      title: "Hero Section",
      fields: [
        { key: "title", label: "Headline", type: "text" },
        { key: "subtitle", label: "Subtitle", type: "textarea" },
        { key: "cta_text", label: "Button Text", type: "text" },
        { key: "cta_link", label: "Button Link", type: "text" },
      ],
    },
    about: {
      title: "About Section",
      fields: [
        { key: "heading", label: "Section Heading", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
      ],
    },
    services: {
      title: "Services Section",
      fields: [
        { key: "heading", label: "Section Heading", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
      ],
    },
  }

  if (loading) return <div className="text-center py-12 text-muted">Loading...</div>

  const currentFields = sections[currentSection as keyof typeof sections]?.fields || []

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-dark">Page Content</h2>
        <select
          value={selectedPage}
          onChange={(e) => setSelectedPage(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
        >
          {pages.map((page) => (
            <option key={page.value} value={page.value}>
              {page.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-semibold text-dark mb-4">Sections</h3>
            <div className="space-y-2">
              {Object.entries(sections).map(([key, section]) => (
                <button
                  key={key}
                  onClick={() => selectSection(key)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                    currentSection === key
                      ? "bg-primary text-white"
                      : "hover:bg-gray-50 text-dark"
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {currentSection ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-dark mb-6">
                {sections[currentSection as keyof typeof sections]?.title}
              </h3>
              <div className="space-y-4">
                {currentFields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-dark mb-1">
                      {field.label}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        rows={3}
                        value={(editingContent[field.key] as string) || ""}
                        onChange={(e) => updateContent(field.key, e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                      />
                    ) : (
                      <input
                        type="text"
                        value={(editingContent[field.key] as string) || ""}
                        onChange={(e) => updateContent(field.key, e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                    )}
                  </div>
                ))}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-full transition-all disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
              <p className="text-muted">Select a section to edit</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
