import Header from "@/components/Header"
import Footer from "@/components/Footer"
import CTASection from "@/components/CTASection"
import Image from "next/image"
import { CheckCircle, Home, Building2, Battery, Zap, Wrench, Sun } from "lucide-react"

const services = [
  {
    icon: Home,
    title: "Residential Solar",
    description: "Custom-designed solar panel systems for homes of all sizes. We handle everything from permits to installation, ensuring a seamless transition to clean energy.",
    features: [
      "Free home assessment",
      "Custom system design",
      "Premium tier-1 panels",
      "25-year warranty",
      "Financing options available",
      "Net metering setup",
    ],
    image: "https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=800&q=80",
  },
  {
    icon: Building2,
    title: "Commercial Solar",
    description: "Large-scale solar installations for businesses, warehouses, and industrial facilities. Maximize your ROI with our commercial expertise.",
    features: [
      "ROI analysis & planning",
      "Minimal business disruption",
      "Scalable solutions",
      "Tax incentive guidance",
      "Performance monitoring",
      "Maintenance packages",
    ],
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80",
  },
  {
    icon: Battery,
    title: "Battery Storage",
    description: "Store excess solar energy for nighttime use or backup power during outages. Smart battery systems that integrate seamlessly with your solar array.",
    features: [
      "Tesla Powerwall certified",
      "Backup power capability",
      "Smart energy management",
      "Grid independence options",
      "Scalable capacity",
      "Mobile app monitoring",
    ],
    image: "https://images.unsplash.com/photo-1620714223084-8fcacc6259c1?w=800&q=80",
  },
  {
    icon: Zap,
    title: "EV Charging Stations",
    description: "Level 2 EV chargers powered by your solar system. Charge your electric vehicle with clean, free energy from the sun.",
    features: [
      "Level 2 fast charging",
      "Solar-powered charging",
      "Smart scheduling",
      "Home & commercial options",
      "All EV brands compatible",
      "Professional installation",
    ],
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80",
  },
  {
    icon: Wrench,
    title: "Maintenance & Repair",
    description: "Keep your solar system running at peak performance with our comprehensive maintenance and repair services.",
    features: [
      "Annual inspections",
      "Panel cleaning",
      "Inverter repair",
      "System optimization",
      "24/7 emergency service",
      "Performance reports",
    ],
    image: "https://images.unsplash.com/photo-1624397640148-949b1732bb0a?w=800&q=80",
  },
  {
    icon: Sun,
    title: "Energy Consulting",
    description: "Expert guidance on energy efficiency, system sizing, and maximizing your solar investment from certified consultants.",
    features: [
      "Energy audit",
      "System sizing analysis",
      "Financial modeling",
      "Incentive identification",
      "ROI projections",
      "Ongoing support",
    ],
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80",
  },
]

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main>
        <section className="pt-32 pb-20 bg-gradient-to-br from-dark to-solar-blue">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-accent font-semibold mb-4 tracking-wider uppercase">Our Services</p>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Complete Solar Energy Solutions
              </h1>
              <p className="text-xl text-white/70 leading-relaxed">
                From residential installations to commercial projects, we provide end-to-end solar energy services tailored to your needs.
              </p>
            </div>
          </div>
        </section>

        {services.map((service, i) => (
          <section key={i} className={`py-20 ${i % 2 === 0 ? "bg-white" : "bg-light"}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <service.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold text-dark">{service.title}</h2>
                  </div>
                  <p className="text-muted leading-relaxed mb-8">{service.description}</p>
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-3 text-dark">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/quote"
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-full transition-all"
                  >
                    Get Started
                  </a>
                </div>
                <div className={`relative rounded-2xl overflow-hidden aspect-[4/3] ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </section>
        ))}

        <CTASection />
      </main>
      <Footer />
    </>
  )
}
