import {
  Group
} from "../../lib/database.js"

export default {

  command: ["welcome"],

  group: true,

  async execute(m) {

    const option =
      m.args[0]

    let group =
      await Group.findOne({
        jid: m.from
      })

    if (!group) {

      group =
        await Group.create({
          jid: m.from
        })
    }

    if (
      option === "on"
    ) {

      group.welcome = true

      await group.save()

      return m.reply(
        "Welcome aktif"
      )
    }

    if (
      option === "off"
    ) {

      group.welcome = false

      await group.save()

      return m.reply(
        "Welcome nonaktif"
      )
    }

    m.reply(`
.welcome on
.welcome off
`)
  }
}