"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Plus, Edit, Trash2, X, Save, Star } from "lucide-react"
import Image from "next/image"

type Testimonial = {
  id: string
  name: string
  role: string | null
  content: string
  rating: number
  image_url: string | null
  is_featured: boolean
}

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    const supabase = await createClient()
    const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false })
    if (data) setTestimonials(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing) return
    setSaving(true)

    const supabase = await createClient()

    if (editing.id) {
      await supabase.from("testimonials").update(editing).eq("id", editing.id)
    } else {
      await supabase.from("testimonials").insert([editing])
    }

    setSaving(false)
    setShowForm(false)
    setEditing(null)
    fetchTestimonials()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return
    const supabase = await createClient()
    await supabase.from("testimonials").delete().eq("id", id)
    fetchTestimonials()
  }

  const openEdit = (item: Testimonial) => {
    setEditing(item)
    setShowForm(true)
  }

  const openNew = () => {
    setEditing({
      id: "",
      name: "",
      role: "",
      content: "",
      rating: 5,
      image_url: "",
      is_featured: false,
    })
    setShowForm(true)
  }

  const updateField = (field: string, value: string | number | boolean) => {
    if (editing) {
      setEditing({ ...editing, [field]: value })
    }
  }

  if (loading) return <div className="text-center py-12 text-muted">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-dark">Testimonials</h2>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Testimonial
        </button>
      </div>

      {showForm && editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-dark">
                {editing.id ? "Edit Testimonial" : "New Testimonial"}
              </h3>
              <button onClick={() => { setShowForm(false); setEditing(null) }}>
                <X className="w-6 h-6 text-muted" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={editing.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Role</label>
                <input
                  type="text"
                  value={editing.role || ""}
                  onChange={(e) => updateField("role", e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="Homeowner, Business Owner, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Content *</label>
                <textarea
                  required
                  rows={4}
                  value={editing.content}
                  onChange={(e) => updateField("content", e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => updateField("rating", star)}
                      className="text-2xl"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= editing.rating ? "fill-accent text-accent" : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Image URL</label>
                <input
                  type="url"
                  value={editing.image_url || ""}
                  onChange={(e) => updateField("image_url", e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.is_featured}
                  onChange={(e) => updateField("is_featured", e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-dark">Featured on homepage</span>
              </label>
              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-full transition-all disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {saving ? "Saving..." : "Save Testimonial"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {testimonial.image_url ? (
                  <Image
                    src={testimonial.image_url}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    {testimonial.name[0]}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-dark">{testimonial.name}</h3>
                  <p className="text-sm text-muted">{testimonial.role || "Customer"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(testimonial)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <Edit className="w-4 h-4 text-muted" />
                </button>
                <button onClick={() => handleDelete(testimonial.id)} className="p-2 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
            <div className="flex gap-1 mb-3">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-accent fill-accent" />
              ))}
            </div>
            <p className="text-muted italic">&ldquo;{testimonial.content}&rdquo;</p>
            {testimonial.is_featured && (
              <span className="inline-block mt-3 px-3 py-1 bg-accent/20 text-accent-dark rounded-full text-xs font-medium">
                Featured
              </span>
            )}
          </div>
        ))}
      </div>

      {testimonials.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted mb-4">No testimonials yet</p>
          <button onClick={openNew} className="text-primary font-medium hover:underline">
            Add your first testimonial
          </button>
        </div>
      )}
    </div>
  )
}
