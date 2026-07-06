import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { to, subject, text } = body;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log('[Email Mock] RESEND_API_KEY не настроен. Отправка пропущена.');
    console.log(`[Email Mock] to: ${to}, subject: ${subject}`);
    return NextResponse.json({ success: true, mock: true, note: 'RESEND_API_KEY not set' });
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: 'noreply@ucs-service.vercel.app', to, subject, text }),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Email send error:', err);
    return NextResponse.json({ success: false, error: 'Failed to send' }, { status: 500 });
  }
}
