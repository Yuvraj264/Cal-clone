"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
// 1. Load system environmental profiles
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
async function startServer() {
    try {
        // 2. Establish MongoDB adapter pool
        await (0, db_1.connectDB)();
        // 3. Mount listening server socket
        app_1.default.listen(PORT, () => {
            console.log(`[SERVER SUCCESS]: Express API Server booting on port: http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error(`[SERVER CRITICAL ERROR]: Startup sequence aborted: ${error.message}`);
        process.exit(1);
    }
}
startServer();
