"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
// Load env configurations
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
async function bootstrap() {
    try {
        // 1. Initialize MongoDB connection pool
        await (0, db_1.connectDB)();
        // 2. Start API Listening
        app_1.default.listen(PORT, () => {
            console.log(`Express API Server listening on: http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error('[CRITICAL BOOTSTRAP FAILURE]:', error);
        process.exit(1);
    }
}
bootstrap();
