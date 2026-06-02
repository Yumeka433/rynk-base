import {
  igdl
}
from "../../lib/scraper/igdl.js"

export default {

  name: "instagram",

  command: [

    "ig",

    "igdl",

    "instagram"

  ],

  tags: [

    "download"

  ],

  cooldown: 5,

  async execute(m) {

    const url =
      m.args[0]

    if (!url) {

      return m.reply(
        "Masukkan link Instagram"
      )

    }

    const res =
      await igdl(url)

    if (!res.success) {

      return m.reply(
        res.error
      )

    }

    const data =
      res.data

    if (!data.videoUrl) {

      return m.reply(
        "Video tidak ditemukan"
      )

    }

    await m.sock.sendMessage(

      m.from,

      {

        video: {

          url:
            data.videoUrl

        },

        caption:
``

      },

      {

        quoted:
          m.msg

      }

    )

  }

}