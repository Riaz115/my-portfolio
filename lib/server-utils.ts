import WebsiteSettings from '@/models/WebsiteSettings';
import connectDB from '@/lib/mongodb';

export async function getWebsiteSettings() {
  await connectDB();
  const settings = await WebsiteSettings.findOne();
  return settings ? settings.toObject() : null;
} 