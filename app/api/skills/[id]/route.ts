import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Skill from '@/models/Skill';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    const { name, percentage, category, icon } = await req.json();
    const skill = await Skill.findByIdAndUpdate(
      params.id,
      { name, percentage, category, icon },
      { new: true }
    );
    if (!skill) {
      return NextResponse.json({ error: 'Skill not found.' }, { status: 404 });
    }
    return NextResponse.json(skill);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update skill' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    const skill = await Skill.findByIdAndDelete(params.id);
    if (!skill) {
      return NextResponse.json({ error: 'Skill not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete skill' }, { status: 500 });
  }
} 