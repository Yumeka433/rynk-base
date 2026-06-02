import {
  Group
} from "../../lib/database.js"

export default {

  name: "enable",

  command: ["enable"],

  group: true,

  admin: true,

  async execute(m) {

    const plugin =
      m.args[0]

    const group =
      await Group.findOne({
        jid: m.from
      })

    group.plugins ??= {}

    group.plugins[
      plugin
    ] = true

    group.markModified(
      "plugins"
    )

    await group.save()

    m.reply(
      `${plugin} enabled`
    )

  }

}