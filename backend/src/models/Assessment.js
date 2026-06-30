// ===================================
// ASSESSMENT MODEL
// ===================================

import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const Assessment = sequelize.define('Assessment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  moduleId: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['fundamentals', 'strategy', 'identity', 'platforms', 'narrative', 'monetization']]
    },
    comment: 'Ej: fundamentals, strategy, identity, platforms, narrative, monetization'
  },
  status: {
    type: DataTypes.ENUM('in_progress', 'completed', 'abandoned'),
    defaultValue: 'in_progress'
  },
  startedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 100
    }
  },
  totalQuestions: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  answeredQuestions: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  analysis: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Análisis detallado de respuestas'
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
  tableName: 'assessments',
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['moduleId'] },
    { fields: ['status'] },
    { fields: ['createdAt'] }
  ]
});

export default Assessment;
