// ===================================
// USER MODEL
// ===================================

import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    lowercase: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  profession: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Ej: Abogado, Coach, Médico, Emprendedor'
  },
  industry: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Ej: Legal, Wellness, Healthcare, Tech'
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  socialLinks: {
    type: DataTypes.JSON,
    defaultValue: {
      linkedin: null,
      twitter: null,
      instagram: null,
      github: null
    }
  },
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'URL a imagen de perfil'
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  subscriptionPlan: {
    type: DataTypes.ENUM('free', 'pro', 'business'),
    defaultValue: 'free'
  },
  subscriptionExpiry: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW
  }
}, {
  tableName: 'users',
  timestamps: true,
  indexes: [
    { fields: ['email'] },
    { fields: ['profession'] },
    { fields: ['createdAt'] }
  ]
});

export default User;
