import mongoose from "mongoose";


export const connectDB = async () => {
    try {

        const connection = await mongoose.connect(process.env.MONGO_URI)
        const url = `${connection.connection.host}: ${connection.connection.port}`
        console.log(`MongoDB connected: ${url}`)
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}