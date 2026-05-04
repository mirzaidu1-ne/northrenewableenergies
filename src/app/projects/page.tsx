import SiteShell from "@/components/SiteShell"
import CTASection from "@/components/CTASection"
import Image from "next/image"

const projects = [
  {
    title: "Modern Family Home",
    category: "Residential",
    location: "Austin, TX",
    capacity: "8.5 kW",
    panels: 24,
    savings: "$1,800/year",
    image: "https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=800&q=80",
  },
  {
    title: "Corporate Office Complex",
    category: "Commercial",
    location: "Dallas, TX",
    capacity: "120 kW",
    panels: 320,
    savings: "$28,000/year",
    image: "https://images.unsplash.com/photo-1497440001374-f6ed0a8bbe19?w=800&q=80",
  },
  {
    title: "Ranch Solar Array",
    category: "Agricultural",
    location: "Fort Worth, TX",
    capacity: "25 kW",
    panels: 72,
    savings: "$5,400/year",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80",
  },
  {
    title: "Suburban Home System",
    category: "Residential",
    location: "Houston, TX",
    capacity: "6.2 kW",
    panels: 18,
    savings: "$1,350/year",
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80",
  },
  {
    title: "Shopping Center Installation",
    category: "Commercial",
    location: "San Antonio, TX",
    capacity: "85 kW",
    panels: 228,
    savings: "$19,500/year",
    image: "https://images.unsplash.com/photo-1611365892117-00ac5ef43c90?w=800&q=80",
  },
  {
    title: "Farm Off-Grid System",
    category: "Agricultural",
    location: "Waco, TX",
    capacity: "15 kW",
    panels: 42,
    savings: "$3,200/year",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80",
  },
]

const categories = ["All", "Residential", "Commercial", "Agricultural"]

export default function ProjectsPage() {
  return (
    <SiteShell>
      <main>
        <section className="pt-32 pb-20 bg-gradient-to-br from-dark to-solar-blue">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-accent font-semibold mb-4 tracking-wider uppercase">Our Projects</p>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Featured Installations
              </h1>
              <p className="text-xl text-white/70 leading-relaxed">
                Browse our portfolio of completed solar installations and see the quality of our work.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-3 mb-12">
              {categories.map((cat, i) => (
                <button
                  key={cat}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    i === 0
                      ? "bg-primary text-white"
                      : "bg-white text-dark hover:bg-primary hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, i) => (
                <div
                  key={i}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-accent text-dark text-xs font-semibold px-3 py-1 rounded-full">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-dark mb-2">{project.title}</h3>
                    <p className="text-muted text-sm mb-4">{project.location}</p>
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-primary font-bold">{project.capacity}</p>
                        <p className="text-muted text-xs">System Size</p>
                      </div>
                      <div>
                        <p className="text-primary font-bold">{project.panels}</p>
                        <p className="text-muted text-xs">Panels</p>
                      </div>
                      <div>
                        <p className="text-primary font-bold">{project.savings}</p>
                        <p className="text-muted text-xs">Savings</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTASection />
      </main>
    </SiteShell>
  )
}
