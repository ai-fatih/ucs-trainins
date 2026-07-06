import { NextResponse } from 'next/server';

export async function POST() {
  // Mock: check upcoming bookings and send reminders
  const today = new Date().toISOString().slice(0, 10);
  console.log(`[Reminder] Checking bookings for ${today}...`);

  // In production: query DB for bookings where date = tomorrow
  // Send email + Telegram reminders

  return NextResponse.json({
    success: true,
    checked: today,
    remindersSent: 0,
    note: 'Mock endpoint — replace with real DB query',
  });
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    schedule: '0 6 * * *',
    description: 'Daily reminder for upcoming consultations',
  });
}
