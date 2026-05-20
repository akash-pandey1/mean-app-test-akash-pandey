/**
 * Database Configuration
 * Establishes connections to both MongoDB (Mongoose) and MySQL (Sequelize).
 * Each database is used for a distinct domain:
 *   - MongoDB: Products, Orders
 *   - MySQL: User Authentication
 */

import mongoose from 'mongoose';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// ── MongoDB Connection (Mongoose) ────────────────────────────────────────────
const connectMongoDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Mongoose 8+ uses these defaults, but explicit for clarity
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// ── MySQL Connection (Sequelize) ─────────────────────────────────────────────
const sequelize = new Sequelize(
  process.env.MYSQL_DB,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT, 10) || 3306,
    dialect: 'mysql',
    logging: false, // Set to console.log for debugging SQL queries
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const connectMySQL = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL Connected successfully');
    // Sync all defined models to the DB (creates tables if not exist)
    await sequelize.sync({ alter: true });
    console.log('✅ MySQL tables synced');
  } catch (error) {
    console.error(`❌ MySQL Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export { connectMongoDB, connectMySQL, sequelize };
