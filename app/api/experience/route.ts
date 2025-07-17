import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Experience from '@/models/Experience';

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const { title, company, location, current, description, technologies } = await req.json();

    if (!title || !company || !location || typeof current !== 'boolean' || !description) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const experience = await Experience.create({ title, company, location, current, description, technologies });
    return NextResponse.json(experience, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create experience' }, { status: 500 });
  }
}

export async function GET() {
  await connectDB();
  const experiences = await Experience.find().sort({ createdAt: -1 });
  return NextResponse.json(experiences);
} 