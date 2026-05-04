import SiteShell from "@/components/SiteShell"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

type BlogRow = {
  id: string
  title: string
  slug: string
  excerpt: string
  cover_image: string | null
  author: string
  read_time: string | null
  category: string | null
  published_at: string | null
}

const hardcodedPosts = [
  { title: "Is Solar Power Worth It in 2026? A Complete Guide", excerpt: "Explore the latest data on solar panel costs, savings, and incentives to determine if going solar makes financial sense for your home.", date: "April 15, 2026", readTime: "8 min read", category: "Guide", image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80", author: "Robert Mitchell" },
  { title: "How Battery Storage Transforms Your Solar Investment", excerpt: "Learn how adding battery storage to your solar system can maximize savings and provide backup power during outages.", date: "April 8, 2026", readTime: "6 min read", category: "Technology", image: "https://images.unsplash.com/photo-1620714223084-8fcacc6259c1?w=600&q=80", author: "Jennifer Adams" },
  { title: "Federal Tax Credits for Solar: What You Need to Know", excerpt: "The 30% federal solar tax credit is available through 2032. Here's how to claim it and maximize your savings.", date: "March 28, 2026", readTime: "5 min read", category: "Finance", image: "https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=600&q=80", author: "Robert Mitchell" },
]

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ""
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

async function fetchBlogPosts(): Promise<BlogRow[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from("blog_posts").select("id, title, slug, excerpt, cover_image, author, read_time, category, published_at").eq("is_published", true).order("published_at", { ascending: false })
    return (data || []) as BlogRow[]
  } catch {
    return []
  }
}

export default async function BlogPage() {
  const dbPosts = await fetchBlogPosts()
  const posts = dbPosts.length > 0 ? dbPosts.map((p) => ({
    title: p.title,
    excerpt: p.excerpt,
    date: formatDate(p.published_at),
    readTime: p.read_time || "5 min read",
    category: p.category || "Guide",
    image: p.cover_image || "",
    author: p.author,
    slug: p.slug,
  })) : hardcodedPosts

  return (
    <SiteShell>
      <main>
        <section className="pt-32 pb-20 bg-gradient-to-br from-dark to-solar-blue">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-accent font-semibold mb-4 tracking-wider uppercase">Blog</p>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Solar Energy Insights
              </h1>
              <p className="text-xl text-white/70 leading-relaxed">
                Stay informed with the latest news, tips, and guides about solar energy.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, i) => (
                <article key={i} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {post.image && (
                      <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-accent text-dark text-xs font-semibold px-3 py-1 rounded-full">{post.category}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-muted mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </span>
                    </div>
                    <h2 className="text-lg font-semibold text-dark mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-muted text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm text-muted">{post.author}</span>
                      <Link href={`/blog/${(post as { slug?: string }).slug || post.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`} className="flex items-center gap-1 text-primary font-medium text-sm hover:gap-2 transition-all">
                        Read More
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  )
}
