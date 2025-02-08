import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    img: {
      type: String,
    },
  },
  { timestamps: true }
)

export default mongoose.model('User', userSchema)
