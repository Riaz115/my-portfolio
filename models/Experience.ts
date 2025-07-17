import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  current: {
    type: Boolean,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  technologies: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true
});

export default mongoose.models.Experience || mongoose.model('Experience', experienceSchema);