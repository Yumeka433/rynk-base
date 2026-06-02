import {
menuHeader
} from "../../lib/menuHeader.js"

import {
Feature
} from "../../lib/database.js"

export default {

name: "menu",

command: ["menu"],

aliases: ["help"],

async execute(m) {

const categories = {}

for (
  const plugin of
  global.plugins.values()
) {

  let category =

    plugin.tags?.[0]

    ||

    plugin.folder

    ||

    "other"

  if (
    plugin.owner
  ) {

    category =
      "owner"

  }

  if (
    !categories[
      category
    ]
  ) {

    categories[
      category
    ] = []

  }

  categories[
    category
  ].push(plugin)

}

const topFeature =

  await Feature.find()

  .sort({
    total: -1
  })

  .limit(3)


let text =

`─────〔 BOT INFO 〕─────◆

┆ Bot : ${global.botname}
┆ Version : 1.0
┆ Mode : ${global.mode}
┆ Prefix : ${global.prefix[0]}
┆ Plugins : ${global.plugins.size}

╰──────────────◆

─────〔 TOP FEATURE 〕─────◆
`

for (
  const feature of
  topFeature
) {

text +=
`┆ ${feature.command} (${feature.total})
`
}

text +=

`
╰──────────────◆

─────〔 CATEGORY 〕─────◆
`


for (
  const category in
  categories
) {

  text +=

`┆ ${category}menu
`
}

text +=

"╰──────────────◆"

await m.sock.sendMessage(

  m.from,

  menuHeader(
    "ALL MENU",
    text
  ),

  {
    quoted:
      m.msg
  }

)

}

}