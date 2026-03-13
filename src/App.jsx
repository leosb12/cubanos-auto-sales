import { useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import './App.css'
import VehicleDetailPage from './pages/VehicleDetailPage'

const menu = [
  { label: 'Inventory', href: '#inventory' },
  { label: 'Financing', href: '#financing' },
  { label: 'Cuban Legacy', href: '#heritage' },
  { label: 'Why Us', href: '#why-us' },
  { label: 'Contact', href: '#contact' },
]

const stats = [
  { value: '350+', label: 'Vehicles Sold' },
  { value: '4.9/5', label: 'Average Rating' },
  { value: '12+', label: 'Years in Bowling Green' },
]

const inventory = [
  { id: 1, slug: '2017-gmc-terrain-awd-sle', coverImage: '/2017%20GMC%20terrain/portada.jpg', model: '2017 GMC Terrain AWD SLE', price: '$7,800 Cash', miles: '104,700 mi', fuel: 'Gasoline' },
  { id: 2, model: '2022 Honda Accord Sport', price: '$23,600', miles: '28,120 mi', fuel: 'Gasoline' },
  { id: 3, model: '2021 Ford F-150 XLT', price: '$34,500', miles: '33,800 mi', fuel: 'Gasoline' },
  { id: 4, model: '2023 Hyundai Tucson SEL', price: '$27,300', miles: '18,905 mi', fuel: 'Gasoline' },
  { id: 5, model: '2022 Chevrolet Malibu LT', price: '$21,900', miles: '26,770 mi', fuel: 'Gasoline' },
  { id: 6, model: '2021 Nissan Altima SR', price: '$20,700', miles: '31,540 mi', fuel: 'Gasoline' },
]

const benefits = [
  {
    title: 'Transparent Pricing',
    text: 'No hidden fees. Every quote is clear, itemized, and honest from day one.',
  },
  {
    title: 'Financing Guidance',
    text: 'We help you compare options so you can choose a plan that fits your budget.',
  },
  {
    title: 'Inspected Inventory',
    text: 'Each vehicle is reviewed before listing so you can buy with confidence.',
  },
]

const heritage = [
  {
    title: 'Cuban Spirit, Professional Service',
    text: 'Warm, direct attention with a modern, no-pressure sales process from start to finish.',
  },
  {
    title: 'Authentic Flag-Inspired Design',
    text: 'Blue stripes, red triangle, and white star translated into a clean premium dealership aesthetic.',
  },
  {
    title: 'Built for Bowling Green',
    text: 'Local trust, transparent pricing, and real support for drivers across the community.',
  },
]

const testimonials = [
  {
    name: 'Daniel Reyes',
    quote:
      'Fast process, clear numbers, no pressure. This is exactly how buying a car should feel.',
  },
  {
    name: 'Martha Rodriguez',
    quote:
      'Great team and great inventory. I got the car I wanted at a fair monthly payment.',
  },
  {
    name: 'Kevin Soto',
    quote:
      'Professional from start to finish. Communication was excellent and everything was transparent.',
  },
]

function IconCar({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M3 14L5.2 8.9A2 2 0 017 7.7h10a2 2 0 011.8 1.2L21 14v4h-2a2.5 2.5 0 01-5 0h-4a2.5 2.5 0 01-5 0H3v-4z" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="7.5" cy="17.5" r="1.5" fill="currentColor" />
      <circle cx="16.5" cy="17.5" r="1.5" fill="currentColor" />
    </svg>
  )
}

function IconShield({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 3l7 3.2v5.8c0 4.8-2.9 7.8-7 9.9-4.1-2.1-7-5.1-7-9.9V6.2L12 3z" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconBank({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M3 9l9-5 9 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M5 10v7M9 10v7M15 10v7M19 10v7" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3 20h18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function IconStar({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 3.7l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 16l-4.8 2.6.9-5.4-3.9-3.8 5.4-.8L12 3.7z" fill="currentColor" />
    </svg>
  )
}

function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      <header className="fixed inset-x-0 top-0 z-50 bg-white/85 backdrop-blur">
        <div className="cuba-flag-ribbon" aria-hidden="true"></div>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <a href="#top" className="flex items-center gap-3">
            <img src="/apple-touch-icon.png" alt="Cubanos Auto Sales logo" className="h-10 w-10 rounded-md" />
            <div>
              <p className="font-display text-3xl leading-6 text-slate-900">Cubanos</p>
              <p className="text-xs font-semibold tracking-[0.12em] text-blue-700">AUTO SALES</p>
            </div>
          </a>

          <nav className="hidden items-center gap-8 lg:flex">
            {menu.map((item) => (
              <a key={item.href} href={item.href} className="text-sm font-semibold text-slate-700 transition hover:text-blue-700">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.11em] text-slate-700 md:inline-flex">
              <IconStar className="h-3.5 w-3.5 text-red-600" /> Cuba Inspired
            </span>
            <a href="tel:+12708430000" className="cta-primary pulse-soft hidden rounded-full px-5 py-2 text-sm font-bold shadow-lg shadow-blue-900/20 sm:inline-flex">
              Call Sales
            </a>
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="inline-flex rounded-md border border-slate-300 p-2 text-slate-700 lg:hidden"
              aria-label="Toggle navigation"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
            <div className="flex flex-col gap-3">
              {menu.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-2 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  {item.label}
                </a>
              ))}
              <a href="tel:+12708430000" className="cta-primary mt-1 inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-bold">
                Call Sales
              </a>
            </div>
          </div>
        )}
      </header>

      <main id="top" className="pt-[68px]">
        <section className="hero-v2 relative isolate overflow-hidden border-b border-slate-700">
          <div className="hero-v2-ornament" aria-hidden="true"></div>
          <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-4 pb-12 pt-10 sm:px-6 sm:pb-14 sm:pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:px-8 lg:pb-16 lg:pt-14">
            <div className="reveal relative z-10 order-2 lg:order-1">
              <p className="mb-4 inline-flex items-center rounded-full border border-blue-300/35 bg-slate-900/55 px-3 py-1 text-xs font-bold tracking-[0.12em] text-blue-100 shadow-sm backdrop-blur-sm">
                BOWLING GREEN, KENTUCKY
              </p>
              <h1 className="font-display text-[3.05rem] leading-[0.9] text-white sm:text-7xl lg:text-8xl">
                DRIVE WITH
                <br />
                CUBAN STYLE
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">
                Bold inventory, clear numbers, and fast approvals. A modern sales experience inspired by Cuban color and confidence.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a href="#inventory" className="cta-primary rounded-full px-6 py-3 text-sm font-bold shadow-lg shadow-blue-900/20">
                  Explore Inventory
                </a>
                <a href="#contact" className="cta-secondary rounded-full px-6 py-3 text-sm font-bold">
                  Get Pre-Approved
                </a>
              </div>

              <div className="mt-6 grid max-w-xl grid-cols-3 gap-2.5 sm:gap-3">
                <div className="hero-v2-metric reveal-delay-1">
                  <p className="hero-v2-metric-value">NO FEES</p>
                  <p className="hero-v2-metric-label">Transparent Deals</p>
                </div>
                <div className="hero-v2-metric reveal-delay-2">
                  <p className="hero-v2-metric-value">24H</p>
                  <p className="hero-v2-metric-label">Fast Approval</p>
                </div>
                <div className="hero-v2-metric reveal-delay-3">
                  <p className="hero-v2-metric-value">TRADE-IN</p>
                  <p className="hero-v2-metric-label">Welcome</p>
                </div>
              </div>
            </div>

            <div className="reveal reveal-delay-1 relative z-10 order-1 lg:order-2">
              <div className="hero-v2-frame">
                <img src="/bannercubanos.jpg" alt="Classic Cuban car by the seaside" className="hero-v2-image" />
              </div>
            </div>
          </div>
          <div className="cuba-stripes" aria-hidden="true"></div>
        </section>

        <section className="cuba-night py-8 text-white">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
            {stats.map((item, idx) => (
              <div key={item.label} className={`reveal rounded-xl border border-white/15 bg-white/5 p-5 text-center ${idx === 1 ? 'reveal-delay-1' : idx === 2 ? 'reveal-delay-2' : ''}`}>
                <p className="font-display text-5xl leading-none text-white">{item.value}</p>
                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.1em] text-slate-300">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="inventory" className="py-16 sm:py-20 bg-gradient-to-b from-slate-50 to-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Inventory</p>
                <h2 className="font-display text-5xl leading-none text-slate-950 sm:text-6xl">Available Vehicles</h2>
              </div>
              <a href="#contact" className="cta-secondary hidden rounded-full px-5 py-2.5 text-sm font-bold sm:inline-flex">
                Request Full List
              </a>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {inventory.map((car, index) => (
                <article key={car.id} className={`reveal cuba-accent-border overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-300/20 ${index % 3 === 1 ? 'reveal-delay-1' : index % 3 === 2 ? 'reveal-delay-2' : ''}`}>
                  <div className="relative h-44 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-blue-700 p-5 text-white">
                    {car.coverImage && (
                      <img src={car.coverImage} alt={`${car.model} portada`} className="absolute inset-0 h-full w-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-slate-950/40" aria-hidden="true"></div>
                    <div className="relative z-10 flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-200">Certified Unit</p>
                      <IconCar className="h-6 w-6" />
                    </div>
                    <h3 className="relative z-10 mt-6 text-2xl font-bold leading-tight">{car.model}</h3>
                  </div>
                  <div className="p-5">
                    <div className="mb-4 flex items-end justify-between">
                      <p className="text-sm text-slate-500">Starting Price</p>
                      <p className="text-3xl font-extrabold text-slate-900">{car.price}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-lg bg-slate-100 p-3">
                        <p className="text-slate-500">Mileage</p>
                        <p className="font-semibold text-slate-800">{car.miles}</p>
                      </div>
                      <div className="rounded-lg bg-slate-100 p-3">
                        <p className="text-slate-500">Fuel Type</p>
                        <p className="font-semibold text-slate-800">{car.fuel}</p>
                      </div>
                    </div>
                    {car.slug ? (
                      <Link to={`/inventory/${car.slug}`} className="cta-primary mt-5 inline-flex w-full justify-center rounded-xl px-4 py-2.5 text-sm font-bold">
                        View Vehicle Details
                      </Link>
                    ) : (
                      <button className="cta-primary mt-5 w-full rounded-xl px-4 py-2.5 text-sm font-bold" type="button">
                        View Vehicle Details
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="financing" className="border-y border-slate-200 bg-white py-16 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
            <div className="reveal cuba-accent-border rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <IconBank className="h-9 w-9 text-blue-700" />
              <h3 className="mt-4 text-xl font-bold text-slate-900">Financing Support</h3>
              <p className="mt-2 text-slate-600">From first-time buyers to rebuild credit cases, we guide your approval process step by step.</p>
            </div>
            <div className="reveal reveal-delay-1 cuba-accent-border rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <IconShield className="h-9 w-9 text-red-600" />
              <h3 className="mt-4 text-xl font-bold text-slate-900">Verified Vehicle History</h3>
              <p className="mt-2 text-slate-600">Transparent records and straightforward paperwork so every decision is informed.</p>
            </div>
            <div className="reveal reveal-delay-2 cuba-accent-border rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <IconCar className="h-9 w-9 text-slate-900" />
              <h3 className="mt-4 text-xl font-bold text-slate-900">Trade-In Ready</h3>
              <p className="mt-2 text-slate-600">Bring your current car for appraisal and reduce your upfront cost immediately.</p>
            </div>
          </div>
        </section>

        <section id="heritage" className="relative overflow-hidden bg-slate-50 py-16 sm:py-20">
          <div className="absolute inset-x-0 top-0 h-px bg-slate-200" aria-hidden="true"></div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative z-10 mb-10 grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-600">Cuban Design Language</p>
                <h2 className="font-display text-5xl leading-none text-slate-950 sm:text-6xl">Cuban Identity, Clean Execution</h2>
                <p className="mt-4 text-slate-700">
                  The visual system is inspired by the Cuban flag and modernized for a premium auto sales brand. Strong colors, clear hierarchy, and refined spacing.
                </p>
              </div>
              <div className="cuba-flag-card">
                <div className="cuba-flag-stripes"></div>
                <div className="cuba-flag-triangle">
                  <IconStar className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            <div className="relative z-10 grid gap-6 md:grid-cols-3">
              {heritage.map((item, idx) => (
                <article key={item.title} className={`reveal rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-300/20 ${idx === 1 ? 'reveal-delay-1' : idx === 2 ? 'reveal-delay-2' : ''}`}>
                  <div className="mb-4 inline-flex rounded-xl bg-red-50 p-2 text-red-600">
                    <IconStar className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-slate-600">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="why-us" className="cuba-night py-16 text-white sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-300">Why Cubanos</p>
              <h2 className="font-display text-5xl leading-none sm:text-6xl">Built on Trust, Driven by Results</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {benefits.map((item, idx) => (
                <article key={item.title} className={`reveal rounded-2xl border border-white/10 bg-white/5 p-6 ${idx === 1 ? 'reveal-delay-1' : idx === 2 ? 'reveal-delay-2' : ''}`}>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="mt-3 text-slate-300">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-5xl leading-none text-slate-950 sm:text-6xl">What Buyers Say</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {testimonials.map((item, idx) => (
                <blockquote key={item.name} className={`reveal rounded-2xl border border-slate-200 bg-slate-50 p-6 ${idx === 1 ? 'reveal-delay-1' : idx === 2 ? 'reveal-delay-2' : ''}`}>
                  <p className="text-slate-700">"{item.quote}"</p>
                  <footer className="mt-4 text-sm font-bold uppercase tracking-[0.1em] text-slate-900">{item.name}</footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="relative overflow-hidden border-t border-slate-200 bg-slate-100 py-16 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="reveal">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Visit Us</p>
              <h2 className="font-display text-5xl leading-none text-slate-950 sm:text-6xl">Let us find your next car</h2>
              <div className="mt-6 space-y-4 text-slate-700">
                <p><span className="font-bold text-slate-900">Location:</span> 1054 Old Barren River Rd Bay 7, Bowling Green, KY</p>
                <p><span className="font-bold text-slate-900">Phone:</span> <a href="tel:+12708430000" className="font-semibold text-blue-700">(270) 843-0000</a></p>
                <p><span className="font-bold text-slate-900">Email:</span> <a href="mailto:sales@cubanosautosales.com" className="font-semibold text-blue-700">sales@cubanosautosales.com</a></p>
                <p><span className="font-bold text-slate-900">Hours:</span> Mon - Sat 9:00 AM to 6:00 PM</p>
              </div>
            </div>

            <form className="reveal reveal-delay-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-300/20">
              <h3 className="text-xl font-bold text-slate-900">Request a Call Back</h3>
              <div className="mt-5 space-y-4">
                <input type="text" placeholder="Full Name" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-700" />
                <input type="email" placeholder="Email Address" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-700" />
                <input type="tel" placeholder="Phone Number" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-700" />
                <textarea rows="4" placeholder="Tell us what vehicle you are looking for" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-700"></textarea>
              </div>
              <button type="submit" className="cta-primary mt-5 w-full rounded-xl px-4 py-3 text-sm font-bold shadow-lg shadow-blue-900/20">
                Send Request
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 py-8 text-slate-300">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© 2026 Cubanos Auto Sales. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href="#inventory" className="hover:text-white">Inventory</a>
            <a href="#financing" className="hover:text-white">Financing</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/inventory/:slug" element={<VehicleDetailPage />} />
    </Routes>
  )
}

export default App
