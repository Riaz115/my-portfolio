import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: [String],
  demoUrl: {
    type: String,
    default: ''
  },
  codeUrl: {
    type: String,
    default: ''
  },
  technologies: [String],
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.models.Project || mongoose.model('Project', projectSchema);