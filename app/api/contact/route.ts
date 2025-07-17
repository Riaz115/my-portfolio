import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Contact from '@/models/Contact';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const contact = new Contact({ name, email, subject, message });
    await contact.save();

    return NextResponse.json({ message: 'Contact message saved successfully.' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save contact message.' }, { status: 500 });
  }
} 