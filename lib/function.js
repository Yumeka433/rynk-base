import moment from "moment-timezone"

export const sleep = async (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const runtime = (seconds) => {
  seconds = Number(seconds)

  const d = Math.floor(seconds / (3600 * 24))
  const h = Math.floor(seconds % (3600 * 24) / 3600)
  const m = Math.floor(seconds % 3600 / 60)
  const s = Math.floor(seconds % 60)

  return `${d}d ${h}h ${m}m ${s}s`
}

export const getTime = (format) => {
  return moment.tz("Asia/Jakarta").format(format)
}