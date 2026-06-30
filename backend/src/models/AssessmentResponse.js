// ===================================
// ASSESSMENT RESPONSE MODEL
// ===================================

import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const AssessmentResponse = sequelize.define('AssessmentResponse', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  assessmentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'assessments',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  questionId: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Ej: q1, q2, q3'
  },
  selectedAnswer: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'ID de la opción seleccionada (a, b, c, d)'
  },
  isCorrect: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    comment: 'Si la respuesta es correcta (para scoring)'
  },
  confidence: {
    type: DataTypes.FLOAT,
    defaultValue: 0.5,
    validate: {
      min: 0,
      max: 1
    },
    comment: 'Confianza de la respuesta (0-1)'
  },
  timeSpent: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Tiempo en segundos en responder'
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
  tableName: 'assessment_responses',
  timestamps: true,
  indexes: [
    { fields: ['assessmentId'] },
    { fields: ['questionId'] },
    { fields: ['createdAt'] }
  ]
});

export default AssessmentResponse;
