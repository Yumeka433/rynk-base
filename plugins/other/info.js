import os from "os"

export default {

  name: "info",
  command: ["info"],

  async execute(m) {

    const runtime =
      process.uptime()

    const runtimeText = {

      days:
        Math.floor(
          runtime / 86400
        ),

      hours:
        Math.floor(
          runtime % 86400 / 3600
        ),

      minutes:
        Math.floor(
          runtime % 3600 / 60
        ),

      seconds:
        Math.floor(
          runtime % 60
        )
    }

    const speed =
      (
        performance.now()
      ).toFixed(4)
    
    const txt =
`
🚀 SPEED

• ${speed} ms

🕒 RUNTIME

• ${runtimeText.days}d ${runtimeText.hours}h ${runtimeText.minutes}m ${runtimeText.seconds}s
`
    await m.reply(txt)
  }
}