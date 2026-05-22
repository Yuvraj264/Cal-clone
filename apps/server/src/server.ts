import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app';

// Load environmental variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/calclone';

// Async Database Connection & Port listener
async function bootstrap() {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(MONGO_URI);
    console.log('Successfully connected to MongoDB database server.');

    app.listen(PORT, () => {
      console.log(`Express server running on port: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to establish database connection:', error);
    process.exit(1);
  }
}

bootstrap();
