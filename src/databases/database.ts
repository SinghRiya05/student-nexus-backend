import mongoose from "mongoose";
import env from "../core/env";

const connectDB = async () : Promise<void> => {
    try {
        mongoose.set("strictQuery", true);

        const conn = await mongoose.connect(env.DB_URL, {
            minPoolSize: env.DB_POOL_MIN,
            maxPoolSize: env.DB_POOL_MAX,
            serverSelectionTimeoutMS: env.SERVER_SELECTION_TIMEOUT_MS,
            socketTimeoutMS: env.SOCKET_TIMEOUT_MS
        });

        console.log(`✅ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`)
        
    } catch (error) {
        console.log("❌ MongoDB connection failed");
        console.error(error);
        process.exit(1);
    }
}

export default connectDB;