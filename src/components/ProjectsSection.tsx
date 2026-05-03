import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

const projects = [
  {
    title: "Residential Rooftop System",
    category: "Residential",
    location: "Austin, TX",
    capacity: "8.5 kW",
    image: "https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=600&q=80",
  },
  {
    title: "Commercial Warehouse Installation",
    category: "Commercial",
    location: "Dallas, TX",
    capacity: "50 kW",
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600&q=80",
  },
  {
    title: "Farm Solar Array",
    category: "Agricultural",
    location: "Houston, TX",
    capacity: "25 kW",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80",
  },
]

export default function ProjectsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-primary font-semibold mb-2 tracking-wider uppercase">Our Work</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-dark mb-4">Recent Projects</h2>
          <p className="text-muted max-w-2xl mx-auto">
            Explore our latest solar installations and see the quality of our work firsthand.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer"
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="inline-block bg-accent text-dark text-xs font-semibold px-3 py-1 rounded-full mb-3">
                  {project.category}
                </span>
                <h3 className="text-xl font-bold text-white mb-1">{project.title}</h3>
                <p className="text-white/70 text-sm">
                  {project.location} &middot; {project.capacity}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-4 rounded-full transition-all hover:scale-105"
          >
            View All Projects
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
