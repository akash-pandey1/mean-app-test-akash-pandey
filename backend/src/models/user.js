/**
 * User Model (MySQL / Sequelize)
 * Represents a user account for authentication.
 * Fields: id (auto-increment), username (unique), password (hashed).
 */

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: {
        msg: 'Username already exists',
      },
      validate: {
        notEmpty: { msg: 'Username cannot be empty' },
        len: {
          args: [3, 100],
          msg: 'Username must be between 3 and 100 characters',
        },
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Password cannot be empty' },
      },
    },
  },
  {
    tableName: 'users',
    timestamps: true, // Adds createdAt and updatedAt
  }
);

export default User;
