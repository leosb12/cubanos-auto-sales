const VEHICLE_IMAGE_ROOT = '/optimized/v1/vehicles'

const vehicleImageStem = (src) => {
  const match = /^\/([a-z0-9-]+)\/([a-z0-9-]+)\.jpg$/i.exec(src || '')
  return match ? `${VEHICLE_IMAGE_ROOT}/${match[1]}/${match[2]}` : null
}

export const getVehicleCardImage = (src) => {
  const stem = vehicleImageStem(src)
  return stem
    ? {
        src: `${stem}-card-800.webp`,
        srcSet: `${stem}-card-480.webp 480w, ${stem}-card-800.webp 800w`,
        fallbackSrc: src,
      }
    : { src }
}

export const getVehicleThumbnailImage = (src) => {
  const stem = vehicleImageStem(src)
  return stem ? { src: `${stem}-thumb.webp`, fallbackSrc: src } : { src }
}
