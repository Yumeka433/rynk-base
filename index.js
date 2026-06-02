import "./config.js"

import {
  default as makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} from "@whiskeysockets/baileys"

import pino from "pino"

import readline from "readline"

import figlet from "figlet"

import gradient from "gradient-string"

import handler from "./handler.js"

import {
  connectMongo,
  Group
} from "./lib/database.js"

console.log(
  gradient.instagram.multiline(
    figlet.textSync(
      global.botname
    )
  )
)

const rl =
  readline.createInterface({

    input:
      process.stdin,

    output:
      process.stdout
  })

const question = (text) => {

  return new Promise(resolve => {

    rl.question(
      text,
      resolve
    )
  })
}

const parseJid = (user) => {

  return String(
    user?.id || user || ""
  )
}

async function startBot() {

  const {
    state,
    saveCreds
  } =
    await useMultiFileAuthState(
      "./auth"
    )

  const { version } =
    await fetchLatestBaileysVersion()

  const sock =
    makeWASocket({

      version,

      logger:
        pino({
          level: "silent"
        }),

      auth: state,

      browser: [
        "Ubuntu",
        "Chrome",
        "20.0.04"
      ]
    })

  if (
    !sock.authState.creds
      .registered
  ) {

    const phone =
      await question(
        "Input Number : "
      )

    const code =
      await sock.requestPairingCode(
        phone
      )

    console.log(
      `PAIRING CODE : ${code}`
    )
  }

  sock.ev.on(
    "connection.update",

    async (update) => {

      const {
        connection,
        lastDisconnect
      } = update

      if (
        connection === "open"
      ) {

        console.log(
          "[ BOT ] Connected"
        )
      }

      if (
        connection === "close"
      ) {

        const shouldReconnect =
          lastDisconnect?.error
            ?.output?.statusCode !==
          DisconnectReason
            .loggedOut

        if (
          shouldReconnect
        ) {

          startBot()
        }
      }
    }
  )

  sock.ev.on(
    "creds.update",
    saveCreds
  )

  sock.ev.on(
    "group-participants.update",

    async (anu) => {

      try {

        const group =
          await Group.findOne({
            jid: anu.id
          })

        if (
          !group?.welcome
        ) return

        const metadata =
          await sock.groupMetadata(
            anu.id
          )

        const users =
          anu.participants.map(user =>
            parseJid(user)
          )

        const mentions =
          users.map(v =>
            `@${v.split("@")[0]}`
          )

        if (
          anu.action === "add" ||
          anu.action === "invite"
        ) {

          await sock.sendMessage(
            anu.id,
            {
              text:
`Welcome

${mentions.join("\n")}

Group :
${metadata.subject}`,

              mentions: users
            }
          )
        }

      } catch (e) {

        console.log(e)
      }
    }
  )

  sock.ev.on(
    "messages.upsert",

    async ({ messages }) => {

      try {

        const msg =
          messages[0]

        if (
          !msg.message
        ) return

        await handler(
          sock,
          msg
        )

      } catch (e) {

        console.log(e)
      }
    }
  )
}

await connectMongo()

startBot()