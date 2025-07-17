import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: 'Project ID is required.' }, { status: 400 });
  }
  const project = await Project.findById(id).lean();
  if (!project) {
    return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
  }
  return NextResponse.json(project);
} 