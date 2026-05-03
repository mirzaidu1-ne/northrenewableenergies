import { createClient } from "@/lib/supabase/server"
import { BarChart3, Image, Users, Mail, TrendingUp } from "lucide-react"

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: projectCount },
    { count: testimonialCount },
    { count: leadCount },
    { count: messageCount },
  ] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("testimonials").select("*", { count: "exact", head: true }),
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }),
  ])

  const { data: recentLeads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  const stats = [
    { label: "Total Projects", value: projectCount || 0, icon: Image, color: "bg-blue-500" },
    { label: "Testimonials", value: testimonialCount || 0, icon: Users, color: "bg-green-500" },
    { label: "Quote Leads", value: leadCount || 0, icon: TrendingUp, color: "bg-accent" },
    { label: "Messages", value: messageCount || 0, icon: Mail, color: "bg-purple-500" },
  ]

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-dark">{stat.value}</p>
                <p className="text-muted text-sm">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-dark mb-4">Recent Leads</h2>
          {recentLeads && recentLeads.length > 0 ? (
            <div className="space-y-4">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-dark">{lead.name}</p>
                    <p className="text-sm text-muted">{lead.email}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    lead.status === "new" ? "bg-green-100 text-green-700" :
                    lead.status === "contacted" ? "bg-blue-100 text-blue-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {lead.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted text-center py-8">No leads yet</p>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-dark mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/admin/projects" className="p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-all text-center">
              <Image className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="font-medium text-dark text-sm">Add Project</p>
            </a>
            <a href="/admin/testimonials" className="p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-all text-center">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="font-medium text-dark text-sm">Add Testimonial</p>
            </a>
            <a href="/admin/blog" className="p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all text-center">
              <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="font-medium text-dark text-sm">Write Post</p>
            </a>
            <a href="/admin/leads" className="p-4 rounded-xl bg-accent/10 hover:bg-accent/20 transition-all text-center">
              <Mail className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="font-medium text-dark text-sm">View Leads</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
