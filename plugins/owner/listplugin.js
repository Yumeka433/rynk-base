export default {

  name: "listplugin",

  command: ["listplugin"],

  owner: true,

  async execute(m) {

    const text =

      [...m.plugins.values()]

      .map(v =>

        `• ${v.name}`

      )

      .join("\n")

    m.reply(text)

  }

}