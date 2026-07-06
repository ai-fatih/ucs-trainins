import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { chatId, message } = body;

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.log('[Telegram Mock] Токен не настроен. Отправка пропущена.');
    console.log(`[Telegram Mock] chatId: ${chatId}, message: ${message}`);
    return NextResponse.json({ success: true, mock: true, note: 'TELEGRAM_BOT_TOKEN not set' });
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' }),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Telegram send error:', err);
    return NextResponse.json({ success: false, error: 'Failed to send' }, { status: 500 });
  }
}
