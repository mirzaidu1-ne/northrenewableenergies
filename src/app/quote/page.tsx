import SiteShell from "@/components/SiteShell"
import QuoteForm from "./QuoteForm"

export default function QuotePage() {
  return (
    <SiteShell>
      <main>
        <section className="pt-32 pb-20 bg-gradient-to-br from-dark to-solar-blue">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-accent font-semibold mb-4 tracking-wider uppercase">Free Quote</p>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Get Your Custom Solar Quote
              </h1>
              <p className="text-xl text-white/70 leading-relaxed">
                Tell us about your property and energy needs. We'll design a custom solar system and provide a detailed quote within 48 hours.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-light">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <QuoteForm />
          </div>
        </section>
      </main>
    </SiteShell>
  )
}
