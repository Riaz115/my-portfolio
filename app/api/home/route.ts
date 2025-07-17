import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import HomeData from '@/models/HomeData';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';

function getCloudinaryPublicId(url: string) {
  // Extracts public_id from a Cloudinary URL
  // Example: https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/filename.jpg
  const match = url.match(/portfolio\/([^./]+)\./);
  return match ? `portfolio/${match[1]}` : '';
}

export async function PUT(req: NextRequest) {
  await connectDB();
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const cvUrl = formData.get('cvUrl') as string;
    const githubUrl = formData.get('githubUrl') as string;
    const linkedinUrl = formData.get('linkedinUrl') as string;
    console.log('cvUrl:', cvUrl, 'githubUrl:', githubUrl, 'linkedinUrl:', linkedinUrl);
    const profileImageFile = formData.get('profileImage') as Blob | null;
    let profileImageUrl = undefined;
    let oldProfileImageUrl = formData.get('oldProfileImage') as string | undefined;
    if (profileImageFile && profileImageFile instanceof Blob) {
      // If a new image is uploaded, delete the old one from Cloudinary
      if (oldProfileImageUrl) {
        const publicId = getCloudinaryPublicId(oldProfileImageUrl);
        if (publicId) await deleteFromCloudinary(publicId);
      }
      const arrayBuffer = await profileImageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const mimeType = profileImageFile.type || 'image/jpeg';
      const base64 = buffer.toString('base64');
      const dataUrl = `data:${mimeType};base64,${base64}`;
      profileImageUrl = await uploadToCloudinary(dataUrl);
    }
    let homeData = await HomeData.findOne();
    if (!homeData) {
      homeData = new HomeData();
    }
    homeData.name = name;
    homeData.title = title;
    homeData.description = description;
    homeData.cvUrl = cvUrl || '';
    homeData.githubUrl = githubUrl || '';
    homeData.linkedinUrl = linkedinUrl || '';
    if (profileImageUrl) {
      homeData.profileImage = profileImageUrl;
    }
    await homeData.save();
    return NextResponse.json(homeData, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update home data' }, { status: 500 });
  }
}

export async function GET() {
  await connectDB();
  try {
    let homeData = await HomeData.findOne();
    if (!homeData) {
      homeData = {
        name: 'John Doe',
        title: 'Full Stack Developer',
        description: 'Passionate about building modern web apps.',
        cvUrl: '#',
        githubUrl: 'https://github.com/',
        linkedinUrl: 'https://linkedin.com/',
        profileImage: '',
      };
    }
    return NextResponse.json(homeData, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch home data' }, { status: 500 });
  }
} 