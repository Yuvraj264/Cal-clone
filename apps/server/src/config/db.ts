import mongoose from 'mongoose';

export const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/calclone';
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB database cluster connected successfully.');
  } catch (error) {
    console.error('Failed to establish MongoDB database connection:', error);
    process.exit(1);
  }
};
