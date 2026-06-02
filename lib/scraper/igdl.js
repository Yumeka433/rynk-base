//SCRAPE BY RYNK
//FREE RECODE SOALNYA GAMPANG ERROR

import * as cheerio from "cheerio"

export async function igdl(url) {

  try {

    const reelCode =

      url
      .split("/")
      .filter(Boolean)
      .pop()

    const formData =
      new URLSearchParams({

        id: url,

        locale: "en",

        tt:
          "dfc19b02443d9143fb7d7717682bb983",

        ts:
          "1779435963",

        "cf-turnstile-response":
          ""

      })

    const response =
      await fetch(

        `https://reelsvideo.io/reel/${reelCode}/`,

        {

          method: "POST",

          headers: {

            "HX-Request":
              "true",
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36",

            Origin:
              "https://reelsvideo.io",

            Referer:
              "https://reelsvideo.io"

          },

          body:
            formData

        }

      )

    const html =
      await response.text()

    const $ =
      cheerio.load(html)

    const username =

      $(".text-400-16-18")

      .first()

      .text()

      .trim()

      ||

      null

    const thumbnail =

      $("[data-bg]")
      .attr("data-bg")

    const videos =

      $("a[href*='ssscdn.io/reelsvideo/']")

      .map((_, el) => ({

        url:
          $(el).attr("href"),

        quality:
          "HD"

      }))

      .get()

    return {

      success: true,

      data: {

        username,

        thumbnail,

        videos,

        videoUrl:

          videos[0]?.url ||

          null

      }

    }

  }

  catch (e) {

    return {

      success: false,

      error:
        e.message

    }

  }

}