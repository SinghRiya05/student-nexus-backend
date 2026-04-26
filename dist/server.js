"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.server = void 0;
const node_http_1 = __importDefault(require("node:http"));
const app_1 = __importDefault(require("./app"));
const env_1 = __importDefault(require("./core/env"));
const database_1 = __importDefault(require("./databases/database"));
const socket_init_1 = require("./sockets/socket.init");
const server = node_http_1.default.createServer(app_1.default);
exports.server = server;
// Initialize Socket.io
const io = (0, socket_init_1.setupSocket)(server);
exports.io = io;
app_1.default.set("io", io);
const startServer = async () => {
    try {
        await (0, database_1.default)();
        server.listen(env_1.default.PORT, () => {
            console.log(`Server is running on port: ${env_1.default.PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};
startServer();
