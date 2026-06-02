WhatsApp Bot Framework

Framework WhatsApp Bot berbasis Baileys dengan sistem plugin modular, middleware, registry, cooldown, premium, dan MongoDB.

Features

- Plugin System
- Recursive Plugin Loader
- Middleware System
- EventEmitter
- MongoDB Database
- Cooldown System
- Premium System
- Plugin Enable / Disable
- Auto Menu Generator
- Hot Reload Plugin
- Hot Reload Middleware
- Feature Counter
- Owner Commands
- Group Settings

---

Installation

git clone [<repository>](https://github.com/Yumeka433/rynk-base.git)
cd bot

npm install
npm start


---

Configuration

Edit file:

config.js

Example:

global.owner = [
  "628xxxxxxxxxx"
]

global.botname =
  "My Bot"

global.prefix = [
  ".",
  "!"
]

global.mode =
  "public"

global.mongo =
  "mongodb://localhost:27017/bot"

---

Folder Structure

.
├── plugins
│   ├── main
│   ├── ai
│   ├── tools
│   ├── download
│   ├── group
│   └── owner
│
├── middlewares
│
├── lib
│   ├── database.js
│   ├── emitter.js
│   ├── menuHeader.js
│   └── scraper
│
├── session
│
├── config.js
├── handler.js
├── index.js
└── package.json

---

Plugin Structure

Example:

export default {

  name: "ping",

  command: [
    "ping"
  ],

  aliases: [
    "p"
  ],

  tags: [
    "tools"
  ],

  cooldown: 3,

  owner: false,

  premium: false,

  async execute(m) {

    await m.reply(
      "Pong"
    )

  }

}

---

Plugin Metadata

Property| Type| Description
name| String| Plugin name
command| Array| Commands
aliases| Array| Aliases
tags| Array| Menu category
cooldown| Number| Cooldown seconds
owner| Boolean| Owner only
premium| Boolean| Premium only
admin| Boolean| Group admin only
botAdmin| Boolean| Bot admin only
group| Boolean| Group only

---

Middleware

Example:

export default async (
  m,
  next
) => {

  console.log(
    m.command
  )

  next()

}

Folder:

middlewares/

---

Categories

Use tags:

tags: ["main"]
tags: ["tools"]
tags: ["download"]
tags: ["group"]
tags: ["ai"]

Owner plugins:

owner: true

---

Premium Plugin

export default {

  name: "premium",

  command: ["premium"],

  premium: true,

  async execute(m) {

    m.reply(
      "Premium Feature"
    )

  }

}

---

Downloader Example

Instagram:

plugins/download/instagram.js

TikTok:

plugins/download/tiktok.js

YouTube:

plugins/download/ytmp3.js

---

Owner Commands

.reload
.listplugin
.addprem
.delprem
.enable
.disable

---

Menu System

Auto menu generated from plugin metadata.

Example:

tags: ["ai"]

Will automatically appear in:

aimenu

---

Database

Collections:

Users

{
  jid: String,
  premium: Boolean,
  premiumExpired: Number
}

Groups

{
  jid: String,
  welcome: Boolean,
  plugins: Object
}

Features

{
  command: String,
  total: Number
}
