"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Mail, Phone, User, Calendar } from "lucide-react"

type Lead = {
  id: string
  name: string
  email: string
  phone: string | null
  message: string | null
  property_type: string | null
  monthly_bill: number | null
  status: string
  created_at: string
}

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    const supabase = await createClient()
    const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false })
    if (data) setLeads(data)
    setLoading(false)
  }

  const updateStatus = async (id: string, status: string) => {
    const supabase = await createClient()
    await supabase.from("leads").update({ status }).eq("id", id)
    fetchLeads()
  }

  const filteredLeads = filter === "all" ? leads : leads.filter((l) => l.status === filter)

  if (loading) return <div className="text-center py-12 text-muted">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-dark">Leads & Quotes</h2>
        <div className="flex gap-2">
          {["all", "new", "contacted", "qualified", "closed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === f
                  ? "bg-primary text-white"
                  : "bg-white text-dark hover:bg-gray-100"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredLeads.map((lead) => (
          <div key={lead.id} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-dark">{lead.name}</h3>
                  <select
                    value={lead.status}
                    onChange={(e) => updateStatus(lead.id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border-0 outline-none cursor-pointer ${
                      lead.status === "new" ? "bg-green-100 text-green-700" :
                      lead.status === "contacted" ? "bg-blue-100 text-blue-700" :
                      lead.status === "qualified" ? "bg-accent/20 text-accent-dark" :
                      "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted">
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {lead.email}
                  </span>
                  {lead.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {lead.phone}
                    </span>
                  )}
                  {lead.property_type && (
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {lead.property_type}
                    </span>
                  )}
                  {lead.monthly_bill && (
                    <span className="flex items-center gap-1">
                      Monthly bill: ${lead.monthly_bill}
                    </span>
                  )}
                </div>
                {lead.message && (
                  <p className="mt-3 text-muted bg-gray-50 rounded-xl p-3 text-sm">
                    {lead.message}
                  </p>
                )}
              </div>
              <div className="text-right text-sm text-muted ml-4">
                <Calendar className="w-4 h-4 mx-auto mb-1" />
                {new Date(lead.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLeads.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl">
          <Mail className="w-12 h-12 text-muted mx-auto mb-4" />
          <p className="text-muted">No leads found</p>
        </div>
      )}
    </div>
  )
}
