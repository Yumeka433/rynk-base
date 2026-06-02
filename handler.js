import "./config.js"
import fs from "fs"

import {
  Group,
  User,
  Feature
} from "./lib/database.js"

import emitter from "./lib/emitter.js"

// ======================== //
// LOGS
// ======================== //

global.logs = []

function addLog(text) {

  const log =
`[ ${new Date().toLocaleTimeString()} ]
${text}`

  global.logs.push(log)

  if (
    global.logs.length > 100
  ) {

    global.logs.shift()

  }

  console.log(log)

}

// ======================== //
// MIDDLEWARE
// ======================== //

async function loadMiddlewares() {

  global.middlewares = []

  const files =
    fs.readdirSync(
      "./middlewares"
    )

  for (const file of files) {

    try {

      const mod =
        await import(
          `./middlewares/${file}?v=${Date.now()}`
        )

      if (
        typeof mod.default !==
        "function"
      ) {

        console.log(
          `[ MIDDLEWARE ] ${file} invalid`
        )

        continue

      }

      global.middlewares.push(
        mod.default
      )

    }

    catch (e) {

      console.log(
        `[ MIDDLEWARE ] ${file}`
      )

      console.log(e)

    }

  }

}

// ======================== //
// PLUGIN REGISTRY
// ======================== //

const plugins = new Map()

global.registry =
  new Map()
  
function getFiles(dir) {

  let results = []

  const files =
    fs.readdirSync(dir)

  for (const file of files) {

    const path =
      `${dir}/${file}`

    const stat =
      fs.statSync(path)

    if (stat.isDirectory()) {

      results.push(
        ...getFiles(path)
      )

    }

    else if (
      file.endsWith(".js")
    ) {

      results.push(path)

    }

  }

  return results

}

// ======================== //
// LOAD PLUGINS
// ======================== //
async function loadPlugins() {

plugins.clear()
global.registry.clear()

const files =
  getFiles("./plugins")

for (const path of files) {

  try {

    const plugin =
      await import(
        `${path}?update=${Date.now()}`
      )

    const file =
      path.split("/").pop()

    const folder =
      path
      .replace("./plugins/", "")
      .split("/")
      .slice(0, -1)
      .join("/")

    const name =

      plugin.default?.name ||

      file.replace(
        ".js",
        ""
      )

    plugins.set(

      name,

      {

        ...plugin.default,

        file,
        folder

      }

    )

    global.registry.set(

      name,

      {

        command:
          plugin.default?.command,

        aliases:
          plugin.default?.aliases,

        tags:
          plugin.default?.tags,

        file,

        folder

      }

    )

  }

  catch (e) {

    addLog(`
[ ERROR PLUGIN ]

${path}

${e}
`)

  }

}

global.plugins =
plugins

addLog(
  `[ SYSTEM ] ${plugins.size} plugins loaded`
)
}

await loadPlugins()
await loadMiddlewares()

// ======================== //
// HOT RELOAD
// ======================== //

fs.watch(
  "./plugins",
  { recursive: true },

  async () => {

    addLog(
      "[ SYSTEM ] Reload plugins..."
    )

    await loadPlugins()
  }
)

fs.watch(
  "./middlewares",
  { recursive: true },

  async () => {

    addLog(
      "[ SYSTEM ] Reload middlewares..."
    )

    await loadMiddlewares()

  }
)

// ======================== //
// PARSE SENDER
// ======================== //

function parseSender(msg) {

  try {

    if (
      msg.key.participant
    ) {

      return String(
        msg.key.participant
      )

      .split(":")[0]
      .split("@")[0]
      .replace(/[^0-9]/g, "")
    }

    return String(
      msg.key.remoteJid
    )

    .split(":")[0]
    .split("@")[0]
    .replace(/[^0-9]/g, "")

  } catch {

    return ""
  }
}

// ======================== //
// HANDLER
// ======================== //

