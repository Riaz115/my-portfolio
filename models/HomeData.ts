import mongoose from 'mongoose';

const homeDataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  cvUrl: {
    type: String,
    default: ''
  },
  githubUrl: {
    type: String,
    default: ''
  },
  linkedinUrl: {
    type: String,
    default: ''
  },
  profileImage: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.models.HomeData || mongoose.model('HomeData', homeDataSchema);