const VEHICLE_IMAGE_ROOT = '/optimized/v1/vehicles'

const vehicleImageStem = (src) => {
  const match = /^\/([a-z0-9-]+)\/([a-z0-9-]+)\.jpg$/i.exec(src || '')
  return match ? `${VEHICLE_IMAGE_ROOT}/${match[1]}/${match[2]}` : null
}

const preparedImageStem = (src) => {
  const match = /^\/optimized\/v[12]\/vehicles\/(2013-ford-edge|2022-dodge-charger-sxt|2016-chevrolet-cruze-lt)\/([a-z0-9-]+)-1600\.webp$/i.exec(src || '')
  return match ? src.replace(/-1600\.webp$/i, '') : null
}

export const getVehicleCardImage = (src) => {
  const preparedStem = preparedImageStem(src)
  const stem = preparedStem || vehicleImageStem(src)
  const cardSuffix = preparedStem ? '-card-tall' : '-card'
  return stem
    ? {
        src: `${stem}${cardSuffix}-800.webp`,
        srcSet: `${stem}${cardSuffix}-480.webp 480w, ${stem}${cardSuffix}-800.webp 800w`,
        fallbackSrc: src,
      }
    : { src }
}

export const getVehicleThumbnailImage = (src) => {
  const stem = preparedImageStem(src) || vehicleImageStem(src)
  return stem ? { src: `${stem}-thumb.webp`, fallbackSrc: src } : { src }
}

export const getVehicleDetailImage = (src) => {
  const stem = preparedImageStem(src)
  return stem
    ? { src, srcSet: `${stem}-960.webp 960w, ${stem}-1600.webp 1600w` }
    : { src }
}

export const getVehiclePreloadImage = (src) => {
  const stem = preparedImageStem(src)
  return stem && typeof window !== 'undefined' && window.innerWidth < 768
    ? `${stem}-960.webp`
    : src
}
