"use client"

import { useState } from "react"
import { Sun, Battery, DollarSign, ArrowRight } from "lucide-react"

export default function SolarCalculator() {
  const [monthlyBill, setMonthlyBill] = useState(200)
  const [roofSize, setRoofSize] = useState(500)
  const [state] = useState("TX")

  const estimatedSystemSize = Math.round((monthlyBill * 12) / 1500 * 10) / 10
  const estimatedPanels = Math.round(estimatedSystemSize * 3)
  const annualSavings = Math.round(monthlyBill * 12 * 0.7)
  const twentyYearSavings = annualSavings * 20
  const co2Offset = Math.round(estimatedSystemSize * 1.5 * 10) / 10

  return (
    <section className="py-24 bg-gradient-to-br from-solar-blue to-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-accent font-semibold mb-2 tracking-wider uppercase">Solar Calculator</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Calculate Your Savings</h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            See how much you could save by switching to solar energy.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-white font-medium">Monthly Electricity Bill</label>
                  <span className="text-accent font-bold">${monthlyBill}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="800"
                  step="10"
                  value={monthlyBill}
                  onChange={(e) => setMonthlyBill(Number(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-white/40 text-sm mt-1">
                  <span>$50</span>
                  <span>$800</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-white font-medium">Available Roof Space</label>
                  <span className="text-accent font-bold">{roofSize} sq ft</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="3000"
                  step="50"
                  value={roofSize}
                  onChange={(e) => setRoofSize(Number(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-white/40 text-sm mt-1">
                  <span>200 sq ft</span>
                  <span>3,000 sq ft</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-white/60">
                <span>Location:</span>
                <span className="font-semibold text-white">{state}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                  <Sun className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Recommended System Size</p>
                  <p className="text-2xl font-bold text-white">{estimatedSystemSize} kW</p>
                </div>
              </div>
              <p className="text-white/60">
                Approximately <span className="text-white font-semibold">{estimatedPanels} panels</span> needed
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary-light" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Estimated Annual Savings</p>
                  <p className="text-2xl font-bold text-white">${annualSavings.toLocaleString()}</p>
                </div>
              </div>
              <p className="text-white/60">
                20-year savings: <span className="text-accent font-semibold">${twentyYearSavings.toLocaleString()}</span>
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <Battery className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Annual CO2 Offset</p>
                  <p className="text-2xl font-bold text-white">{co2Offset} tons</p>
                </div>
              </div>
              <p className="text-white/60">Equivalent to planting {Math.round(co2Offset * 16)} trees per year</p>
            </div>

            <a
              href="/quote"
              className="flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-dark font-semibold px-8 py-4 rounded-full transition-all hover:scale-105 w-full"
            >
              Get Detailed Quote
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
