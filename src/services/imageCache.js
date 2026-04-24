export const DEFAULT_FALLBACK_IMAGE = '/assets/images/no-image.svg'

const IMAGE_CACHE_LIMIT = 180
const ERROR_TTL_MS = 60_000
const LOADING_TTL_MS = 30_000

const imageCache = new Map()

const normalizeSrc = (src) => {
  if (typeof src !== 'string') {
    return ''
  }

  return src.trim()
}

const trimCache = () => {
  while (imageCache.size > IMAGE_CACHE_LIMIT) {
    const oldestKey = imageCache.keys().next().value

    if (!oldestKey) {
      return
    }

    imageCache.delete(oldestKey)
  }
}

const touchEntry = (key, entry) => {
  if (imageCache.has(key)) {
    imageCache.delete(key)
  }

  imageCache.set(key, entry)
  trimCache()
  return entry
}

const isExpiredEntry = (entry) => {
  if (!entry?.updatedAt) {
    return false
  }

  if (entry.status === 'error') {
    return Date.now() - entry.updatedAt > ERROR_TTL_MS
  }

  if (entry.status === 'loading') {
    return Date.now() - entry.updatedAt > LOADING_TTL_MS
  }

  return false
}

export const getImageCacheEntry = (src) => {
  const key = normalizeSrc(src)

  if (!key) {
    return null
  }

  const entry = imageCache.get(key)

  if (!entry) {
    return null
  }

  if (isExpiredEntry(entry)) {
    imageCache.delete(key)
    return null
  }

  return touchEntry(key, entry)
}

export const loadImage = (src) => {
  const key = normalizeSrc(src)

  if (!key) {
    return Promise.reject(new Error('Image source is required.'))
  }

  const existingEntry = getImageCacheEntry(key)

  if (existingEntry?.status === 'loaded') {
    return Promise.resolve(existingEntry)
  }

  if (existingEntry?.status === 'loading' && existingEntry.promise) {
    return existingEntry.promise
  }

  if (existingEntry?.status === 'error') {
    return Promise.reject(existingEntry.error ?? new Error(`Failed to load image: ${key}`))
  }

  const image = new Image()
  image.decoding = 'async'

  const promise = new Promise((resolve, reject) => {
    let settled = false

    const cleanup = () => {
      image.onload = null
      image.onerror = null
    }

    const finalizeLoaded = () => {
      if (settled) {
        return
      }

      settled = true
      cleanup()

      const loadedEntry = touchEntry(key, {
        status: 'loaded',
        image,
        resolvedSrc: image.currentSrc || image.src || key,
        updatedAt: Date.now(),
      })

      resolve(loadedEntry)
    }

    const finalizeError = () => {
      if (settled) {
        return
      }

      settled = true
      cleanup()

      const error = new Error(`Failed to load image: ${key}`)
      touchEntry(key, {
        status: 'error',
        resolvedSrc: key,
        error,
        updatedAt: Date.now(),
      })

      reject(error)
    }

    image.onload = () => {
      const decodePromise =
        typeof image.decode === 'function'
          ? image.decode().catch(() => undefined)
          : Promise.resolve()

      decodePromise.then(finalizeLoaded)
    }

    image.onerror = finalizeError
    image.src = key

    if (image.complete) {
      if (image.naturalWidth > 0) {
        const decodePromise =
          typeof image.decode === 'function'
            ? image.decode().catch(() => undefined)
            : Promise.resolve()

        decodePromise.then(finalizeLoaded)
      } else {
        finalizeError()
      }
    }
  })

  touchEntry(key, {
    status: 'loading',
    image,
    promise,
    resolvedSrc: key,
    updatedAt: Date.now(),
  })

  return promise
}

export const preloadImages = (sources, options = {}) => {
  const { idle = true, limit } = options

  const queue = [...new Set((sources || []).map(normalizeSrc).filter(Boolean))]
    .slice(0, typeof limit === 'number' ? limit : undefined)

  if (queue.length === 0) {
    return () => undefined
  }

  let cancelled = false

  const run = () => {
    if (cancelled) {
      return
    }

    queue.forEach((source) => {
      loadImage(source).catch(() => undefined)
    })
  }

  if (!idle || typeof window === 'undefined') {
    run()
    return () => {
      cancelled = true
    }
  }

  if ('requestIdleCallback' in window) {
    const idleId = window.requestIdleCallback(run, { timeout: 1200 })

    return () => {
      cancelled = true
      window.cancelIdleCallback(idleId)
    }
  }

  const timeoutId = window.setTimeout(run, 140)

  return () => {
    cancelled = true
    window.clearTimeout(timeoutId)
  }
}
