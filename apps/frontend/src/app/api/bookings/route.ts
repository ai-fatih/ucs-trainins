import { NextResponse } from 'next/server';
import bookings from '@/data/bookings.json';

export async function GET() {
  return NextResponse.json(bookings);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newBooking = { id: `b${Date.now()}`, ...body, status: 'scheduled', createdAt: new Date().toISOString() };
  console.log('[Booking Created]', JSON.stringify(newBooking, null, 2));
  return NextResponse.json(newBooking, { status: 201 });
}
