import { EventEmitter } from "events"

const emitter =
  new EventEmitter()

emitter.setMaxListeners(
  999
)

export default emitter