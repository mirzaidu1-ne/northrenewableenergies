import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function CTASection() {
  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
          Ready to Go Solar?
        </h2>
        <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
          Get a free consultation and custom quote for your property. Our experts will design the perfect solar system for your needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/quote"
            className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-dark font-semibold px-8 py-4 rounded-full transition-all hover:scale-105"
          >
            Get Free Quote
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white text-white font-semibold px-8 py-4 rounded-full transition-all"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  )
}
