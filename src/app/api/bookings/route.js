import { NextResponse } from 'next/server';
import { createBooking } from '@/lib/api/bookings';

export async function POST(req) {
  const { date } = await req.json();
  try {
    const booking = await createBooking({ date });
    return NextResponse.json({ success: true, booking });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 