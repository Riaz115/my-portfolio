import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';

function getCloudinaryPublicId(url: string) {
  // Extracts public_id from a Cloudinary URL
  // Example: https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/filename.jpg
  const match = url.match(/portfolio\/([^./]+)\./);
  return match ? `portfolio/${match[1]}` : '';
}

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const skip = (page - 1) * limit;
  const total = await Project.countDocuments();
  const projects = await Project.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean();

  const hasMore = skip + projects.length < total;

  return NextResponse.json({ projects, hasMore });
}

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const technologies = formData.get('technologies') as string;
    const category = formData.get('category') as string;
    const demoUrl = formData.get('demoUrl') as string;
    const codeUrl = formData.get('codeUrl') as string;
    const featured = formData.get('featured') === 'true';
    const images = formData.getAll('images');

    if (!name || !description || !technologies || !category) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // Upload all images to Cloudinary and get their URLs
    const imageUrls: string[] = [];
    for (const img of images) {
      if (img instanceof File) {
        const arrayBuffer = await (img as File).arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString('base64');
        const dataUrl = `data:${(img as File).type};base64,${base64}`;
        const url = await uploadToCloudinary(dataUrl);
        imageUrls.push(url);
      }
    }

    const project = await Project.create({
      name,
      description,
      technologies: technologies.split(',').map(t => t.trim()),
      category,
      demoUrl,
      codeUrl,
      featured,
      images: imageUrls,
    });
    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create project' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  await connectDB();
  try {
    const formData = await req.formData();
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const technologies = formData.get('technologies') as string;
    const category = formData.get('category') as string;
    const demoUrl = formData.get('demoUrl') as string;
    const codeUrl = formData.get('codeUrl') as string;
    const featured = formData.get('featured') === 'true';
    const images = formData.getAll('images'); // new images (File or string)
    const oldImages = JSON.parse(formData.get('oldImages') as string || '[]'); // array of old image URLs

    if (!id || !name || !description || !technologies || !category) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // Find the project
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    // Delete images that were removed by the user
    const imagesToDelete = project.images.filter((url: string) => !oldImages.includes(url));
    for (const url of imagesToDelete) {
      const publicId = getCloudinaryPublicId(url);
      if (publicId) await deleteFromCloudinary(publicId);
    }

    // Upload new images (File type)
    const newImageUrls: string[] = [];
    for (const img of images) {
      if (img instanceof File) {
        const arrayBuffer = await (img as File).arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString('base64');
        const dataUrl = `data:${(img as File).type};base64,${base64}`;
        const url = await uploadToCloudinary(dataUrl);
        newImageUrls.push(url);
      }
    }
    // Combine kept old URLs and new uploads
    const finalImageUrls = [...oldImages, ...newImageUrls];

    // Update project
    project.name = name;
    project.description = description;
    project.technologies = technologies.split(',').map((t: string) => t.trim());
    project.category = category;
    project.demoUrl = demoUrl;
    project.codeUrl = codeUrl;
    project.featured = featured;
    project.images = finalImageUrls;
    await project.save();

    return NextResponse.json(project);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await connectDB();
  try {
    const { id } = await req.json();
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }
    // Delete all images from Cloudinary
    for (const url of project.images) {
      const publicId = getCloudinaryPublicId(url);
      if (publicId) await deleteFromCloudinary(publicId);
    }
    await project.deleteOne();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete project' }, { status: 500 });
  }
} 