import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import CachedImage from '../components/CachedImage'
import { availableVehicles } from '../data/vehicles'
import { preloadImages } from '../services/imageCache'
import { getVehicleDetailImage, getVehiclePreloadImage, getVehicleThumbnailImage } from '../services/imageVariants'

const vehiclesBySlug = Object.fromEntries(availableVehicles.map((vehicle) => [vehicle.slug, vehicle]))

// Match the reviewed Cruze photo crops so the large image has no letterboxing
// and the browser does not crop the car to a fixed landscape frame.
const cruzePhotoAspectRatios = {
  'black-front-three-quarter': 3024 / 2450,
  'black-front': 3024 / 2550,
  'black-driver-side-front-wheel': 4032 / 2150,
  'black-passenger-side-rear': 4032 / 2300,
  'black-rear': 3024 / 2700,
  'black-driver-interior': 3024 / 3900,
  'black-front-passenger-interior': 3024 / 3650,
  'dashboard-and-center-console': 4032 / 3024,
  'black-rear-seats': 3024 / 3350,
  'backup-camera-display': 3024 / 2900,
  'open-trunk': 3024 / 3100,
  'engine-bay': 3024 / 1950,
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
      : (vehicle?.status === 'available' ? vehicle?.gallery?.[0] : vehicle?.coverImage) || vehicle?.gallery?.[0] || ''
  const activeImageIndex = vehicle?.gallery?.indexOf(activeImage) ?? -1
  const activeImageAlt = activeImageIndex >= 0
    ? vehicle?.galleryAlt?.[activeImageIndex] || `${vehicle?.model} photo ${activeImageIndex + 1}`
    : vehicle?.coverAlt || vehicle?.model
  const cruzePhotoName = vehicle?.slug === '2016-chevrolet-cruze-lt'
    ? activeImage.split('/').pop().replace(/^2016-chevrolet-cruze-lt-|-1600\.webp$/g, '')
    : ''
  const detailImageAspectRatio = cruzePhotoAspectRatios[cruzePhotoName] || 16 / 10

  useEffect(() => {
    if (!vehicle?.seo) return undefined

    const originalTitle = document.title
    const canonicalUrl = `https://www.cubanosautosales.com/inventory/${vehicle.slug}`
    const updates = [
      ['meta[name="description"]', 'content', vehicle.seo.description],
      ['link[rel="canonical"]', 'href', canonicalUrl],
      ['meta[property="og:title"]', 'content', vehicle.seo.title],
      ['meta[property="og:description"]', 'content', vehicle.seo.description],
      ['meta[property="og:url"]', 'content', canonicalUrl],
      ['meta[property="og:image"]', 'content', `https://www.cubanosautosales.com${vehicle.gallery[0]}`],
      ['meta[property="og:image:secure_url"]', 'content', `https://www.cubanosautosales.com${vehicle.gallery[0]}`],
      ['meta[property="og:image:type"]', 'content', 'image/webp'],
      ['meta[property="og:image:width"]', 'content', '1600'],
      ['meta[property="og:image:height"]', 'content', '1296'],
      ['meta[property="og:image:alt"]', 'content', vehicle.galleryAlt[0]],
      ['meta[name="twitter:title"]', 'content', vehicle.seo.title],
      ['meta[name="twitter:description"]', 'content', vehicle.seo.description],
      ['meta[name="twitter:image"]', 'content', `https://www.cubanosautosales.com${vehicle.gallery[0]}`],
    ]
    const originals = updates.map(([selector, attribute, value]) => {
      const element = document.querySelector(selector)
      const previous = element?.getAttribute(attribute)
      element?.setAttribute(attribute, value)
      return { element, attribute, previous }
    })
    document.title = vehicle.seo.title

    // Restore the existing site metadata on navigation to inventory/other cars.
    return () => {
      document.title = originalTitle
      originals.forEach(({ element, attribute, previous }) => {
        if (previous === null) element?.removeAttribute(attribute)
        else if (previous !== undefined) element?.setAttribute(attribute, previous)
      })
    }
  }, [vehicle])

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

    const sources = vehicle.status === 'available'
      ? (vehicle.gallery || []).slice(1, 2).map(getVehiclePreloadImage)
      : [vehicle.coverImage, ...(vehicle.gallery || []).slice(0, 2)]

    return preloadImages(sources, {
      idle: true,
    })
  }, [vehicle])

  if (!vehicle) {
    return <Navigate to="/" replace />
  }

  const whatsappMessage = vehicle.inquiryMessage || `Hello, I would like to receive more information about the ${vehicle.model}.`
  const requestInfoWhatsAppHref = `https://wa.me/12707919549?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <div className="vehicle-detail-page min-h-screen bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2.5 sm:px-6 sm:py-3 lg:px-8">
          <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
            <img src="/apple-touch-icon.png" alt="Cubanos Auto Sales & Repair LLC logo" width="180" height="180" className="h-8 w-8 shrink-0 rounded-md sm:h-10 sm:w-10" />
            <div className="min-w-0">
              <p className="font-display whitespace-nowrap text-xl leading-5 text-slate-900 sm:text-3xl sm:leading-6">Cubanos Auto Sales</p>
              <p className="text-xs font-semibold tracking-[0.12em] text-blue-700">&amp; REPAIR LLC</p>
            </div>
          </Link>
          <Link to="/" aria-label="Back to Inventory" className="cta-secondary inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold sm:rounded-full sm:px-4 sm:text-sm sm:font-bold">
            <span aria-hidden="true">←</span>
            <span className="sm:hidden">Inventory</span>
            <span className="hidden sm:inline">Back to Inventory</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="reveal">
            <div className="overflow-hidden rounded-2xl bg-transparent shadow-none">
              <div className="bg-transparent" style={{ aspectRatio: detailImageAspectRatio }}>
                <CachedImage
                  {...getVehicleDetailImage(activeImage)}
                  alt={activeImageAlt}
                  objectFit={vehicle.detailImageFit}
                  className="h-full w-full"
                  imgClassName={`h-full w-full ${vehicle.status === 'available' ? 'object-contain' : 'object-cover'}`}
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
                  onMouseEnter={() => preloadImages([getVehiclePreloadImage(image)], { idle: false })}
                  onFocus={() => preloadImages([getVehiclePreloadImage(image)], { idle: false })}
                  onTouchStart={() => preloadImages([getVehiclePreloadImage(image)], { idle: false })}
                  className={`vehicle-gallery-thumbnail overflow-hidden rounded-lg border ${activeImage === image ? 'border-blue-700 outline-2 outline-blue-700 outline-offset-[-2px]' : 'border-gray-200'} bg-transparent p-0 shadow-none`}
                  aria-label={`View ${vehicle.galleryAlt?.[idx] || `image ${idx + 1}`}`}
                  aria-pressed={activeImage === image}
                >
                  <CachedImage
                    {...getVehicleThumbnailImage(image)}
                    alt={vehicle.galleryAlt?.[idx] || `${vehicle.model} photo ${idx + 1}`}
                    className={`${vehicle.slug === '2016-chevrolet-cruze-lt' ? 'aspect-square' : 'aspect-[4/3]'} w-full`}
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
            <p className="inline-flex items-center gap-1.5 self-start rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
              {vehicle.status === 'available' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" aria-hidden="true" />}
              {vehicle.status === 'available' ? 'Available' : 'Featured SUV'}
            </p>
            <h1 className="font-display text-5xl leading-[0.92] text-slate-950 sm:text-6xl">{vehicle.model}</h1>
            <p className="text-4xl font-black text-blue-700">{vehicle.price}</p>

            <div className="grid grid-cols-2 gap-3 text-sm">
              {vehicle.miles && <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-slate-500">Mileage</p><p className="font-bold text-slate-900">{vehicle.miles}</p></div>}
              {vehicle.engine && <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-slate-500">Engine</p><p className="font-bold text-slate-900">{vehicle.engine}</p></div>}
              {vehicle.drivetrain && <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-slate-500">Drivetrain</p><p className="font-bold text-slate-900">{vehicle.drivetrain}</p></div>}
              {vehicle.exteriorColor && <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-slate-500">Exterior</p><p className="font-bold text-slate-900">{vehicle.exteriorColor}</p></div>}
              {vehicle.interiorColor && <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-slate-500">Interior</p><p className="font-bold text-slate-900">{vehicle.interiorColor}</p></div>}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-slate-500">Title</p><p className="font-bold text-slate-900">{vehicle.title}</p></div>
            </div>

            <p className="text-sm leading-relaxed text-slate-700">{vehicle.description}</p>

            {vehicle.slug !== '2013-ford-edge' && vehicle.disclosure && <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
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
            </div>}

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
              {vehicle.status !== 'available' && <p className="mt-3 text-[11px] text-slate-500">EPA economy figures sourced from fueleconomy.gov for matching year/powertrain configurations.</p>}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <a href="tel:+12705991187" className="cta-primary rounded-xl px-4 py-3 text-center text-sm font-bold">{vehicle.callCtaLabel || 'Call Sales'}</a>
              <a href={requestInfoWhatsAppHref} target="_blank" rel="noreferrer" className="cta-secondary rounded-xl px-4 py-3 text-center text-sm font-bold">{vehicle.whatsappCtaLabel || 'Request Info'}</a>
            </div>

            {vehicle.cashPriceOnly !== false && <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Cash price only: no hidden fees, no price games.</p>}
          </aside>
        </section>
      </main>
    </div>
  )
}

export default VehicleDetailPage
