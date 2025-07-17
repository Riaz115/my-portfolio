import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  category: {
    type: String,
    required: true,
    enum: ['frontend', 'frontend-libraries', 'backend', 'database', 'tools', 'deployment', 'designing', 'social-media-marketing'],
  },
  icon: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.models.Skill || mongoose.model('Skill', skillSchema);