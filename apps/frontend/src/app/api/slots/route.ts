import { NextResponse } from 'next/server';
import slots from '@/data/slots.json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  if (date && date in slots) {
    return NextResponse.json((slots as Record<string, any>)[date]);
  }
  return NextResponse.json([]);
}
