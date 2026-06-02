export default {
 name:"connection",
 event:"connection.update",
 async run(sock,update){
  if(update.connection==="open") console.log("[EVENT] Connected")
 }
}
