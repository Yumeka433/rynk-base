import {
  downloadContentFromMessage
} from "@whiskeysockets/baileys"

import {
  imageToWebp,
  videoToWebp,
  writeExif
} from "../../lib/sticker.js"

export default {

  command: ["s", "sticker"],

  folder: "tools",

  async execute(m) {

    const quoted =
      m.msg.message
        ?.extendedTextMessage
        ?.contextInfo
        ?.quotedMessage

    if (!quoted) {

      return m.reply(
        "Reply image/video"
      )
    }

    const type =
      Object.keys(quoted)[0]

    const stream =
      await downloadContentFromMessage(
        quoted[type],
        type === "imageMessage"
          ? "image"
          : "video"
      )

    let buffer =
      Buffer.from([])

    for await (
      const chunk of stream
    ) {

      buffer =
        Buffer.concat([
          buffer,
          chunk
        ])
    }

    let webpBuff

    if (
      type === "imageMessage"
    ) {

      webpBuff =
        await imageToWebp(buffer)

    } else {

      webpBuff =
        await videoToWebp(buffer)
    }

    const sticker =
      await writeExif(
        webpBuff,
        {
          packname:
            global.packname,

          author:
            global.author
        }
      )

    await m.sock.sendMessage(
      m.from,
      {
        sticker
      },
      {
        quoted: m.msg
      }
    )
  }
}