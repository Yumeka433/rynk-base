export default async function (
  m,
  next
) {

  if (

    global.mode === "self"

    &&

    !m.isOwner

  ) {

    return

  }

  next()

}