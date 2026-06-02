import {
  ai
} from "../../lib/scraper/ai.js"

export default {

  command: ["ai", "gpt"],

  folder: "ai",

  async execute(m) {

    const q =
      m.args.join(" ")

    if (!q) {

      return m.reply(
        "Contoh:\n.ai halo"
      )
    }

    m.reply("Thinking...")

    const res =
      await ai(q)

    if (!res.success) {

      return m.reply(
        res.error
      )
    }

    m.reply(res.result)
  }
}