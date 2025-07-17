import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Experience from '@/models/Experience';
import User from '@/models/User';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

async function isAdmin(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token) return false;
  const decoded = verifyToken(token);
  if (!decoded) return false;
  const user = await User.findById(decoded.userId);
  return user && user.role === 'admin';
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  try {
    const { title, company, location, current, description, technologies } = await req.json();
    const experience = await Experience.findByIdAndUpdate(
      params.id,
      { title, company, location, current, description, technologies },
      { new: true }
    );
    if (!experience) {
      return NextResponse.json({ error: 'Experience not found.' }, { status: 404 });
    }
    return NextResponse.json(experience);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update experience' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  try {
    const experience = await Experience.findByIdAndDelete(params.id);
    if (!experience) {
      return NextResponse.json({ error: 'Experience not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete experience' }, { status: 500 });
  }
} 