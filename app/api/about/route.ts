import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import About from '@/models/About';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';

export async function GET() {
  await dbConnect();
  const about = await About.findOne();
  return NextResponse.json(about || {});
}

export async function PUT(req: NextRequest) {
  await dbConnect();
  const formData = await req.formData();

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const details = formData.get('details') as string;
  const bulletPoints = formData.getAll('bulletPoints') as string[];
  let imageUrl = formData.get('image') as string;

  // Handle image upload if file is present
  const imageFile = formData.get('imageFile') as File | null;
  let about = await About.findOne();

  if (imageFile && typeof imageFile !== 'string') {
    // Delete old image from Cloudinary if exists
    if (about && about.image) {
      try {
        // Extract publicId from the old image URL
        const match = about.image.match(/portfolio\/([^./]+)\./);
        const publicId = match ? `portfolio/${match[1]}` : null;
        if (publicId) {
          await deleteFromCloudinary(publicId);
        }
      } catch (err) {
        // Ignore error, just log
        console.error('Failed to delete old Cloudinary image:', err);
      }
    }
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${imageFile.type};base64,${base64}`;
    imageUrl = await uploadToCloudinary(dataUrl);
  }

  if (!about) {
    about = new About();
  }
  about.title = title;
  about.description = description;
  about.details = details;
  about.bulletPoints = bulletPoints;
  about.image = imageUrl;
  await about.save();

  return NextResponse.json({ success: true, about });
} 