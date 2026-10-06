import { useEffect, useMemo, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import './App.css'
import CachedImage from './components/CachedImage'
import VehicleDetailPage from './pages/VehicleDetailPage'
import { preloadImages } from './services/imageCache'
import { getVehicleCardImage, getVehiclePreloadImage } from './services/imageVariants'
import { availableVehicles } from './data/vehicles'
import { incomingVehicles } from './data/incomingVehicles'
import { lenders } from './data/lenders'

const menu = [
  { label: 'Inventory', href: '#inventory' },
  { label: 'Financing', href: '#financing' },
  { label: 'About Us', href: '#about' },
  { label: 'Why Us', href: '#why-us' },
  { label: 'Contact', href: '#contact' },
]

const stats = [
  { value: '350+', label: 'Vehicles Sold' },
  { value: '4.9/5', label: 'Average Rating' },
  { value: '12+', label: 'Years in Bowling Green' },
]

const parseMoneySafe = (value) => {
  const digits = String(value || '').replace(/[^\d.]/g, '')
  return digits ? Number(digits) : null
}

const parseMiles = (value) => {
  const digits = String(value || '').replace(/[^\d]/g, '')
  return digits ? Number(digits) : null
}

const extractYear = (model) => {
  const match = String(model || '').match(/\b(19|20)\d{2}\b/)
  return match ? Number(match[0]) : null
}

const inferBodyType = (model) => {
  const text = String(model || '').toLowerCase()

  if (/(terrain|escape|edge|envision|enclave|srx|suv)/.test(text)) {
    return 'SUV'
  }

  if (/(impala|malibu|cruze|charger|sedan)/.test(text)) {
    return 'Sedan'
  }

  return 'Other'
}

const inventory = availableVehicles.map((vehicle) => ({
  ...vehicle,
  year: extractYear(vehicle.model),
  bodyType: inferBodyType(vehicle.model),
  normalizedTitle: String(vehicle.title || '').toLowerCase().includes('clean') ? 'clean' : 'rebuilt',
  priceValue: parseMoneySafe(vehicle.price),
  milesValue: parseMiles(vehicle.miles),
}))

const formatPrice = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})
const formatNumber = new Intl.NumberFormat('en-US')
const incomingVehicleName = (vehicle) =>
  [vehicle.year, vehicle.make, vehicle.model, vehicle.trim].filter(Boolean).join(' ')
const incomingInquiryHref = (name) =>
  `https://wa.me/12707919549?text=${encodeURIComponent(`Hello, I'm interested in the ${name} that's coming soon. Could you share more information?`)}`

const benefits = [
  {
    title: 'Transparent Pricing',
    text: 'No hidden fees. Every quote is clear, itemized, and honest from day one.',
  },
  {
    title: 'Financing Guidance',
    text: 'Explore independent lenders and apply directly with the financial institution you choose.',
  },
  {
    title: 'Inspected Inventory',
    text: 'Each vehicle is reviewed before listing so you can buy with confidence.',
  },
]

