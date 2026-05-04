import SiteShell from "@/components/SiteShell"
import ContactForm from "./ContactForm"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

type ContactInfo = {
  address?: string
  phone?: string
  email?: string
  businessHours?: string
  mapEmbed?: string
}

async function fetchContactInfo(): Promise<ContactInfo> {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from("site_settings").select("key, value").eq("key", "contact_info").single() as { data: { value: ContactInfo } | null }
    if (data && data.value) {
      return data.value as ContactInfo
    }
  } catch {
  }
  return {}
}

export default async function ContactPage() {
  const contactInfo = await fetchContactInfo()

  return (
    <SiteShell>
      <main>
        <section className="pt-32 pb-20 bg-gradient-to-br from-dark to-solar-blue">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-accent font-semibold mb-4 tracking-wider uppercase">Contact Us</p>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Get In Touch
              </h1>
              <p className="text-xl text-white/70 leading-relaxed">
                Have questions about solar? We're here to help. Reach out and our team will get back to you within 24 hours.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1 space-y-8">
                {contactInfo.address && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark mb-1">Our Office</h3>
                      <p className="text-muted whitespace-pre-line">{contactInfo.address}</p>
                    </div>
                  </div>
                )}
                {contactInfo.phone && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark mb-1">Phone</h3>
                      <p className="text-muted">{contactInfo.phone}</p>
                    </div>
                  </div>
                )}
                {contactInfo.email && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark mb-1">Email</h3>
                      <p className="text-muted">{contactInfo.email}</p>
                    </div>
                  </div>
                )}
                {contactInfo.businessHours && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark mb-1">Business Hours</h3>
                      <p className="text-muted whitespace-pre-line">{contactInfo.businessHours}</p>
                    </div>
                  </div>
                )}

                {contactInfo.mapEmbed && (
                  <div className="rounded-2xl overflow-hidden aspect-video bg-gray-200 mt-8">
                    <iframe
                      src={contactInfo.mapEmbed}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      title="Office Location"
                    />
                  </div>
                )}
              </div>

              <div className="lg:col-span-2">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  )
}
