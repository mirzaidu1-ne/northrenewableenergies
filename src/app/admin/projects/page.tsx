"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Plus, Edit, Trash2, X, Save } from "lucide-react"
import Image from "next/image"

type Project = {
  id: string
  title: string
  description: string
  image_url: string | null
  category: string
  location: string | null
  capacity_kw: number | null
  is_featured: boolean
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [editing, setEditing] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    const supabase = createClient() as any
    const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false })
    if (data) setProjects(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing) return
    setSaving(true)

    const supabase = createClient() as any
    const data = {
      title: editing.title,
      description: editing.description,
      image_url: editing.image_url || null,
      category: editing.category,
      location: editing.location || null,
      capacity_kw: editing.capacity_kw,
      is_featured: editing.is_featured,
    }

    if (editing.id) {
      await supabase.from("projects").update(data).eq("id", editing.id)
    } else {
      await supabase.from("projects").insert([data])
    }

    setSaving(false)
    setShowForm(false)
    setEditing(null)
    fetchProjects()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return
    const supabase = createClient() as any
    await supabase.from("projects").delete().eq("id", id)
    fetchProjects()
  }

  const openEdit = (project: Project) => {
    setEditing(project)
    setShowForm(true)
  }

  const openNew = () => {
    setEditing({
      id: "",
      title: "",
      description: "",
      image_url: "",
      category: "Residential",
      location: "",
      capacity_kw: 0,
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
        <h2 className="text-2xl font-bold text-dark">Projects</h2>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Project
        </button>
      </div>

      {showForm && editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-dark">
                {editing.id ? "Edit Project" : "New Project"}
              </h3>
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
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Image URL</label>
                <input type="url" value={editing.image_url || ""} onChange={(e) => updateField("image_url", e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" placeholder="https://..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Category</label>
                  <select value={editing.category} onChange={(e) => updateField("category", e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Agricultural">Agricultural</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Location</label>
                  <input type="text" value={editing.location || ""} onChange={(e) => updateField("location", e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Capacity (kW)</label>
                  <input type="number" value={editing.capacity_kw || ""} onChange={(e) => updateField("capacity_kw", Number(e.target.value))} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={editing.is_featured} onChange={(e) => updateField("is_featured", e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
                    <span className="text-sm text-dark">Featured</span>
                  </label>
                </div>
              </div>
              {editing.image_url && (
                <div className="relative rounded-xl overflow-hidden aspect-video">
                  <Image src={editing.image_url} alt="Preview" fill className="object-cover" />
                </div>
              )}
              <button type="submit" disabled={saving} className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-full transition-all disabled:opacity-50">
                <Save className="w-5 h-5" />
                {saving ? "Saving..." : "Save Project"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {projects.length > 0 ? (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted">Project</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted">Category</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted">Capacity</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted">Status</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-t border-gray-100">
                  <td className="px-6 py-4">
                    <p className="font-medium text-dark">{project.title}</p>
                    <p className="text-sm text-muted">{project.location}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">{project.category}</span>
                  </td>
                  <td className="px-6 py-4 text-dark">{project.capacity_kw} kW</td>
                  <td className="px-6 py-4">
                    {project.is_featured ? (
                      <span className="px-3 py-1 bg-accent/20 text-accent-dark rounded-full text-sm font-medium">Featured</span>
                    ) : (
                      <span className="text-muted text-sm">Regular</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(project)} className="p-2 hover:bg-gray-100 rounded-lg transition-all"><Edit className="w-4 h-4 text-muted" /></button>
                      <button onClick={() => handleDelete(project.id)} className="p-2 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4 text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted mb-4">No projects yet</p>
            <button onClick={openNew} className="text-primary font-medium hover:underline">Add your first project</button>
          </div>
        )}
      </div>
    </div>
  )
}
