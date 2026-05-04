"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

type HeroSlide = {
  image: string
  title: string
  subtitle: string
  ctaText?: string
  ctaLink?: string
}

interface HeroSlideshowProps {
  slides: HeroSlide[]
  companyName?: string
}

const defaultSlides: HeroSlide[] = [
  {
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1920&q=80",
    title: "Power Your Future with Solar Energy",
    subtitle: "Save up to 70% on your electricity bills with our premium solar installations",
    ctaText: "Get Free Quote",
    ctaLink: "/quote",
  },
]

export default function HeroSlideshow({ slides, companyName = "North Renewable Energies" }: HeroSlideshowProps) {
  const slideList = slides.length > 0 ? slides : defaultSlides
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slideList.length)
  }, [slideList.length])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slideList.length) % slideList.length)
  }, [slideList.length])

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <section className="relative h-screen overflow-hidden">
      {slideList.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 hero-gradient" />
        </div>
      ))}

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-accent font-semibold mb-4 tracking-wider uppercase">
              {companyName}
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {slideList[current].title}
            </h1>
            <p className="text-xl text-white/80 mb-8">
              {slideList[current].subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={slideList[current].ctaLink || "/quote"}
                className="bg-accent hover:bg-accent-dark text-dark font-semibold px-8 py-4 rounded-full text-center transition-all hover:scale-105"
              >
                {slideList[current].ctaText || "Get Free Quote"}
              </a>
              <a
                href="/services"
                className="border-2 border-white/30 hover:border-accent text-white hover:text-accent font-semibold px-8 py-4 rounded-full text-center transition-all"
              >
                Our Services
              </a>
            </div>
          </div>
        </div>
      </div>

      {slideList.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-3">
            {slideList.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`h-2 rounded-full transition-all ${
                  index === current ? "w-8 bg-accent" : "w-2 bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