const testimonials = [
  {
    name: 'Michelle',
    date: 'March 5, 2026',
    highlights: 'Price - Item Description',
    quote: 'Great vehicle and price. Pleasant to work with. Thank you so much!',
  },
  {
    name: 'Lon',
    date: 'January 15, 2026',
    highlights: 'Punctuality - Communication - Price - Item Description',
    quote: 'Easy to do business with. Would not hesitate to buy another car from them.',
  },
  {
    name: 'Danielle',
    date: 'December 2, 2025',
    highlights: 'Punctuality - Communication - Price - Item Description',
    quote: 'These guys were very friendly and quick responding. The vehicle was just as described and was sold to me at a fair price. They even changed my oil for me. Highly recommend.',
  },
  {
    name: 'Kamilla',
    date: 'October 8, 2025',
    highlights: 'Price - Item Description',
    quote: 'Good quick responses and good vehicle at a great price. Easy purchase.',
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

function IconExternalLink({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M13 5h6v6M19 5l-9 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 13v5a1 1 0 01-1 1H6a1 1 0 01-1-1V6a1 1 0 011-1h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
  const [isHeroImageLoading, setIsHeroImageLoading] = useState(true)
  const [isMapLoading, setIsMapLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [titleFilter, setTitleFilter] = useState('all')
  const [fuelFilter, setFuelFilter] = useState('all')
  const [drivetrainFilter, setDrivetrainFilter] = useState('all')
  const [bodyTypeFilter, setBodyTypeFilter] = useState('all')
  const [yearFrom, setYearFrom] = useState('all')
  const [yearTo, setYearTo] = useState('all')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [maxMiles, setMaxMiles] = useState('')

  const fuelOptions = useMemo(() => [...new Set(inventory.map((car) => car.fuel).filter(Boolean))].sort(), [])
  const drivetrainOptions = useMemo(() => [...new Set(inventory.map((car) => car.drivetrain).filter(Boolean))].sort(), [])
  const bodyTypeOptions = useMemo(() => [...new Set(inventory.map((car) => car.bodyType).filter(Boolean))].sort(), [])
  const yearOptions = useMemo(() => [...new Set(inventory.map((car) => car.year).filter(Boolean))].sort((a, b) => a - b), [])

  const filteredInventory = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    const minPriceValue = minPrice ? Number(minPrice) : null
    const maxPriceValue = maxPrice ? Number(maxPrice) : null
    const maxMilesValue = maxMiles ? Number(maxMiles) : null
    const yearFromValue = yearFrom !== 'all' ? Number(yearFrom) : null
    const yearToValue = yearTo !== 'all' ? Number(yearTo) : null

    return inventory.filter((car) => {
      const matchesSearch = !query || car.model.toLowerCase().includes(query)
      const matchesTitle = titleFilter === 'all' || car.normalizedTitle === titleFilter
      const matchesFuel = fuelFilter === 'all' || car.fuel === fuelFilter
      const matchesDrivetrain = drivetrainFilter === 'all' || car.drivetrain === drivetrainFilter
      const matchesBodyType = bodyTypeFilter === 'all' || car.bodyType === bodyTypeFilter
      const matchesMinPrice = minPriceValue === null || car.priceValue >= minPriceValue
      const matchesMaxPrice = maxPriceValue === null || car.priceValue <= maxPriceValue
      const matchesMaxMiles = maxMilesValue === null || car.milesValue === null || car.milesValue <= maxMilesValue
      const matchesYearFrom = yearFromValue === null || (car.year !== null && car.year >= yearFromValue)
      const matchesYearTo = yearToValue === null || (car.year !== null && car.year <= yearToValue)

      return (
        matchesSearch &&
        matchesTitle &&
        matchesFuel &&
        matchesDrivetrain &&
        matchesBodyType &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesMaxMiles &&
        matchesYearFrom &&
        matchesYearTo
      )
    })
  }, [searchQuery, titleFilter, fuelFilter, drivetrainFilter, bodyTypeFilter, minPrice, maxPrice, maxMiles, yearFrom, yearTo])

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    titleFilter !== 'all' ||
    fuelFilter !== 'all' ||
    drivetrainFilter !== 'all' ||
    bodyTypeFilter !== 'all' ||
    yearFrom !== 'all' ||
    yearTo !== 'all' ||
    minPrice !== '' ||
    maxPrice !== '' ||
    maxMiles !== ''

  const resetFilters = () => {
    setSearchQuery('')
    setTitleFilter('all')
    setFuelFilter('all')
    setDrivetrainFilter('all')
    setBodyTypeFilter('all')
    setYearFrom('all')
    setYearTo('all')
    setMinPrice('')
    setMaxPrice('')
    setMaxMiles('')
  }

  useEffect(() => {
    const savedScroll = sessionStorage.getItem('inventoryScrollY')

    if (savedScroll) {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: Number(savedScroll), behavior: 'auto' })
      })
      sessionStorage.removeItem('inventoryScrollY')
    }
  }, [])

  useEffect(() => {
    const animatedElements = document.querySelectorAll(
      '.reveal, .section-title-pop, .section-ambient, .stars-twinkle, .map-card-pop'
    )

    if (!('IntersectionObserver' in window)) {
      animatedElements.forEach((element) => element.classList.add('in-view'))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -8% 0px',
      }
    )

    animatedElements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [filteredInventory, filtersOpen])

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const inventoryCards = document.querySelectorAll('#inventory article.reveal')
      inventoryCards.forEach((card) => card.classList.add('in-view'))
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [filteredInventory])

  const preloadVehicleGallery = (car) => {
    if (car.status === 'available') {
      preloadImages((car.gallery || []).slice(0, 1).map(getVehiclePreloadImage), { idle: false })
      return
    }

    preloadImages([car.coverImage, ...(car.gallery || [])], {
      idle: false,
      limit: 6,
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      <header className="fixed inset-x-0 top-0 z-50 bg-white/85 backdrop-blur">
        <div className="cuba-flag-ribbon" aria-hidden="true"></div>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <a href="#top" className="flex items-center gap-3">
            <img src="/apple-touch-icon.png" alt="Cubanos Auto Sales & Repair LLC logo" width="180" height="180" className="h-10 w-10 rounded-md" />
            <div>
              <p className="font-display text-3xl leading-6 text-slate-900">Cubanos Auto Sales</p>
              <p className="text-xs font-semibold tracking-[0.12em] text-blue-700">&amp; REPAIR LLC</p>
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
            <a href="tel:+12705991187" className="cta-primary pulse-soft hidden rounded-full px-5 py-2 text-sm font-bold shadow-lg shadow-blue-900/20 sm:inline-flex">
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
              <a href="tel:+12705991187" className="cta-primary mt-1 inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-bold">
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
            <div className="reveal relative z-10 order-2 text-center lg:order-1 lg:text-left">
              <p className="mb-4 inline-flex items-center rounded-full border border-blue-300/35 bg-slate-900/55 px-3 py-1 text-xs font-bold tracking-[0.12em] text-blue-100 shadow-sm backdrop-blur-sm lg:mx-0">
                BOWLING GREEN, KENTUCKY
              </p>
              <h1 className="font-display text-[3.05rem] leading-[0.9] text-white sm:text-7xl lg:text-8xl">
                DRIVE WITH
                <br />
                CUBAN STYLE
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg lg:mx-0 mx-auto">
                Bold inventory and clear numbers. Explore vehicles here, then review financing options directly with independent lenders.
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
                <a href="#inventory" className="cta-primary rounded-full px-6 py-3 text-sm font-bold shadow-lg shadow-blue-900/20">
                  Explore Inventory
                </a>
                <a href="#financing" className="cta-secondary rounded-full px-6 py-3 text-sm font-bold">
                  Explore Financing
                </a>
              </div>

              <div className="mt-6 grid max-w-xl grid-cols-3 gap-2.5 sm:gap-3 lg:mx-0 mx-auto">
                <div className="hero-v2-metric reveal-delay-1">
                  <p className="hero-v2-metric-value">NO FEES</p>
                  <p className="hero-v2-metric-label">Transparent Deals</p>
                </div>
                <div className="hero-v2-metric reveal-delay-2">
                  <p className="hero-v2-metric-value">OPTIONS</p>
                  <p className="hero-v2-metric-label">Independent Lenders</p>
                </div>
                <div className="hero-v2-metric reveal-delay-3">
                  <p className="hero-v2-metric-value">TRADE-IN</p>
                  <p className="hero-v2-metric-label">Welcome</p>
                </div>
              </div>
            </div>

            <div className="reveal reveal-delay-1 relative z-10 order-1 lg:order-2">
              <div className="hero-v2-frame">
                {isHeroImageLoading && <div className="hero-v2-image-placeholder" aria-hidden="true"></div>}
                <picture className="hero-v2-picture">
                  <source
                    type="image/webp"
                    srcSet="/optimized/v1/hero-cubanos-640.webp 640w, /optimized/v1/hero-cubanos-1200.webp 1200w, /optimized/v1/hero-cubanos-1920.webp 1920w"
                    sizes="(min-width: 1024px) 590px, calc(100vw - 2rem)"
                  />
                  <img
                    src="/bannercubanos.png"
                    alt="Classic Cuban car by the seaside"
                    width="1920"
                    height="1072"
                    className={`hero-v2-image ${isHeroImageLoading ? '' : 'is-loaded'}`}
                    fetchPriority="high"
                    loading="eager"
                    decoding="async"
                    onLoad={() => setIsHeroImageLoading(false)}
                  />
                </picture>
              </div>
            </div>
          </div>
          <div className="cuba-stripes" aria-hidden="true"></div>
        </section>

        <section id="inventory" className="section-ambient py-16 sm:py-20 bg-gradient-to-b from-slate-50 to-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Inventory</p>
                <h2 className="section-title-pop font-display text-5xl leading-none text-slate-950 sm:text-6xl">Inventory</h2>
              </div>
              {inventory.length > 0 && (
                <a href="#contact" className="cta-secondary hidden rounded-full px-5 py-2.5 text-sm font-bold sm:inline-flex">
                  Request Full List
                </a>
              )}
            </div>

            {inventory.length > 0 && (
            <div className="card-kinetic mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-300/15 sm:p-5">
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.1em] text-slate-700">Filter Inventory</p>
                    <p className="text-sm font-semibold text-slate-600">{filteredInventory.length} vehicles found</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="rounded-full border border-slate-300 px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-slate-700 transition hover:bg-slate-100"
                      >
                        Clear Filters
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setFiltersOpen((prev) => !prev)}
                      aria-expanded={filtersOpen}
                      aria-controls="inventory-filters-panel"
                      className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-slate-700 transition hover:bg-slate-100"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                        <path d="M4 6h16l-6.2 7.2v4.4l-3.6 1.8v-6.2L4 6z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {filtersOpen ? 'Hide Filters' : 'Show Filters'}
                      <svg viewBox="0 0 24 24" className={`h-4 w-4 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} fill="none" aria-hidden="true">
                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>

                <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-[0.08em] text-slate-600">
                  Search Model
                  <div className={`flex items-center gap-2 rounded-xl border bg-white px-3 py-2 shadow-sm transition focus-within:border-blue-700 ${searchQuery ? 'border-blue-300' : 'border-slate-300'}`}>
                    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-slate-400" fill="none" aria-hidden="true">
                      <path d="M10.5 18a7.5 7.5 0 1 1 5.4-2.3L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search a car"
                      className="w-full border-0 bg-transparent p-0 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </label>
              </div>

              <div
                id="inventory-filters-panel"
                className={`grid grid-cols-1 gap-3 transition-all duration-300 sm:grid-cols-2 xl:grid-cols-4 ${filtersOpen ? 'mt-4 opacity-100' : 'pointer-events-none mt-0 max-h-0 overflow-hidden opacity-0'}`}
              >
                <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-[0.08em] text-slate-600">
                  Title Status
                  <select
                    value={titleFilter}
                    onChange={(event) => setTitleFilter(event.target.value)}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold normal-case text-slate-900 outline-none transition focus:border-blue-700"
                  >
                    <option value="all">All Titles</option>
                    <option value="clean">Clean Title</option>
                    <option value="rebuilt">Rebuilt Title</option>
                  </select>
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-[0.08em] text-slate-600">
                  Body Type
                  <select
                    value={bodyTypeFilter}
                    onChange={(event) => setBodyTypeFilter(event.target.value)}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold normal-case text-slate-900 outline-none transition focus:border-blue-700"
                  >
                    <option value="all">All Body Types</option>
                    {bodyTypeOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-[0.08em] text-slate-600">
                  Fuel Type
                  <select
                    value={fuelFilter}
                    onChange={(event) => setFuelFilter(event.target.value)}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold normal-case text-slate-900 outline-none transition focus:border-blue-700"
                  >
                    <option value="all">All Fuel Types</option>
                    {fuelOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-[0.08em] text-slate-600">
                  Drivetrain
                  <select
                    value={drivetrainFilter}
                    onChange={(event) => setDrivetrainFilter(event.target.value)}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold normal-case text-slate-900 outline-none transition focus:border-blue-700"
                  >
                    <option value="all">All Drivetrains</option>
                    {drivetrainOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-[0.08em] text-slate-600">
                  Year From
                  <select
                    value={yearFrom}
                    onChange={(event) => setYearFrom(event.target.value)}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold normal-case text-slate-900 outline-none transition focus:border-blue-700"
                  >
                    <option value="all">Any Year</option>
                    {yearOptions.map((year) => (
                      <option key={`from-${year}`} value={year}>{year}</option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-[0.08em] text-slate-600">
                  Year To
                  <select
                    value={yearTo}
                    onChange={(event) => setYearTo(event.target.value)}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold normal-case text-slate-900 outline-none transition focus:border-blue-700"
                  >
                    <option value="all">Any Year</option>
                    {yearOptions.map((year) => (
                      <option key={`to-${year}`} value={year}>{year}</option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-[0.08em] text-slate-600">
                  Min Price ($)
                  <input
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={(event) => setMinPrice(event.target.value)}
                    placeholder="0"
                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold normal-case text-slate-900 outline-none transition focus:border-blue-700"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-[0.08em] text-slate-600">
                  Max Price ($)
                  <input
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={(event) => setMaxPrice(event.target.value)}
                    placeholder="20000"
                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold normal-case text-slate-900 outline-none transition focus:border-blue-700"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-[0.08em] text-slate-600">
                  Max Mileage
                  <input
                    type="number"
                    min="0"
                    value={maxMiles}
                    onChange={(event) => setMaxMiles(event.target.value)}
                    placeholder="120000"
                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold normal-case text-slate-900 outline-none transition focus:border-blue-700"
                  />
                </label>
              </div>
            </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredInventory.map((car, index) => (
                <article key={car.id} className={`reveal card-kinetic cuba-accent-border overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-300/20 ${index % 3 === 1 ? 'reveal-delay-1' : index % 3 === 2 ? 'reveal-delay-2' : ''}`}>
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-blue-700 p-5 text-white md:h-56">
                    {car.coverImage && (
                      <CachedImage
                        {...getVehicleCardImage(car.coverImage)}
                        alt={car.coverAlt || `${car.model} exterior`}
                        objectFit={car.cardImageFit}
                        className="absolute inset-0"
                        imgClassName="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                        sizes="(min-width: 1280px) 390px, (min-width: 768px) 46vw, calc(100vw - 2rem)"
                      />
                    )}
                    <div className={car.status === 'available' ? 'absolute inset-0 bg-gradient-to-b from-slate-950/45 via-transparent to-slate-950/60' : 'absolute inset-0 bg-slate-950/40'} aria-hidden="true"></div>
                    <div className="relative z-10 flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-100">{car.title?.toLowerCase().includes('rebuilt') ? 'Rebuilt Title' : car.title}</p>
                      {car.status === 'available' ? (
                        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/70 bg-white/90 px-2 py-1 text-[10px] font-semibold leading-none text-slate-800">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" aria-hidden="true" />
                          Available
                        </span>
                      ) : <IconCar className="h-6 w-6" />}
                    </div>
                    <h3 className={`z-10 text-2xl font-bold leading-tight ${car.status === 'available' ? 'absolute bottom-5 left-5 right-5' : 'relative mt-6'}`}>{car.model}</h3>
                  </div>
                  <div className="p-4">
                    <div className="mb-2 flex items-end justify-between">
                      <p className="text-sm text-slate-500">{car.status === 'available' ? 'Price' : 'Starting Price'}</p>
                      <p className="text-3xl font-extrabold text-slate-900">{car.price}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {car.miles && (
                        <div className="rounded-lg bg-slate-100 px-3 py-2">
                          <p className="text-slate-500">Mileage</p>
                          <p className="font-semibold text-slate-800">{car.miles}</p>
                        </div>
                      )}
                      {car.fuel && (
                        <div className="rounded-lg bg-slate-100 px-3 py-2">
                          <p className="text-slate-500">Fuel Type</p>
                          <p className="font-semibold text-slate-800">{car.fuel}</p>
                        </div>
                      )}
                      {car.engine && car.engineVerified !== false && <div className="rounded-lg bg-slate-100 px-3 py-2"><p className="text-slate-500">Engine</p><p className="font-semibold text-slate-800">{car.engine}</p></div>}
                      {car.exteriorColor && <div className="rounded-lg bg-slate-100 px-3 py-2"><p className="text-slate-500">Exterior</p><p className="font-semibold text-slate-800">{car.exteriorColor}</p></div>}
                    </div>
                    {car.slug ? (
                      <Link
                        to={`/inventory/${car.slug}`}
                        onMouseEnter={() => preloadVehicleGallery(car)}
                        onFocus={() => preloadVehicleGallery(car)}
                        onTouchStart={() => preloadVehicleGallery(car)}
                        onClick={() => {
                          preloadVehicleGallery(car)
                          sessionStorage.setItem('inventoryScrollY', String(window.scrollY))
                        }}
                        className="cta-primary mt-3 inline-flex w-full justify-center rounded-xl px-4 py-2.5 text-sm font-bold"
                      >
                        View Vehicle Details
                      </Link>
                    ) : (
                      <button className="cta-primary mt-3 w-full rounded-xl px-4 py-2.5 text-sm font-bold" type="button">
                        View Vehicle Details
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {inventory.length === 0 ? (
              <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-lg shadow-slate-300/15 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-950">No vehicles available right now</h3>
                  <p className="mt-1 text-sm text-slate-600">Browse the incoming vehicles below or contact us about what’s on the way.</p>
                </div>
                <a href="#contact" className="cta-secondary inline-flex min-h-11 shrink-0 items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold">
                  Contact Us
                </a>
              </div>
            ) : filteredInventory.length === 0 && (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg shadow-slate-300/15">
                <p className="text-lg font-bold text-slate-900">No vehicles match your current filters.</p>
                <p className="mt-2 text-sm text-slate-600">Try adjusting title, price range, mileage, or model search.</p>
              </div>
            )}

            <div className="mt-12 border-t border-slate-200 pt-10 sm:mt-14 sm:pt-12">
              <div className="mb-7 max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-600">Coming Soon</p>
                <h3 className="section-title-pop mt-1 font-display text-4xl leading-none text-slate-950 sm:text-5xl">Incoming Inventory</h3>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  More vehicles are on the way. Browse the incoming inventory and ask us for details before they arrive.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {incomingVehicles.map((car, index) => {
                  const name = incomingVehicleName(car)

                  return (
                    <article key={car.id} className={`incoming-card reveal card-kinetic flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-300/20 ${index % 3 === 1 ? 'reveal-delay-1' : index % 3 === 2 ? 'reveal-delay-2' : ''}`}>
                      <div className="incoming-card-visual">
                        <span className="incoming-status">{car.status === 'coming-soon' ? 'Coming Soon' : car.status}</span>
                        <span className="incoming-visual-mark" aria-hidden="true">{car.year ?? car.model}</span>
                        <div className="incoming-photo-message">
                          <IconCar className="h-11 w-11" />
                          <p>Photos Coming Soon</p>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <h4 className="text-xl font-bold leading-tight text-slate-950 sm:text-2xl">{name}</h4>
                        <p className="mt-3 text-3xl font-extrabold leading-none text-slate-900">{formatPrice.format(car.price)}</p>
                        <ul className="mt-4 flex flex-wrap gap-2 text-sm font-semibold text-slate-700" aria-label={`${name} details`}>
                          <li className="incoming-spec">{formatNumber.format(car.mileage)} mi</li>
                          {car.engine && <li className="incoming-spec">{car.engine}</li>}
                          <li className="incoming-spec">{car.exteriorColor} exterior</li>
                        </ul>
                        <p className={`incoming-title-badge mt-4 ${car.titleStatus === 'Clean Title' ? 'incoming-title-clean' : 'incoming-title-rebuilt'}`}>
                          {car.titleStatus}
                        </p>
                        <div className="mt-auto pt-5">
                          <a
                            href={incomingInquiryHref(name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Ask about the ${name} on WhatsApp (opens in a new tab)`}
                            className="cta-primary incoming-inquiry w-full"
                          >
                            Ask About This Vehicle <span aria-hidden="true">→</span>
                          </a>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="financing" aria-labelledby="financing-heading" className="financing-section border-y border-slate-200 bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="financing-intro">
              <div className="reveal">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Financing Options</p>
                <h2 id="financing-heading" className="section-title-pop mt-2 font-display text-5xl leading-none text-slate-950 sm:text-6xl">
                  Need Financing?<br />Explore Your Options.
                </h2>
              </div>
              <div className="reveal reveal-delay-1 financing-intro-copy">
                <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
                  Financing may be available through independent financial institutions. Review the lenders below to learn more about their auto loan options, eligibility requirements and application process.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Customers apply directly with the lender. All approvals and financing terms are determined by the financial institution.
                </p>
              </div>
            </div>

            <div className="financing-lenders" aria-label="Independent lender options">
              {lenders.map((lender, index) => (
                <article key={lender.name} className="financing-lender reveal">
                  <div className="financing-lender-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</div>
                  <div className="financing-lender-details">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-blue-700">Independent Lender</p>
                    <h3 className="mt-2 text-xl font-bold leading-tight text-slate-950 sm:text-2xl">{lender.name}</h3>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">{lender.description}</p>
                  </div>
                  <div className="financing-lender-actions">
                    {lender.verified ? (
                      <>
                        <a
                          href={lender.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View auto financing at ${lender.name} (opens lender website in a new tab)`}
                          className="cta-secondary financing-lender-link"
                        >
                          View Auto Financing <IconExternalLink className="h-4 w-4 shrink-0" />
                        </a>
                        <a href={`tel:${lender.phone}`} aria-label={`Call ${lender.name} at ${lender.displayPhone}`} className="financing-phone-link">
                          Call {lender.displayPhone}
                        </a>
                      </>
                    ) : (
                      <a href="#contact" className="cta-secondary financing-lender-link">Contact Us</a>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <p className="financing-disclaimer">
              Financing is provided by independent financial institutions and is subject to lender approval, eligibility requirements, vehicle qualifications and individual lender terms. Cubanos Auto Sales does not determine credit approval, rates or loan terms.
            </p>

            <div className="financing-contact">
              <div>
                <h3 className="font-display text-3xl leading-none text-white sm:text-4xl">Have Questions About a Vehicle?</h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-200 sm:text-base">
                  Contact our team for the vehicle information you may need during the financing process.
                </p>
              </div>
              <a href="#contact" className="cta-primary financing-contact-link">Contact Us</a>
            </div>
          </div>
        </section>

        <section id="about" aria-labelledby="about-heading" className="relative scroll-mt-20 bg-slate-50 py-16 sm:py-20">
          <div className="absolute inset-x-0 top-0 h-px bg-slate-200" aria-hidden="true"></div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-16">
              <div className="reveal max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-600">About Cubanos Auto Sales</p>
                <h2 id="about-heading" className="section-title-pop mt-2 font-display text-5xl leading-none text-slate-950 sm:text-6xl">Serving Bowling Green for 12+ Years</h2>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg">
                  Cubanos Auto Sales &amp; Repair LLC has served drivers in Bowling Green, Kentucky for more than 12 years. We share vehicle details, including pricing, mileage, and title status, so you can see what is available and ask us directly about a car.
                </p>
                <a href="#inventory" className="mt-6 inline-flex min-h-11 items-center border-b border-blue-700 text-sm font-bold text-blue-700 transition hover:text-blue-900">
                  Browse Inventory <span className="ml-3" aria-hidden="true">→</span>
                </a>
              </div>
              <div className="reveal reveal-delay-1 border-t-2 border-blue-700" aria-label="Dealership facts">
                {stats.map((item) => (
                  <div key={item.label} className="flex items-baseline justify-between gap-5 border-b border-slate-300 py-5 sm:py-6">
                    <p className="font-display text-5xl leading-none text-slate-950 sm:text-6xl">{item.value}</p>
                    <p className="text-right text-xs font-bold uppercase tracking-[0.1em] text-slate-600 sm:text-sm">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="why-us" className="section-ambient cuba-night py-16 text-white sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-300">Why Cubanos</p>
              <h2 className="section-title-pop font-display text-5xl leading-none sm:text-6xl">Built on Trust, Driven by Results</h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
              <aside className="reveal card-kinetic overflow-hidden rounded-3xl border border-white/15 bg-white/5 shadow-xl shadow-slate-950/35">
                <div className="relative h-full min-h-[320px] sm:min-h-[420px]">
                  <img
                    src="/cubanos%20sales.jpg"
                    alt="Cubanos Auto Sales storefront in Bowling Green"
                    width="1200"
                    height="900"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/35 to-transparent" aria-hidden="true"></div>
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-200">Our Location</p>
                    <p className="mt-2 text-2xl font-extrabold leading-tight">Visit Our Dealership</p>
                    <p className="mt-1 text-sm text-slate-200">1054 Old Barren River Rd Bay 7, Bowling Green, KY</p>
                  </div>
                </div>
              </aside>

              <div className="reveal reveal-delay-1 card-kinetic rounded-3xl border border-white/15 bg-white/5 p-5 sm:p-7 shadow-xl shadow-slate-950/35">
                <p className="text-sm font-semibold text-slate-200">
                  We combine transparent numbers, real communication, and local service so every buyer feels confident from the first visit.
                </p>

                <div className="mt-5 grid gap-4">
                  {benefits.map((item, idx) => (
                    <article key={item.title} className={`card-kinetic rounded-2xl border border-white/10 bg-white/5 p-5 ${idx === 1 ? 'reveal-delay-1' : idx === 2 ? 'reveal-delay-2' : ''}`}>
                      <h3 className="text-lg font-bold">{item.title}</h3>
                      <p className="mt-2 text-sm text-slate-300">{item.text}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="section-title-pop font-display text-5xl leading-none text-slate-950 sm:text-6xl">What Buyers Say</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {testimonials.map((item, idx) => (
                <blockquote key={item.name} className={`reveal card-kinetic review-card rounded-2xl border border-slate-200 bg-slate-50 p-6 ${idx === 1 ? 'reveal-delay-1' : idx === 2 ? 'reveal-delay-2' : ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-500">{item.date}</p>
                    </div>
                  </div>

                  <div className="stars-twinkle mt-3 flex items-center gap-1 text-amber-500">
                    <IconStar className="h-4 w-4" />
                    <IconStar className="h-4 w-4" />
                    <IconStar className="h-4 w-4" />
                    <IconStar className="h-4 w-4" />
                    <IconStar className="h-4 w-4" />
                  </div>

                  <p className="mt-3 text-slate-500"><span className="font-semibold text-slate-600">Highlights:</span> {item.highlights}</p>
                  <p className="mt-3 text-slate-700">{item.quote}</p>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="section-ambient relative overflow-hidden border-t border-slate-200 bg-gradient-to-b from-slate-100 via-white to-slate-100 py-16 sm:py-20">
          <div className="mx-auto grid max-w-7xl items-stretch gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8">
            <section className="reveal card-kinetic flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-300/20 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Visit Us</p>
              <h2 className="section-title-pop font-display text-5xl leading-none text-slate-950 sm:text-6xl">Let us find your next car</h2>

              <div className="mt-6 space-y-4 text-slate-700">
                <p><span className="font-bold text-slate-900">Location:</span> 1054 Old Barren River Rd #7, Bowling Green, KY 42101, United States</p>
                <p><span className="font-bold text-slate-900">Phone:</span> <a href="tel:+12705991187" className="font-semibold text-blue-700">270-599-1187</a></p>
                <p><span className="font-bold text-slate-900">Email:</span> <a href="mailto:cubanosauto21@gmail.com" className="break-all font-semibold text-blue-700">cubanosauto21@gmail.com</a></p>
              </div>

              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700">Business Hours</p>
                <ul className="mt-3 space-y-2 text-sm sm:text-base">
                  <li className="flex items-center justify-between rounded-xl bg-slate-100 px-3 py-2"><span className="font-semibold text-slate-900">Monday</span><span>9:00 AM - 5:30 PM</span></li>
                  <li className="flex items-center justify-between rounded-xl bg-slate-100 px-3 py-2"><span className="font-semibold text-slate-900">Tuesday</span><span>9:00 AM - 5:30 PM</span></li>
                  <li className="flex items-center justify-between rounded-xl bg-slate-100 px-3 py-2"><span className="font-semibold text-slate-900">Wednesday</span><span>9:00 AM - 5:30 PM</span></li>
                  <li className="flex items-center justify-between rounded-xl bg-slate-100 px-3 py-2"><span className="font-semibold text-slate-900">Thursday</span><span>8:00 AM - 5:30 PM</span></li>
                  <li className="flex items-center justify-between rounded-xl bg-slate-100 px-3 py-2"><span className="font-semibold text-slate-900">Friday</span><span>9:00 AM - 5:30 PM</span></li>
                  <li className="flex items-center justify-between rounded-xl bg-slate-100 px-3 py-2"><span className="font-semibold text-slate-900">Saturday</span><span>9:00 AM - 5:30 PM</span></li>
                  <li className="flex items-center justify-between rounded-xl bg-red-50 px-3 py-2 text-red-800"><span className="font-semibold">Sunday</span><span>Closed</span></li>
                </ul>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=1054+Old+Barren+River+Rd+%237,+Bowling+Green,+KY+42101,+United+States"
                  target="_blank"
                  rel="noreferrer"
                  className="cta-secondary rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.08em]"
                >
                  Open In Google Maps
                </a>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=1054+Old+Barren+River+Rd+%237,+Bowling+Green,+KY+42101,+United+States"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-slate-300 px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-slate-700 transition hover:bg-slate-100"
                >
                  Get Directions
                </a>
              </div>
            </section>

            <section className="reveal reveal-delay-1 map-card-pop flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-300/20">
              <div className="bg-slate-900 px-6 py-4 text-white">
                <h3 className="text-xl font-bold">Cubanos Auto Sales &amp; Repair LLC</h3>
                <p className="mt-1 text-sm text-slate-300">Visit us in Bowling Green, KY</p>
              </div>
              <div className="relative min-h-[420px] flex-1 border-t border-slate-200">
                {isMapLoading && (
                  <div className="absolute inset-x-0 bottom-0 top-[73px] z-10 flex items-center justify-center bg-white/85 backdrop-blur-sm">
                    <div className="flex items-center gap-3 rounded-full border border-slate-300 bg-white px-4 py-2 shadow-lg shadow-slate-300/25">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-700"></span>
                      <span className="text-sm font-semibold text-slate-700">Loading map...</span>
                    </div>
                  </div>
                )}
                <iframe
                  title="Cubanos Auto Sales & Repair LLC on Google Maps"
                  src="https://www.google.com/maps?q=Cubanos+Auto+Sales+%26+Repair+LLC,+Bowling+Green,+KY&z=17&output=embed"
                  className="h-full w-full"
                  loading="lazy"
                  onLoad={() => setIsMapLoading(false)}
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </section>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 py-8 text-slate-300">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© 2026 Cubanos Auto Sales &amp; Repair LLC. All rights reserved.</p>
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
