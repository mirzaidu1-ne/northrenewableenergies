import Header from "@/components/Header"
import Footer from "@/components/Footer"
import HeroSlideshow from "@/components/HeroSlideshow"
import AnimatedCounters from "@/components/AnimatedCounters"
import ServicesSection from "@/components/ServicesSection"
import ProjectsSection from "@/components/ProjectsSection"
import TestimonialsSection from "@/components/TestimonialsSection"
import SolarCalculator from "@/components/SolarCalculator"
import CTASection from "@/components/CTASection"

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSlideshow />
        <AnimatedCounters />
        <ServicesSection />
        <ProjectsSection />
        <SolarCalculator />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
