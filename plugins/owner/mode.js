export default {
  command: ["mode"],
  owner: true,

  execute: async (m) => {

    const type = m.args[0]

    if (!type) {
      return m.reply(
        `Mode sekarang: ${global.mode}`
      )
    }

    if (
      type !== "self" &&
      type !== "public"
    ) {
      return m.reply(
        "self / public"
      )
    }

    global.mode = type

    m.reply(
      `Berhasil ganti mode ke ${type}`
    )
  }
}