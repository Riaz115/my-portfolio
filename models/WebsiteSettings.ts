import mongoose from 'mongoose';

const websiteSettingsSchema = new mongoose.Schema({
  websiteName: {
    type: String,
    default: 'My Portfolio'
  },
  websiteDescription: {
    type: String,
    default: ''
  },
  logo: {
    type: String,
    default: ''
  },
  favicon: {
    type: String,
    default: ''
  },
  primaryColor: {
    type: String,
    default: '#3b82f6'
  },
  secondaryColor: {
    type: String,
    default: '#1e40af'
  },
  footerText: {
    type: String,
    default: '© 2024 All rights reserved'
  },
  socialLinks: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    facebook: { type: String, default: '' },
    youtube: { type: String, default: '' },
  },
  contactNumber: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  seo: {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    keywords: { type: String, default: '' }
  }
}, {
  timestamps: true
});

export default mongoose.models.WebsiteSettings || mongoose.model('WebsiteSettings', websiteSettingsSchema);