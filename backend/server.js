/**
 * Server Entry Point
 * Connects to both databases (MongoDB and MySQL), then starts the Express server.
 */

import dotenv from 'dotenv';
import app from './src/app.js';
import { connectMongoDB, connectMySQL } from './src/config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

/**
 * Initialize databases and start the HTTP server.
 */
const startServer = async () => {
  try {
    // Connect to both databases in parallel
    await Promise.all([connectMongoDB(), connectMySQL()]);

    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📦 API Health: http://localhost:${PORT}/api/health`);
      console.log(`─────────────────────────────────────────────`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
