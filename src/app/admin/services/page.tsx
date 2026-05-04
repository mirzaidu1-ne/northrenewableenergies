"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Plus, Edit, Trash2, X, Save, ChevronUp, ChevronDown } from "lucide-react"
import Image from "next/image"

type Service = {
  id: string
  title: string
  description: string
  icon: string
  image_url: string | null
  features: string[]
  order: number
  is_active: boolean
}

const iconOptions = [
  "Home", "Building2", "Battery", "Zap", "Wrench", "Sun",
  "Shield", "Award", "Leaf", "Cloud", "Gauge", "Lightbulb",
  "Plug", "Power", "TreePine", "Wind",
]

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([])
  const [editing, setEditing] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [featureInput, setFeatureInput] = useState("")
  const [iconDropdown, setIconDropdown] = useState(false)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    const supabase = createClient() as any
    const { data } = await supabase.from("services").select("*").order("order", { ascending: true })
    if (data) setServices(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing) return
    setSaving(true)

    const supabase = createClient() as any
    const payload = {
      title: editing.title,
      description: editing.description,
      icon: editing.icon,
      image_url: editing.image_url || null,
      features: editing.features,
      order: editing.order,
      is_active: editing.is_active,
    }

    if (editing.id) {
      await supabase.from("services").update(payload).eq("id", editing.id)
    } else {
      await supabase.from("services").insert([payload])
    }

    setSaving(false)
    setShowForm(false)
    setEditing(null)
    fetchServices()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return
    const supabase = createClient() as any
    await supabase.from("services").delete().eq("id", id)
    fetchServices()
  }

  const openEdit = (service: Service) => {
    setEditing({ ...service, features: Array.isArray(service.features) ? service.features : [] })
    setShowForm(true)
  }

  const openNew = () => {
    setEditing({
      id: "",
      title: "",
      description: "",
      icon: "Sun",
      image_url: "",
      features: [],
      order: services.length + 1,
      is_active: true,
    })
    setShowForm(true)
  }

  const updateField = (field: string, value: string | number | boolean) => {
    if (editing) setEditing({ ...editing, [field]: value })
  }

  const addFeature = () => {
    if (!editing || !featureInput.trim()) return
    setEditing({ ...editing, features: [...editing.features, featureInput.trim()] })
    setFeatureInput("")
  }

  const removeFeature = (index: number) => {
    if (!editing) return
    setEditing({ ...editing, features: editing.features.filter((_, i) => i !== index) })
  }

  const moveUp = async (service: Service) => {
    const supabase = createClient() as any
    const idx = services.findIndex((s) => s.id === service.id)
    if (idx <= 0) return
    const above = services[idx - 1]
    await supabase.from("services").update({ order: above.order }).eq("id", service.id)
    await supabase.from("services").update({ order: service.order }).eq("id", above.id)
    fetchServices()
  }

  const moveDown = async (service: Service) => {
    const supabase = createClient() as any
    const idx = services.findIndex((s) => s.id === service.id)
    if (idx >= services.length - 1) return
    const below = services[idx + 1]
    await supabase.from("services").update({ order: below.order }).eq("id", service.id)
    await supabase.from("services").update({ order: service.order }).eq("id", below.id)
    fetchServices()
  }

  if (loading) return <div className="text-center py-12 text-muted">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-dark">Services</h2>
        <button onClick={openNew} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full transition-all">
          <Plus className="w-5 h-5" />
          Add Service
        </button>
      </div>

      {showForm && editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-dark">{editing.id ? "Edit Service" : "New Service"}</h3>
              <button onClick={() => { setShowForm(false); setEditing(null) }}>
                <X className="w-6 h-6 text-muted" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Title *</label>
                <input type="text" required value={editing.title} onChange={(e) => updateField("title", e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Description *</label>
                <textarea required rows={3} value={editing.description} onChange={(e) => updateField("description", e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Icon</label>
                  <div className="relative">
                    <button type="button" onClick={() => setIconDropdown(!iconDropdown)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none text-left flex items-center justify-between">
                      {editing.icon}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {iconDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto grid grid-cols-3 gap-1 p-2">
                        {iconOptions.map((icon) => (
                          <button key={icon} type="button" onClick={() => { updateField("icon", icon); setIconDropdown(false) }} className={`px-3 py-2 rounded-lg text-sm hover:bg-gray-100 ${editing.icon === icon ? "bg-primary/10 text-primary" : ""}`}>
                            {icon}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Order</label>
                  <input type="number" value={editing.order} onChange={(e) => updateField("order", Number(e.target.value))} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Image URL</label>
                <input type="url" value={editing.image_url || ""} onChange={(e) => updateField("image_url", e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" placeholder="https://..." />
              </div>
              {editing.image_url && (
                <div className="relative rounded-xl overflow-hidden aspect-video">
                  <Image src={editing.image_url} alt="Preview" fill className="object-cover" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Features</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFeature() } }} className="flex-1 px-3 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm" placeholder="Add a feature..." />
                  <button type="button" onClick={addFeature} className="px-4 py-2 bg-primary text-white rounded-xl text-sm hover:bg-primary-dark">Add</button>
                </div>
                <div className="space-y-1">
                  {editing.features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                      <span className="text-sm text-dark">{feature}</span>
                      <button type="button" onClick={() => removeFeature(index)} className="text-red-500 hover:text-red-700">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editing.is_active} onChange={(e) => updateField("is_active", e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-sm text-dark">Active (visible on website)</span>
              </label>
              <button type="submit" disabled={saving} className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-full transition-all disabled:opacity-50">
                <Save className="w-5 h-5" />
                {saving ? "Saving..." : "Save Service"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {services.length > 0 ? (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted">Order</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted">Service</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted">Icon</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted">Features</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted">Status</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="border-t border-gray-100">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => moveUp(service)} className="p-1 hover:bg-gray-100 rounded" disabled={services.indexOf(service) === 0}>
                        <ChevronUp className="w-4 h-4 text-muted" />
                      </button>
                      <span className="text-sm text-dark w-6 text-center">{service.order}</span>
                      <button onClick={() => moveDown(service)} className="p-1 hover:bg-gray-100 rounded" disabled={services.indexOf(service) === services.length - 1}>
                        <ChevronDown className="w-4 h-4 text-muted" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-dark">{service.title}</p>
                    <p className="text-sm text-muted line-clamp-1">{service.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">{service.icon}</span>
                  </td>
                  <td className="px-6 py-4 text-dark">{service.features?.length || 0}</td>
                  <td className="px-6 py-4">
                    {service.is_active ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Active</span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm">Hidden</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(service)} className="p-2 hover:bg-gray-100 rounded-lg"><Edit className="w-4 h-4 text-muted" /></button>
                      <button onClick={() => handleDelete(service.id)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted mb-4">No services yet</p>
            <button onClick={openNew} className="text-primary font-medium hover:underline">Add your first service</button>
          </div>
        )}
      </div>
    </div>
  )
}
