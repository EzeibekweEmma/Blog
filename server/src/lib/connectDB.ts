import config from '@/config'
import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    await mongoose.connect(config.db.url!)
    console.log('MongoDB is connected')
  } catch (err) {
    console.log(err)
  }
}

export default connectDB
