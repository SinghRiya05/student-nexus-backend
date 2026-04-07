import http from "node:http";
import app from "./app";
import env from "./core/env";
import connectDB from "./databases/database";
import { setupSocket } from "./sockets/socket.init";

const server = http.createServer(app);

// Initialize Socket.io
const io = setupSocket(server);

const startServer = async () => {
    try {
        await connectDB();
        
        server.listen(env.PORT, () => {
            console.log(`Server is running on port: ${env.PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();

export { server, io };
