import { useEffect, useEffectEvent, useRef, useState } from 'react'
import './CachedImage.css'
import { DEFAULT_FALLBACK_IMAGE, getImageCacheEntry, loadImage } from '../services/imageCache'

const joinClasses = (...values) => values.filter(Boolean).join(' ')

const getVisualState = (src, fallbackSrc) => {
  if (!src) {
    return {
      status: 'error',
      displaySrc: fallbackSrc,
      isFallback: true,
    }
  }

  const cacheEntry = getImageCacheEntry(src)

  if (cacheEntry?.status === 'loaded') {
    return {
      status: 'loaded',
      displaySrc: cacheEntry.resolvedSrc || src,
      isFallback: false,
    }
  }

  if (cacheEntry?.status === 'error') {
    return {
      status: 'error',
      displaySrc: fallbackSrc,
      isFallback: true,
    }
  }

  return {
    status: 'loading',
    displaySrc: '',
    isFallback: false,
  }
}

function CachedImage({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK_IMAGE,
  className = '',
  imgClassName = '',
  skeletonClassName = '',
  loading = 'lazy',
  decoding = 'async',
  fetchPriority = 'auto',
  sizes,
  draggable = false,
  onLoad,
  onError,
}) {
  const rootRef = useRef(null)
  const cacheState = getVisualState(src, fallbackSrc)
  const cacheStateKey = `${src || ''}::${fallbackSrc}`
  const [asyncState, setAsyncState] = useState(() => ({
    key: cacheStateKey,
    ...cacheState,
  }))
  const [isIntersecting, setIsIntersecting] = useState(() => loading !== 'lazy')

  const emitLoad = useEffectEvent((payload) => {
    onLoad?.(payload)
  })

  const emitError = useEffectEvent((payload) => {
    onError?.(payload)
  })

  const supportsIntersectionObserver =
    typeof window !== 'undefined' && 'IntersectionObserver' in window
  const shouldLoad =
    loading !== 'lazy' ||
    cacheState.status !== 'loading' ||
    isIntersecting ||
    !supportsIntersectionObserver
  const visualState = asyncState.key === cacheStateKey ? asyncState : { key: cacheStateKey, ...cacheState }

  useEffect(() => {
    if (loading !== 'lazy' || shouldLoad || cacheState.status !== 'loading' || !supportsIntersectionObserver) {
      return undefined
    }

    const target = rootRef.current

    if (!target) {
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsIntersecting(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '240px 0px',
        threshold: 0.01,
      }
    )

    observer.observe(target)

    return () => observer.disconnect()
  }, [loading, shouldLoad, cacheState.status, supportsIntersectionObserver])

  useEffect(() => {
    if (!src || !shouldLoad || cacheState.status !== 'loading') {
      return undefined
    }

    let isActive = true

    loadImage(src)
      .then((entry) => {
        if (!isActive) {
          return
        }

        const resolvedSrc = entry.resolvedSrc || src

        setAsyncState({
          key: cacheStateKey,
          status: 'loaded',
          displaySrc: resolvedSrc,
          isFallback: false,
        })

        emitLoad({
          src,
          resolvedSrc,
        })
      })
      .catch((error) => {
        if (!isActive) {
          return
        }

        setAsyncState({
          key: cacheStateKey,
          status: 'error',
          displaySrc: fallbackSrc,
          isFallback: true,
        })

        emitError({
          src,
          fallbackSrc,
          error,
        })
      })

    return () => {
      isActive = false
    }
  }, [src, fallbackSrc, shouldLoad, cacheState.status, cacheStateKey])

  const statusClassName =
    visualState.status === 'loaded'
      ? 'cached-image--loaded'
      : visualState.status === 'error'
        ? 'cached-image--error'
        : 'cached-image--loading'

  const resolvedAlt = visualState.isFallback
    ? alt
      ? `${alt} image unavailable`
      : 'Image unavailable'
    : alt

  return (
    <div
      ref={rootRef}
      className={joinClasses('cached-image', statusClassName, className)}
      aria-busy={visualState.status === 'loading'}
    >
      <div className="cached-image__surface">
        {visualState.status === 'loading' && (
          <div className={joinClasses('cached-image__skeleton', skeletonClassName)} aria-hidden="true" />
        )}

        {visualState.displaySrc && (
          <img
            src={visualState.displaySrc}
            alt={resolvedAlt}
            className={joinClasses(
              'cached-image__media',
              visualState.isFallback && 'cached-image__media--fallback',
              imgClassName
            )}
            decoding={decoding}
            fetchPriority={fetchPriority}
            loading="eager"
            sizes={sizes}
            draggable={draggable}
          />
        )}
      </div>
    </div>
  )
}

export default CachedImage
