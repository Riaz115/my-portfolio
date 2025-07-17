import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Skill from '@/models/Skill';

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const { name, percentage, category, icon } = await req.json();

    if (!name || percentage === undefined || !category) {
      return NextResponse.json({ error: 'Name, percentage, and category are required.' }, { status: 400 });
    }

    const skill = await Skill.create({ name, percentage, category, icon });
    return NextResponse.json(skill, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create skill' }, { status: 500 });
  }
}

export async function GET() {
  await connectDB();
  const skills = await Skill.find();
  return NextResponse.json(skills);
} 