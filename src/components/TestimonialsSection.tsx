import { Star } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Homeowner",
    content: "Switching to solar was the best decision we made. Our electricity bills dropped by 80% and the installation was seamless. The team was professional and knowledgeable throughout.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    name: "Michael Chen",
    role: "Business Owner",
    content: "North Renewable Energies installed a 50kW system on our warehouse. The ROI has been incredible and our carbon footprint has decreased significantly. Highly recommend!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
  },
  {
    name: "Emily Rodriguez",
    role: "Homeowner",
    content: "From consultation to installation, everything was top-notch. The battery storage system keeps our home powered even during grid outages. Worth every penny.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-accent font-semibold mb-2 tracking-wider uppercase">Testimonials</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">What Our Clients Say</h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Real stories from homeowners and businesses who made the switch to solar energy.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-accent/30 transition-all"
            >
              <div className="flex gap-1 mb-6">
                {Array.from({ length: testimonial.rating }).map((_, j) => (
                  <Star key={j} className="w-5 h-5 text-accent fill-accent" />
                ))}
              </div>
              <p className="text-white/80 mb-6 leading-relaxed italic">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-white/50 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
