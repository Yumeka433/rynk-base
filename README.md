## Requirements 
- NodeJs V20+
- NPM

## Installation

- git clone https://github.com/Yumeka433/rynk-base.git
- cd rynk-base
- npm install
- npm start / node index.js

---

## Plugin Metadata

| Property | Type | Description |
|----------|------|-------------|
| name | String | Plugin name |
| command | Array | Commands |
| aliases | Array | Aliases |
| tags | Array | Menu category |
| cooldown | Number | Cooldown seconds |
| owner | Boolean | Owner only |
| premium | Boolean | Premium only |
| admin | Boolean | Group admin only |
| botAdmin | Boolean | Bot admin only |
| group | Boolean | Group only |
---

## Configuration

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

## Plugin Structure

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
