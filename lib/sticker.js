import fs from "fs"
import path from "path"

import ffmpeg from "fluent-ffmpeg"
import ffmpegPath from "ffmpeg-static"

import webp from "node-webpmux"

ffmpeg.setFfmpegPath(
  ffmpegPath
)

const tmp = "./temp"

if (!fs.existsSync(tmp)) {

  fs.mkdirSync(tmp)
}

export async function imageToWebp(
  media
) {

  const input =
    path.join(
      tmp,
      `${Date.now()}.jpg`
    )

  const output =
    path.join(
      tmp,
      `${Date.now()}.webp`
    )

  fs.writeFileSync(
    input,
    media
  )

  await new Promise(
    (resolve, reject) => {

      ffmpeg(input)

      .outputOptions([
        "-vcodec",
        "libwebp",

        "-vf",
        "scale=512:512:force_original_aspect_ratio=decrease,fps=15,pad=512:512:-1:-1:color=white@0.0"
      ])

      .toFormat("webp")

      .save(output)

      .on(
        "end",
        resolve
      )

      .on(
        "error",
        reject
      )
    }
  )

  const buff =
    fs.readFileSync(output)

  fs.unlinkSync(input)
  fs.unlinkSync(output)

  return buff
}

export async function videoToWebp(
  media
) {

  const input =
    path.join(
      tmp,
      `${Date.now()}.mp4`
    )

  const output =
    path.join(
      tmp,
      `${Date.now()}.webp`
    )

  fs.writeFileSync(
    input,
    media
  )

  await new Promise(
    (resolve, reject) => {

      ffmpeg(input)

      .outputOptions([
        "-vcodec",
        "libwebp",

        "-vf",
        "scale=512:512:force_original_aspect_ratio=decrease,fps=15,pad=512:512:-1:-1:color=white@0.0",

        "-loop",
        "0",

        "-ss",
        "00:00:00",

        "-t",
        "00:00:10"
      ])

      .toFormat("webp")

      .save(output)

      .on(
        "end",
        resolve
      )

      .on(
        "error",
        reject
      )
    }
  )

  const buff =
    fs.readFileSync(output)

  fs.unlinkSync(input)
  fs.unlinkSync(output)

  return buff
}

export async function writeExif(
  media,
  metadata
) {

  const img =
    new webp.Image()

  const tmpFile =
    path.join(
      tmp,
      `${Date.now()}.webp`
    )

  fs.writeFileSync(
    tmpFile,
    media
  )

  await img.load(tmpFile)

  const exifAttr =
    Buffer.from([
      0x49,0x49,0x2A,0x00,
      0x08,0x00,0x00,0x00,
      0x01,0x00,0x41,0x57,
      0x07,0x00
    ])

  const json =
    {
      "sticker-pack-id":
        "himmel",

      "sticker-pack-name":
        metadata.packname,

      "sticker-pack-publisher":
        metadata.author
    }

  const exif =
    Buffer.concat([
      exifAttr,
      Buffer.from(
        JSON.stringify(json),
        "utf-8"
      )
    ])

  img.exif = exif

  await img.save(tmpFile)

  const buff =
    fs.readFileSync(tmpFile)

  fs.unlinkSync(tmpFile)

  return buff
}