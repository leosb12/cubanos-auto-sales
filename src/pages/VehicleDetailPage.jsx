import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import CachedImage from '../components/CachedImage'
import { cadillacSrx2013, charger2019, cruze2016, equinox2018, escape2016, impala2017, terrain2017 } from '../data/vehicles'
import { preloadImages } from '../services/imageCache'

const vehiclesBySlug = {
  [terrain2017.slug]: terrain2017,
  [impala2017.slug]: impala2017,
  [escape2016.slug]: escape2016,
  [cruze2016.slug]: cruze2016,
  [cadillacSrx2013.slug]: cadillacSrx2013,
  [charger2019.slug]: charger2019,
  [equinox2018.slug]: equinox2018,
}

function VehicleDetailPage() {
  const { slug } = useParams()
  const vehicle = useMemo(() => vehiclesBySlug[slug], [slug])
  const [selectedImage, setSelectedImage] = useState({
    slug: '',
    src: '',
  })
  const activeImage =
    selectedImage.slug === slug && selectedImage.src
      ? selectedImage.src
      : vehicle?.coverImage || vehicle?.gallery?.[0] || ''

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [slug])

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
  }, [slug])

  useEffect(() => {
    if (!vehicle) {
      return undefined
    }

    return preloadImages([vehicle.coverImage, ...(vehicle.gallery || [])], {
      idle: true,
    })
  }, [vehicle])

  if (!vehicle) {
    return <Navigate to="/" replace />
  }

  const whatsappMessage = `Hello, I would like to receive more information about the ${vehicle.model}.`
  const requestInfoWhatsAppHref = `https://wa.me/12707919549?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img src="/apple-touch-icon.png" alt="Cubanos Auto Sales & Repair LLC logo" className="h-10 w-10 rounded-md" />
            <div>
              <p className="font-display text-3xl leading-6 text-slate-900">Cubanos Auto Sales</p>
              <p className="text-xs font-semibold tracking-[0.12em] text-blue-700">&amp; REPAIR LLC</p>
            </div>
          </Link>
          <Link to="/" className="cta-secondary rounded-full px-4 py-2 text-sm font-bold">
            Back To Inventory
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="reveal">
            <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-xl shadow-slate-400/20">
              <div className="aspect-[16/10] bg-slate-900">
                <CachedImage
                  src={activeImage}
                  alt={vehicle.model}
                  className="h-full w-full"
                  imgClassName="h-full w-full object-cover"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  sizes="(min-width: 1024px) 52vw, 100vw"
                />
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-4">
              {vehicle.gallery.map((image, idx) => (
                <button
                  key={`${vehicle.slug}-${image}`}
                  type="button"
                  onClick={() => setSelectedImage({ slug, src: image })}
                  className={`overflow-hidden rounded-lg border ${activeImage === image ? 'border-blue-700' : 'border-slate-300'} bg-white`}
                  aria-label={`View image ${idx + 1}`}
                  aria-pressed={activeImage === image}
                >
                  <CachedImage
                    src={image}
                    alt={`${vehicle.model} ${idx + 1}`}
                    className="aspect-[4/3] w-full"
                    imgClassName="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                    sizes="(min-width: 1024px) 13vw, (min-width: 640px) 18vw, 30vw"
                  />
                </button>
              ))}
            </div>
          </div>

          <aside className="reveal reveal-delay-1 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-400/15">
            <p className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-blue-700">
              Featured SUV
            </p>
            <h1 className="font-display text-5xl leading-[0.92] text-slate-950 sm:text-6xl">{vehicle.model}</h1>
            <p className="text-4xl font-black text-blue-700">{vehicle.price}</p>

            <div className="grid grid-cols-2 gap-3 text-sm">
              {vehicle.miles && <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-slate-500">Mileage</p><p className="font-bold text-slate-900">{vehicle.miles}</p></div>}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-slate-500">Engine</p><p className="font-bold text-slate-900">{vehicle.engine}</p></div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-slate-500">Drivetrain</p><p className="font-bold text-slate-900">{vehicle.drivetrain}</p></div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-slate-500">Title</p><p className="font-bold text-red-700">{vehicle.title}</p></div>
            </div>

            <p className="text-sm leading-relaxed text-slate-700">{vehicle.description}</p>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-blue-50 p-2 text-blue-700">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                    <path d="M12 2.75A9.25 9.25 0 1 0 21.25 12 9.26 9.26 0 0 0 12 2.75Zm0 4.1a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Zm1.4 11.15h-2.8v-1.4h.7v-4.2h-.7V11h2.1v5.4h.7v1.4Z" fill="currentColor" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700">Vehicle Info</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-700">{vehicle.disclosure}</p>
                </div>
              </div>
            </div>

            <ul className="space-y-2 text-sm text-slate-700">
              {vehicle.highlights.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-blue-700"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700">Technical Data</p>
              <div className="mt-3 grid gap-2">
                {vehicle.technicalSpecs?.map((spec) => (
                  <div key={spec.label} className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">{spec.label}</p>
                    <p className="text-sm font-bold text-slate-900">{spec.value}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-slate-500">EPA economy figures sourced from fueleconomy.gov for matching year/powertrain configurations.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <a href="tel:+12705991187" className="cta-primary rounded-xl px-4 py-3 text-center text-sm font-bold">Call Sales</a>
              <a href={requestInfoWhatsAppHref} target="_blank" rel="noreferrer" className="cta-secondary rounded-xl px-4 py-3 text-center text-sm font-bold">Request Info</a>
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Cash price only: no hidden fees, no price games.</p>
          </aside>
        </section>
      </main>
    </div>
  )
}

export default VehicleDetailPage
