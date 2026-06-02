export default async function (
  m,
  next
) {

  console.log(

    `[ CMD ] ${m.sender}`,

    m.command

  )

  next()

}