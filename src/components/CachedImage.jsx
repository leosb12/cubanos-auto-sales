import { useState } from 'react'
import './CachedImage.css'
import { DEFAULT_FALLBACK_IMAGE, getImageCacheEntry, rememberLoadedImage } from '../services/imageCache'

const joinClasses = (...values) => values.filter(Boolean).join(' ')

const getVisualState = (src, fallbackSrc) => {
  const cacheEntry = src ? getImageCacheEntry(src) : null

  if (!src || cacheEntry?.status === 'error') {
    return {
      status: 'loading',
      displaySrc: fallbackSrc,
      isFallback: true,
    }
  }

  return {
    status: cacheEntry?.status === 'loaded' ? 'loaded' : 'loading',
    displaySrc: src,
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
  srcSet,
  sizes,
  draggable = false,
  onLoad,
  onError,
}) {
  const stateKey = `${src || ''}::${fallbackSrc}`
  const [imageState, setImageState] = useState(() => ({
    key: stateKey,
    ...getVisualState(src, fallbackSrc),
  }))
  const visualState = imageState.key === stateKey
    ? imageState
    : { key: stateKey, ...getVisualState(src, fallbackSrc) }

  const handleLoad = (event) => {
    const resolvedSrc = event.currentTarget.currentSrc || visualState.displaySrc
    rememberLoadedImage(visualState.displaySrc, resolvedSrc)
    setImageState({ ...visualState, status: 'loaded' })
    onLoad?.({ src, resolvedSrc })
  }

  const handleError = () => {
    const error = new Error(`Failed to load image: ${visualState.displaySrc}`)
    onError?.({ src, fallbackSrc, error })

    if (!visualState.isFallback && fallbackSrc && fallbackSrc !== src) {
      setImageState({ key: stateKey, status: 'loading', displaySrc: fallbackSrc, isFallback: true })
    } else {
      setImageState({ key: stateKey, status: 'error', displaySrc: '', isFallback: true })
    }
  }

  const statusClassName = `cached-image--${visualState.status}`
  const isUnavailable = visualState.isFallback && fallbackSrc === DEFAULT_FALLBACK_IMAGE
  const resolvedAlt = isUnavailable
    ? alt ? `${alt} image unavailable` : 'Image unavailable'
    : alt

  return (
    <div
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
            srcSet={visualState.isFallback ? undefined : srcSet}
            sizes={sizes}
            alt={resolvedAlt}
            className={joinClasses(
              'cached-image__media',
              isUnavailable && 'cached-image__media--fallback',
              imgClassName
            )}
            decoding={decoding}
            fetchPriority={fetchPriority}
            loading={loading}
            draggable={draggable}
            onLoad={handleLoad}
            onError={handleError}
          />
        )}
      </div>
    </div>
  )
}

export default CachedImage
