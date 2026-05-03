import { Zap, Home, Building2, Battery, Wrench, Sun } from "lucide-react"
import Link from "next/link"

const services = [
  {
    icon: Home,
    title: "Residential Solar",
    description: "Custom solar panel systems designed for your home. Reduce your electricity bills and increase property value.",
  },
  {
    icon: Building2,
    title: "Commercial Solar",
    description: "Large-scale solar solutions for businesses. Maximize ROI with our commercial installation expertise.",
  },
  {
    icon: Battery,
    title: "Battery Storage",
    description: "Store excess solar energy for use anytime. Stay powered during outages with smart battery systems.",
  },
  {
    icon: Zap,
    title: "EV Chargers",
    description: "Home and commercial electric vehicle charging stations powered by your solar system.",
  },
  {
    icon: Wrench,
    title: "Maintenance & Repair",
    description: "Keep your system running at peak performance with our professional maintenance services.",
  },
  {
    icon: Sun,
    title: "Energy Consulting",
    description: "Expert advice on energy efficiency, system sizing, and maximizing your solar investment.",
  },
]

export default function ServicesSection() {
  return (
    <section className="py-24 bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-primary font-semibold mb-2 tracking-wider uppercase">What We Offer</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-dark mb-4">Our Services</h2>
          <p className="text-muted max-w-2xl mx-auto">
            Comprehensive solar energy solutions tailored to meet your unique needs and budget.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <service.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-dark mb-3">{service.title}</h3>
              <p className="text-muted leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-dark transition-colors"
          >
            View All Services
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
