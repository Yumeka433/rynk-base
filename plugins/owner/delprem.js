import {
  User
} from "../../lib/database.js"

export default {

  name: "delprem",

  command: ["delprem"],

  owner: true,

  async execute(m) {

    const number =
      m.args[0]

    const user =
      await User.findOne({

        jid:
          number

      })

    if (!user)
      return

    user.premium =
      false

    user.premiumExpired =
      0

    await user.save()

    m.reply(
      "Premium removed"
    )

  }

}