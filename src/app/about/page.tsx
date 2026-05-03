import Header from "@/components/Header"
import Footer from "@/components/Footer"
import CTASection from "@/components/CTASection"
import Image from "next/image"
import { Shield, Award, Users, Leaf } from "lucide-react"

const team = [
  { name: "Robert Mitchell", role: "Founder & CEO", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop" },
  { name: "Jennifer Adams", role: "Head of Engineering", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop" },
  { name: "David Park", role: "Installation Director", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop" },
  { name: "Lisa Thompson", role: "Customer Relations", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop" },
]

const values = [
  { icon: Shield, title: "Quality Guaranteed", description: "25-year performance warranty on all installations with premium components." },
  { icon: Award, title: "Certified Experts", description: "NABCEP certified installers with decades of combined experience." },
  { icon: Users, title: "Customer First", description: "Dedicated support from consultation through installation and beyond." },
  { icon: Leaf, title: "Sustainability", description: "Committed to reducing carbon footprint and promoting clean energy." },
]

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <section className="pt-32 pb-20 bg-gradient-to-br from-dark to-solar-blue">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-accent font-semibold mb-4 tracking-wider uppercase">About Us</p>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Leading the Solar Revolution Since 2012
              </h1>
              <p className="text-xl text-white/70 leading-relaxed">
                North Renewable Energies was founded with a simple mission: make clean, affordable solar energy accessible to every home and business. Over the past decade, we have grown from a small local installer to one of the region's most trusted solar companies.
              </p>
            </div>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
              <div>
                <h2 className="text-3xl font-bold text-dark mb-6">Our Story</h2>
                <p className="text-muted leading-relaxed mb-6">
                  What started as a passion for renewable energy has become a movement. Our founder, Robert Mitchell, saw the potential of solar energy to transform how we power our lives. After years of working in the energy sector, he launched North Renewable Energies to bring that vision to life.
                </p>
                <p className="text-muted leading-relaxed mb-6">
                  Today, we have completed over 2,500 installations across the region, helping homeowners and businesses save millions in energy costs while reducing their environmental impact. Our team of certified professionals ensures every installation meets the highest standards of quality and safety.
                </p>
                <p className="text-muted leading-relaxed">
                  We believe that solar energy is not just an investment in your property - it's an investment in our planet's future. Every panel we install brings us one step closer to a cleaner, more sustainable world.
                </p>
              </div>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                <Image
                  src="https://images.unsplash.com/photo-1611365892117-00ac5ef43c90?w=800&q=80"
                  alt="Solar installation team"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, i) => (
                <div key={i} className="text-center p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-dark mb-3">{value.title}</h3>
                  <p className="text-muted">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-dark mb-4">Meet Our Team</h2>
              <p className="text-muted max-w-2xl mx-auto">
                The experts behind every successful installation.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, i) => (
                <div key={i} className="group">
                  <div className="relative rounded-2xl overflow-hidden aspect-square mb-4">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-dark">{member.name}</h3>
                  <p className="text-muted">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  )
}
