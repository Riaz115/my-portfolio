import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import dbConnect from '@/lib/mongodb';
import Contact from '@/models/Contact';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { id, email, message } = await req.json();
    if (!id || !email || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }
    const contact = await Contact.findById(id);
    if (!contact) {
      return NextResponse.json({ error: 'Contact not found.' }, { status: 404 });
    }
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: contact.email,
      replyTo: email,
      subject: 'Reply to your contact message',
      text: message,
    });
    contact.status = 'replied';
    await contact.save();
    return NextResponse.json({ message: 'Reply sent successfully.' });
  } catch (error) {
    console.error('Reply error:', error);
    return NextResponse.json({ error: error || 'Failed to send reply.' }, { status: 500 });
  }
} 