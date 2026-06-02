import {
  User
} from "../../lib/database.js"

export default {

  name: "addprem",

  command: ["addprem"],

  owner: true,

  async execute(m) {

    const number =
      m.args[0]

    const days =
      Number(
        m.args[1]
      )

    let user =
      await User.findOne({

        jid:
          number

      })

    if (!user) {

      user =
        await User.create({

          jid:
            number

        })

    }

    user.premium =
      true

    user.premiumExpired =

      Date.now()

      +

      (
        days *
        86400000
      )

    await user.save()

    m.reply(
      "Premium added"
    )

  }

}