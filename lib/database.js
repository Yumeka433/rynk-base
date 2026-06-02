import mongoose from "mongoose"

export async function connectMongo() {

  try {

    await mongoose.connect(
      global.mongo
    )

    console.log(
      "[ DATABASE ] Connected"
    )

  } catch (e) {

    console.log(e)
  }
}

const groupSchema =
  new mongoose.Schema({

    jid: {
      type: String,
      required: true
    },

    welcome: {
      type: Boolean,
      default: false
    },

    plugins: {
      type: Object,
      default: {}
    }

  })
  

const userSchema =
  new mongoose.Schema({

    jid: {
      type: String,
      required: true
    },

    premium: {
      type: Boolean,
      default: false
    },

    premiumExpired: {
      type: Number,
      default: 0
    }

  })

const featureSchema =
  new mongoose.Schema({

    command: String,

    total: {
      type: Number,
      default: 0
    }
  })

export const Group =
  mongoose.model(
    "groups",
    groupSchema
  )
  
export const User =
  mongoose.model(
    "users",
    userSchema
  )

export const Feature =
  mongoose.model(
    "features",
    featureSchema
  )