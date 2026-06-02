import {
menuHeader
} from "../../lib/menuHeader.js"

export default {

name: "category",

command: [

"mainmenu",
"toolsmenu",
"downloadmenu",
"aimenu",
"groupmenu",
"ownermenu"

],

tags: ["main"],

async execute(m) {

const name =

  m.command
  .replace("menu", "")


const plugins =

  [...global.plugins.values()]

  .filter(v => {

    if (name === "owner") {

      return v.owner

    }

    return (

      (
        v.tags?.[0]

        ||

        v.folder

      ) === name

      &&

      !v.owner

    )

  })

if (!plugins.length) {

  return m.reply(
    "Menu kosong"
  )

}
  
let text =

`─────〔 ${name.toUpperCase()} MENU 〕─────◆

`

for (const plugin of plugins) {

  if (!plugin.command)
    continue

  text +=

"┆ ${plugin.command[0]} "

}

text +=

"╰──────────────◆"

await m.sock.sendMessage(

  m.from,

  menuHeader(
    `${name.toUpperCase()} MENU`,
    text
  ),

  {
    quoted:
      m.msg
  }

)

}

}