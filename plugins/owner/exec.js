import util from "util"
import cp from "child_process"

const exec =
  util.promisify(cp.exec)

export default {

  command: ["$"],

  owner: true,

  async execute(m) {

    try {

      const code =
        m.body.slice(1)

      const {
        stdout,
        stderr
      } = await exec(code)

      m.reply(
        stdout || stderr
      )

    } catch (e) {

      m.reply(String(e))
    }
  }
}