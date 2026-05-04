"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Plus, Edit, Trash2, X, Save, Eye, EyeOff } from "lucide-react"
import { slugify } from "@/lib/utils"

type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image: string | null
  author: string
  read_time: string | null
  category: string | null
  published_at: string | null
  is_published: boolean
}

const categories = ["Guide", "Technology", "Finance", "Real Estate", "Maintenance", "Case Study", "News"]

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    const supabase = createClient() as any
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false })
    if (data) setPosts(data as BlogPost[])
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing) return
    setSaving(true)

    const supabase = createClient() as any
    const postData = {
      title: editing.title,
      slug: slugify(editing.title),
      excerpt: editing.excerpt,
      content: editing.content,
      cover_image: editing.cover_image || null,
      author: editing.author,
      read_time: editing.read_time || "5 min read",
      category: editing.category || "Guide",
      is_published: editing.is_published,
      published_at: editing.is_published ? new Date().toISOString() : editing.published_at,
    }

    if (editing.id) {
      await supabase.from("blog_posts").update(postData).eq("id", editing.id)
    } else {
      await supabase.from("blog_posts").insert([postData])
    }

    try {
      await fetch("/api/revalidate-settings")
    } catch {
    }

    setSaving(false)
    setShowForm(false)
    setEditing(null)
    fetchPosts()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return
    const supabase = createClient() as any
    await supabase.from("blog_posts").delete().eq("id", id)
    fetchPosts()
  }

  const togglePublish = async (post: BlogPost) => {
    const supabase = createClient() as any
    await supabase
      .from("blog_posts")
      .update({
        is_published: !post.is_published,
        published_at: !post.is_published ? new Date().toISOString() : null,
      })
      .eq("id", post.id)
    fetchPosts()
  }

  const openEdit = (post: BlogPost) => {
    setEditing(post)
    setShowForm(true)
  }

  const openNew = () => {
    setEditing({
      id: "",
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      cover_image: "",
      author: "North Renewable Energies",
      read_time: "5 min read",
      category: "Guide",
      published_at: null,
      is_published: false,
    })
    setShowForm(true)
  }

  const updateField = (field: string, value: string | boolean) => {
    if (editing) {
      const updated = { ...editing, [field]: value }
      if (field === "title") {
        updated.slug = slugify(value as string)
      }
      setEditing(updated)
    }
  }

  if (loading) return <div className="text-center py-12 text-muted">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-dark">Blog Posts</h2>
        <button onClick={openNew} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full transition-all">
          <Plus className="w-5 h-5" />
          New Post
        </button>
      </div>

      {showForm && editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-dark">{editing.id ? "Edit Post" : "New Post"}</h3>
              <button onClick={() => { setShowForm(false); setEditing(null) }}>
                <X className="w-6 h-6 text-muted" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Title *</label>
                <input type="text" required value={editing.title} onChange={(e) => updateField("title", e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
                {editing.slug && <p className="text-sm text-muted mt-1">Slug: /blog/{editing.slug}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Category</label>
                  <select value={editing.category || "Guide"} onChange={(e) => updateField("category", e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                    {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Read Time</label>
                  <input type="text" value={editing.read_time || "5 min read"} onChange={(e) => updateField("read_time", e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" placeholder="5 min read" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Excerpt *</label>
                <textarea required rows={2} value={editing.excerpt} onChange={(e) => updateField("excerpt", e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Content *</label>
                <textarea required rows={8} value={editing.content} onChange={(e) => updateField("content", e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none font-mono text-sm" placeholder="Write your post content here..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Author</label>
                  <input type="text" value={editing.author} onChange={(e) => updateField("author", e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Cover Image URL</label>
                  <input type="url" value={editing.cover_image || ""} onChange={(e) => updateField("cover_image", e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editing.is_published} onChange={(e) => updateField("is_published", e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-sm text-dark">Publish immediately</span>
              </label>
              <button type="submit" disabled={saving} className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-full transition-all disabled:opacity-50">
                <Save className="w-5 h-5" />
                {saving ? "Saving..." : "Save Post"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted">Post</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted">Category</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted">Author</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted">Status</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-t border-gray-100">
                <td className="px-6 py-4">
                  <p className="font-medium text-dark">{post.title}</p>
                  <p className="text-sm text-muted line-clamp-1">{post.excerpt}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">{post.category || "Guide"}</span>
                </td>
                <td className="px-6 py-4 text-dark">{post.author}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${post.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {post.is_published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => togglePublish(post)} className="p-2 hover:bg-gray-100 rounded-lg" title={post.is_published ? "Unpublish" : "Publish"}>
                      {post.is_published ? <EyeOff className="w-4 h-4 text-muted" /> : <Eye className="w-4 h-4 text-primary" />}
                    </button>
                    <button onClick={() => openEdit(post)} className="p-2 hover:bg-gray-100 rounded-lg"><Edit className="w-4 h-4 text-muted" /></button>
                    <button onClick={() => handleDelete(post.id)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-500" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted mb-4">No blog posts yet</p>
            <button onClick={openNew} className="text-primary font-medium hover:underline">Create your first post</button>
          </div>
        )}
      </div>
    </div>
  )
}
