import { NextResponse } from 'next/server';
import specialists from '@/data/specialists.json';

export async function GET() {
  return NextResponse.json(specialists);
}
