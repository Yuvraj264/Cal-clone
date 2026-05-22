import dotenv from 'dotenv';
import app from './app';
import { connectDB } from './config/db';

// Load env configurations
dotenv.config();

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  try {
    // 1. Initialize MongoDB connection pool
    await connectDB();

    // 2. Start API Listening
    app.listen(PORT, () => {
      console.log(`Express API Server listening on: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('[CRITICAL BOOTSTRAP FAILURE]:', error);
    process.exit(1);
  }
}

bootstrap();
