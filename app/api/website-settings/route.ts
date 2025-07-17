import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import WebsiteSettings from '@/models/WebsiteSettings';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function GET() {
  await connectDB();
  let settings = await WebsiteSettings.findOne();
  if (!settings) {
    settings = await WebsiteSettings.create({});
  }
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  await connectDB();
  try {
    const formData = await req.formData();
    let settings = await WebsiteSettings.findOne();
    if (!settings) {
      settings = new WebsiteSettings();
    }
    settings.websiteName = formData.get('websiteName') || settings.websiteName;
    settings.websiteDescription = formData.get('websiteDescription') || settings.websiteDescription;
    settings.primaryColor = formData.get('primaryColor') || settings.primaryColor;
    settings.secondaryColor = formData.get('secondaryColor') || settings.secondaryColor;
    settings.email = formData.get('email') || settings.email;
    settings.contactNumber = formData.get('phone') || settings.contactNumber;
    settings.address = formData.get('address') || settings.address;
    settings.footerText = formData.get('footerText') || settings.footerText;
    // Social Links
    const socialLinks = formData.get('socialLinks');
    if (socialLinks) {
      try {
        const parsedLinks = JSON.parse(socialLinks as string);
        settings.socialLinks = {
          ...settings.socialLinks,
          ...parsedLinks
        };
      } catch {}
    }
    // SEO
    const seo = formData.get('seo');
    if (seo) {
      try {
        settings.seo = JSON.parse(seo as string);
      } catch {}
    }
    // Logo
    const logoFile = formData.get('logo');
    if (logoFile && typeof logoFile !== 'string') {
      const arrayBuffer = await (logoFile as File).arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');
      const dataUrl = `data:${(logoFile as File).type};base64,${base64}`;
      const logoUrl = await uploadToCloudinary(dataUrl);
      settings.logo = logoUrl;
    }
    // Favicon
    const faviconFile = formData.get('favicon');
    if (faviconFile && typeof faviconFile !== 'string') {
      const arrayBuffer = await (faviconFile as File).arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');
      const dataUrl = `data:${(faviconFile as File).type};base64,${base64}`;
      const faviconUrl = await uploadToCloudinary(dataUrl);
      settings.favicon = faviconUrl;
    }
    await settings.save();
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update website settings' }, { status: 500 });
  }
} 