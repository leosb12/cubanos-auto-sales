import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { altima2017, buickEnvision2019, enclave2017, escape2016, impala2017, malibu2018, terrain2017, terrainAzul2017 } from '../data/vehicles'

const vehiclesBySlug = {
  [terrain2017.slug]: terrain2017,
  [impala2017.slug]: impala2017,
  [malibu2018.slug]: malibu2018,
  [terrainAzul2017.slug]: terrainAzul2017,
  [escape2016.slug]: escape2016,
  [buickEnvision2019.slug]: buickEnvision2019,
  [enclave2017.slug]: enclave2017,
  [altima2017.slug]: altima2017,
}

function VehicleDetailPage() {
  const { slug } = useParams()
  const vehicle = useMemo(() => vehiclesBySlug[slug], [slug])
  const [activeImage, setActiveImage] = useState(vehicle?.coverImage || '')

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [slug])

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
            <img src="/apple-touch-icon.png" alt="Cubanos Auto Sales logo" className="h-10 w-10 rounded-md" />
            <div>
              <p className="font-display text-3xl leading-6 text-slate-900">Cubanos</p>
              <p className="text-xs font-semibold tracking-[0.12em] text-blue-700">AUTO SALES</p>
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
                <img src={activeImage} alt={vehicle.model} className="h-full w-full object-cover" />
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-4">
              {vehicle.gallery.map((image, idx) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(image)}
                  className={`overflow-hidden rounded-lg border ${activeImage === image ? 'border-blue-700' : 'border-slate-300'} bg-white`}
                  aria-label={`View image ${idx + 1}`}
                >
                  <img src={image} alt={`${vehicle.model} ${idx + 1}`} className="aspect-[4/3] w-full object-cover" />
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
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-slate-500">Mileage</p><p className="font-bold text-slate-900">{vehicle.miles}</p></div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-slate-500">Engine</p><p className="font-bold text-slate-900">{vehicle.engine}</p></div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-slate-500">Drivetrain</p><p className="font-bold text-slate-900">{vehicle.drivetrain}</p></div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-slate-500">Title</p><p className="font-bold text-red-700">{vehicle.title}</p></div>
            </div>

            <p className="text-sm leading-relaxed text-slate-700">{vehicle.description}</p>
            <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-relaxed text-red-900">{vehicle.disclosure}</p>

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

            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Cash price is fixed: no hidden fees, no price games.</p>
          </aside>
        </section>
      </main>
    </div>
  )
}

export default VehicleDetailPage
