"use client"

import { useState } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { CheckCircle, Sun } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function QuotePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    propertyType: "residential",
    monthlyBill: "",
    address: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.from("leads").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        property_type: formData.propertyType,
        monthly_bill: formData.monthlyBill ? Number(formData.monthlyBill) : null,
        message: formData.message || null,
        status: "new",
      })

      if (!error) {
        setSubmitted(true)
        setFormData({ name: "", email: "", phone: "", propertyType: "residential", monthlyBill: "", address: "", message: "" })
      }
    } catch {
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => setStep((s) => Math.min(s + 1, 3))
  const prevStep = () => setStep((s) => Math.max(s - 1, 1))

  return (
    <>
      <Header />
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
            <div className="flex justify-center mb-12">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    s === step ? "bg-accent text-dark" : s < step ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
                  }`}>
                    {s < step ? <CheckCircle className="w-5 h-5" /> : s}
                  </div>
                  {s < 3 && (
                    <div className={`w-20 h-1 ${s < step ? "bg-primary" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              {submitted ? (
                <div className="text-center py-12">
                  <Sun className="w-16 h-16 text-accent mx-auto mb-4 animate-float" />
                  <h3 className="text-2xl font-bold text-dark mb-2">Quote Request Received!</h3>
                  <p className="text-muted mb-6">
                    Our solar experts will review your information and contact you within 48 hours with a custom quote.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-primary font-semibold hover:underline"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {step === 1 && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold text-dark mb-6">Personal Information</h2>
                      <div>
                        <label className="block text-sm font-medium text-dark mb-2">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark mb-2">Email *</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark mb-2">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                      <button type="button" onClick={nextStep} className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 rounded-full transition-all">
                        Next Step
                      </button>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold text-dark mb-6">Property Details</h2>
                      <div>
                        <label className="block text-sm font-medium text-dark mb-2">Property Type *</label>
                        <select
                          name="propertyType"
                          value={formData.propertyType}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        >
                          <option value="residential">Residential - House</option>
                          <option value="commercial">Commercial Building</option>
                          <option value="agricultural">Agricultural / Farm</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark mb-2">Average Monthly Electricity Bill *</label>
                        <input
                          type="number"
                          name="monthlyBill"
                          required
                          value={formData.monthlyBill}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          placeholder="$200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark mb-2">Property Address *</label>
                        <input
                          type="text"
                          name="address"
                          required
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          placeholder="123 Main St, City, State"
                        />
                      </div>
                      <div className="flex gap-4">
                        <button type="button" onClick={prevStep} className="flex-1 border-2 border-gray-200 hover:border-primary text-dark font-semibold py-4 rounded-full transition-all">
                          Back
                        </button>
                        <button type="button" onClick={nextStep} className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-4 rounded-full transition-all">
                          Next Step
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold text-dark mb-6">Additional Details</h2>
                      <div>
                        <label className="block text-sm font-medium text-dark mb-2">Additional Notes</label>
                        <textarea
                          name="message"
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                          placeholder="Tell us about your roof type, energy goals, or any questions..."
                        />
                      </div>
                      <div className="bg-primary/5 rounded-xl p-4">
                        <h4 className="font-semibold text-primary mb-2">What happens next?</h4>
                        <ul className="text-muted text-sm space-y-2">
                          <li>1. Our team reviews your information</li>
                          <li>2. We design a custom solar system for your property</li>
                          <li>3. You receive a detailed quote within 48 hours</li>
                          <li>4. Schedule a free consultation to discuss options</li>
                        </ul>
                      </div>
                      <div className="flex gap-4">
                        <button type="button" onClick={prevStep} className="flex-1 border-2 border-gray-200 hover:border-primary text-dark font-semibold py-4 rounded-full transition-all">
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 bg-accent hover:bg-accent-dark text-dark font-semibold py-4 rounded-full transition-all disabled:opacity-50"
                        >
                          {loading ? "Submitting..." : "Submit Quote Request"}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
