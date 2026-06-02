export default async function (
  m,
  next
) {

  global.middlewareCooldown ||= new Map()

  const key =
    m.sender

  const last =
    global.middlewareCooldown.get(
      key
    )

  if (

    last &&

    Date.now() - last < 1000

  ) {

    return

  }

  global.middlewareCooldown.set(

    key,

    Date.now()

  )

  next()

}