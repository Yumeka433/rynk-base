import fs from "fs"
export default async function loadEvents(){
 global.events=new Map()
 if(!fs.existsSync("./events")) return
 for(const file of fs.readdirSync("./events")){
  if(!file.endsWith(".js")) continue
  const mod=await import(`../events/${file}?v=${Date.now()}`)
  const ev=mod.default
  if(ev?.name) global.events.set(ev.name,ev)
 }
}
