import axios from "axios"

export async function ai(prompt) {

  try {

    const {
      data
    } = await axios.get(
      `https://text.pollinations.ai/${encodeURIComponent(prompt)}`
    )

    return {
      success: true,
      result: data
    }

  } catch (e) {

    return {
      success: false,
      error: String(e)
    }
  }
}