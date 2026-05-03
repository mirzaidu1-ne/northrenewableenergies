"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Plus, Edit, Trash2, X, Save, GripVertical } from "lucide-react"
import Image from "next/image"

type TeamMember = {
  id: string
  name: string
  role: string
  bio: string | null
  image_url: string | null
  order: number
}

export default function AdminTeam() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [editing, setEditing] = useState<TeamMember | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    const supabase = await createClient()
    const { data } = await supabase.from("team_members").select("*").order("order", { ascending: true })
    if (data) setMembers(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing) return
    setSaving(true)

    const supabase = await createClient()

    if (editing.id) {
      await supabase.from("team_members").update(editing).eq("id", editing.id)
    } else {
      await supabase.from("team_members").insert([editing])
    }

    setSaving(false)
    setShowForm(false)
    setEditing(null)
    fetchMembers()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this team member?")) return
    const supabase = await createClient()
    await supabase.from("team_members").delete().eq("id", id)
    fetchMembers()
  }

  const openEdit = (member: TeamMember) => {
    setEditing(member)
    setShowForm(true)
  }

  const openNew = () => {
    setEditing({
      id: "",
      name: "",
      role: "",
      bio: "",
      image_url: "",
      order: members.length + 1,
    })
    setShowForm(true)
  }

  const updateField = (field: string, value: string | number) => {
    if (editing) {
      setEditing({ ...editing, [field]: value })
    }
  }

  const moveMember = async (id: string, direction: "up" | "down") => {
    const currentIndex = members.findIndex((m) => m.id === id)
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === members.length - 1)
    ) return

    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
    const supabase = await createClient()

    await supabase
      .from("team_members")
      .update({ order: members[swapIndex].order })
      .eq("id", id)

    await supabase
      .from("team_members")
      .update({ order: members[currentIndex].order })
      .eq("id", members[swapIndex].id)

    fetchMembers()
  }

  if (loading) return <div className="text-center py-12 text-muted">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-dark">Team Members</h2>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Member
        </button>
      </div>

      {showForm && editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-dark">
                {editing.id ? "Edit Member" : "New Member"}
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
                <label className="block text-sm font-medium text-dark mb-1">Role *</label>
                <input
                  type="text"
                  required
                  value={editing.role}
                  onChange={(e) => updateField("role", e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={editing.bio || ""}
                  onChange={(e) => updateField("bio", e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                />
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
              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-full transition-all disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {saving ? "Saving..." : "Save Member"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {members.map((member, index) => (
          <div key={member.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
            <div className="flex flex-col gap-1 text-muted">
              <button onClick={() => moveMember(member.id, "up")} disabled={index === 0} className="hover:text-primary disabled:opacity-30">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <GripVertical className="w-4 h-4" />
              <button onClick={() => moveMember(member.id, "down")} disabled={index === members.length - 1} className="hover:text-primary disabled:opacity-30">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            {member.image_url ? (
              <Image
                src={member.image_url}
                alt={member.name}
                width={60}
                height={60}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-[60px] h-[60px] rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
                {member.name[0]}
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-dark">{member.name}</h3>
              <p className="text-sm text-muted">{member.role}</p>
              {member.bio && <p className="text-sm text-muted mt-1 line-clamp-1">{member.bio}</p>}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => openEdit(member)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <Edit className="w-4 h-4 text-muted" />
              </button>
              <button
                onClick={() => handleDelete(member.id)}
                className="p-2 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {members.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl">
          <p className="text-muted mb-4">No team members yet</p>
          <button onClick={openNew} className="text-primary font-medium hover:underline">
            Add your first team member
          </button>
        </div>
      )}
    </div>
  )
}