export default async function handler(
  sock,
  msg
) {

  try {

    if (!msg.message)
      return

    const from =
      msg.key.remoteJid

    const sender =
      parseSender(msg)

    const botNumber =
      String(
        sock.user?.id || ""
      )

      .split(":")[0]
      .split("@")[0]

    const isOwner =

      global.owner.includes(
        sender
      ) ||

      sender === botNumber ||

      msg.key.fromMe
      
    const isGroup = from.endsWith("@g.us")

    let isAdmin = false
    let isBotAdmin = false

    // self mode
    if (
      global.mode === "self" &&
      !isOwner
    ) return
    
    global.cooldowns =
    global.cooldowns || new Map()

    // ======================== //
    // BODY
    // ======================== //

    const body =

      msg.message
        ?.conversation ||

      msg.message
        ?.extendedTextMessage
        ?.text ||

      msg.message
        ?.imageMessage
        ?.caption ||

      msg.message
        ?.videoMessage
        ?.caption ||

      ""

    if (!body)
      return

    let command = ""
    let args = []

    // eval
    if (
      body.startsWith(">") &&
      isOwner
    ) {

      command = ">"

      args =
        body.slice(1)
        .trim()
        .split(/ +/)
    }

    // exec
    else if (
      body.startsWith("$") &&
      isOwner
    ) {

      command = "$"

      args =
        body.slice(1)
        .trim()
        .split(/ +/)
    }

    // normal
    else {

      const prefix =
        global.prefix.find(p =>
          body.startsWith(p)
        )

      // noprefix owner
      if (
        !prefix &&
        global.noPrefix &&
        isOwner
      ) {

        args =
          body.trim()
          .split(/ +/)

        command =
          args.shift()
          ?.toLowerCase() || ""
      }

      else if (prefix) {

        args =
          body.slice(prefix.length)
          .trim()
          .split(/ +/)

        command =
          args.shift()
          ?.toLowerCase() || ""
      }

      else return
    }

    if (!command)
      return

    // ======================== //
    // LOG
    // ======================== //

    addLog(`
[ MESSAGE ]

FROM : ${sender}
CMD  : ${command}
ARGS : ${args.join(" ")}
`)

// ======================== //
// GROUP METADATA
// ======================== //

if (isGroup) {

try {

const metadata =
  await sock.groupMetadata(
    from
  )

const me =
  sock.user.id
  .split(":")[0] +
  "@s.whatsapp.net"

const participant =
  metadata.participants.find(
    p =>
      p.id ===
      msg.key.participant
  )

const bot =
  metadata.participants.find(
    p =>
      p.id === me
  )

isAdmin =
  !!participant?.admin

isBotAdmin =
  !!bot?.admin

} catch {}

}

// ======================== //
// GROUP DATABASE
// ======================== //

let group = null

if (isGroup) {

group =
await Group.findOne({
jid: from
})

if (!group) {

group =
  await Group.create({
    jid: from
  })

}

}

// ======================== //
// USER DATABASE
// ======================== //

let user =
await User.findOne({
jid: sender
})

if (!user) {

user =
await User.create({
jid: sender
})

}

    const m = {

  sock,
  msg,

  from,
  sender,

  body,

  command,
  args,

  isOwner,

  isGroup,

  isAdmin,

  isBotAdmin,

  isPremium:

  Boolean(
    user?.premium &&
    user?.premiumExpired >
    Date.now()
  ),
  
  registry:
  global.registry,

plugins:
  global.plugins,

reply: async text => {


        return await sock.sendMessage(
          from,
          {
            text: String(text)
          },
          {
            quoted: msg
          }
        )
      }
    }
 
for (
  const middleware
  of global.middlewares
) {

  let nextCalled =
    false

  await middleware(

    m,

    () => {

      nextCalled =
        true

    }

  )

  if (!nextCalled)
    return

}

// ======================== //
// BEFORE HOOK
// ======================== //

for (

  const plugin

  of global.plugins.values()

) {

  if (!plugin.before)
    continue

  try {

    await plugin.execute(m)

  } catch (e) {

    addLog(`
[ ERROR BEFORE ]

PLUGIN :
${plugin.file}

ERROR :
${e}
`)

  }

}

// ======================== //
// EXECUTE PLUGIN
// ======================== //

for (
  const plugin
  of global.plugins.values()
) {

  if (!plugin.command)
    continue

  const matched =

    plugin.command?.includes(command)

    ||

    plugin.aliases?.includes(command)

  if (!matched)
    continue

  // plugin disabled
  if (

    group?.plugins?.[
      plugin.name
    ] === false

  ) {

    continue

  }

  const key =

    sender + ":" +

    (
      plugin.name ||
      plugin.command?.[0]
    )

  // cooldown
  const cooldown =

    global.cooldowns.get(
      key
    )

  if (

    cooldown &&

    cooldown > Date.now()

  ) {

    const left =

      Math.ceil(

        (
          cooldown -
          Date.now()
        )

        / 1000

      )

    return m.reply(
      `Tunggu ${left}s`
    )

  }

  // owner
  if (

    plugin.owner &&

    !isOwner

  ) {

    return m.reply(
      "Owner only"
    )

  }

  // group
  if (

    plugin.group &&

    !m.isGroup

  ) {

    return m.reply(
      "Group only"
    )

  }

  // admin
  if (

    plugin.admin &&

    !m.isAdmin

  ) {

    return m.reply(
      "Admin only"
    )

  }

  // bot admin
  if (

    plugin.botAdmin &&

    !m.isBotAdmin

  ) {

    return m.reply(
      "Bot harus admin"
    )

  }

  // premium
  if (

    plugin.premium &&

    !m.isPremium

  ) {

    return m.reply(
      "Premium only"
    )

  }

  try {

    emitter.emit(
      "command:run",
      plugin,
      m
    )

    let feature =

      await Feature.findOne({
        command
      })

    if (!feature) {

      feature =

        await Feature.create({
          command
        })

    }

    feature.total += 1

    await feature.save()

    await plugin.execute(m)

    // cooldown set
    if (
      plugin.cooldown
    ) {

      global.cooldowns.set(

        key,

        Date.now()

        +

        (
          plugin.cooldown *
          1000
        )

      )

    }

    emitter.emit(
      "command:success",
      plugin,
      m
    )

    break

  } catch (e) {

    emitter.emit(
      "command:error",
      plugin,
      m,
      e
    )

    addLog(`
[ ERROR EXECUTE ]

PLUGIN :
${plugin.file}

ERROR :
${e}
`)

    m.reply(
      String(e)
    )

  }

}

// ======================== //
// AFTER HOOK
// ======================== //

for (

  const plugin

  of global.plugins.values()

) {

  if (!plugin.after)
    continue

  try {

    await plugin.execute(m)

  } catch (e) {

    addLog(`
[ ERROR AFTER ]

PLUGIN :
${plugin.file}

ERROR :
${e}
`)

  }

}

} catch (e) {

  addLog(`
[ ERROR HANDLER ]

${e}
`)

}

}