import fs from "fs"

export const menuHeader = (
  title,
  text
) => {

  const image =
    fs.readFileSync(
      "./media/menu.jpg"
    )

  return {

    text,

    contextInfo: {

      externalAdReply: {

        title,

        body:
          "Group chat invite",

        mediaType: 1,

        renderLargerThumbnail: true,

        showAdAttribution: false,

        sourceUrl:
"https://chat.whatsapp.com/JGzSqaT22sKFhA7GmRvOAX",

        thumbnail: image
      }
    }
  }
}