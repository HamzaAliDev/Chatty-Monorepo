import mongoose from "mongoose";

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { dbName: process.env.DB_NAME, })
            .then(() => console.log("Database connected successfully"))

    } catch (error) {
        console.error("Database connection failed")
        console.log(error)
        process.exit(1)
    }
}

export default dbConnection;