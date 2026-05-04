"use client"

import { useEffect, useRef, useState } from "react"

function Counter({ target, duration = 2000, suffix = "" }: { target: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true
          const startTime = Date.now()
          const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * target))
            if (progress < 1) requestAnimationFrame(animate)
          }
          animate()
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  )
}

type StatConfig = {
  value: string
  label: string
}

interface AnimatedCountersProps {
  stats: StatConfig[]
}

const defaultStats: StatConfig[] = [
  { value: "2500+", label: "Installations Complete" },
  { value: "15MW", label: "Total Capacity Installed" },
  { value: "98%", label: "Customer Satisfaction" },
  { value: "12+", label: "Years Experience" },
]

function parseStat(value: string): { num: number; suffix: string } {
  const match = value.match(/^([\d,]+\.?\d*)\s*(.*)$/)
  if (match) {
    return { num: parseInt(match[1].replace(/,/g, ""), 10), suffix: match[2] }
  }
  return { num: parseInt(value.replace(/[^0-9]/g, ""), 10) || 0, suffix: value.replace(/[0-9.,]/g, "") }
}

export default function AnimatedCounters({ stats }: AnimatedCountersProps) {
  const statList = stats.length > 0 ? stats : defaultStats

  return (
    <section className="py-20 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {statList.map((stat, i) => {
            const { num, suffix } = parseStat(stat.value)
            return (
              <div key={i} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                  <Counter target={num} suffix={suffix} />
                </div>
                <p className="text-white/70">{stat.label}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
