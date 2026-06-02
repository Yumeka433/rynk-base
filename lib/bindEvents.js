import emitter from "./emitter.js"
export default function bindEvents(){
 for(const ev of global.events.values()){
  emitter.on(ev.event,(...args)=>ev.run(...args))
 }
}
