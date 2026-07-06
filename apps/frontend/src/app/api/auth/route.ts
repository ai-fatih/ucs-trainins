import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { type, contractNumber } = body;

  await new Promise((r) => setTimeout(r, 200));

  if (type === 'company') {
    if (contractNumber === 'Д-2025-0891') {
      return NextResponse.json({
        success: true,
        user: { id: 'comp1', name: 'ООО «Ресторанъ»', inn: '7701234567', contractStatus: 'active', contractValidUntil: '31.12.2026' },
        employees: [
          { id: 'e1', name: 'Анна Смирнова', position: 'Управляющая', email: 'a.smirnova@restoran.ru' },
          { id: 'e2', name: 'Павел Иванов', position: 'Шеф-повар', email: 'p.ivanov@restoran.ru' },
          { id: 'e3', name: 'Елена Козлова', position: 'Бухгалтер', email: 'e.kozlova@restoran.ru' },
        ],
      });
    }
    return NextResponse.json({ success: false, error: 'Договор не найден' }, { status: 404 });
  }

  return NextResponse.json({ success: true, user: { id: 'ind1', name: 'Иван Петров', email: body.email } });
}

export async function OPTIONS() {
  return NextResponse.json({});
}
