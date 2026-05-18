const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  department: {
    type: String,
    required: true,
    enum: ['Development', 'Design', 'Marketing', 'HR', 'Finance', 'Operations', 'Sales']
  },
  skills: {
    type: [String],
    validate: {
      validator: (arr) => arr.length > 0,
      message: 'At least one skill is required'
    }
  },
  performanceScore: {
    type: Number,
    required: true,
    min: [0, 'Score cannot be below 0'],
    max: [100, 'Score cannot exceed 100']
  },
  experience: { type: Number, required: true, min: 0 },
  aiRecommendation: { type: String, default: null },
  lastRecommendedAt: { type: Date, default: null }
}, { timestamps: true })

module.exports = mongoose.model('Employee', employeeSchema)
