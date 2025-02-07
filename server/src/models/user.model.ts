import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    img: {
      type: String
    }
  },
  { timestamps: true }
)

export default mongoose.model('User', userSchema)
