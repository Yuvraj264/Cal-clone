"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
        console.error('[CRITICAL DATABASE FAILURE]: MONGO_URI environment variable is not defined.');
        process.exit(1);
    }
    try {
        mongoose_1.default.set('strictQuery', true);
        // Attempt database server hook
        const connectionInstance = await mongoose_1.default.connect(MONGO_URI);
        console.log(`[DATABASE SUCCESS]: Connected cleanly to MongoDB cluster host: ${connectionInstance.connection.host}`);
    }
    catch (error) {
        console.error(`[DATABASE ERROR]: Connection attempt failed: ${error.message}`);
        // Graceful process tear down on persistent failure
        process.exit(1);
    }
};
exports.connectDB = connectDB;
