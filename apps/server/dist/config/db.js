"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/calclone';
    try {
        mongoose_1.default.set('strictQuery', true);
        await mongoose_1.default.connect(MONGO_URI);
        console.log('MongoDB database cluster connected successfully.');
    }
    catch (error) {
        console.error('Failed to establish MongoDB database connection:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
