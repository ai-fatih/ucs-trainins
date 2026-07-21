import Link from 'next/link';

export default function EventPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-[#6b7280] mb-3">
          <Link href="/instructions" className="text-[#1a56db] hover:underline no-underline">Инструкции</Link>
          <span>/</span>
          <span className="text-[#111827]">Event</span>
        </div>
        <h1 className="text-3xl font-bold text-[#111827] mb-3">Event</h1>
        <p className="text-[#6b7280] text-base leading-relaxed">
          Приложение для уведомлений с кассы rk Cash Desk. Позволяет отслеживать события и оповещения в реальном времени.
        </p>
      </div>

      <div className="glass-card p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#9ca3af] to-[#b0b7c3] inline-flex items-center justify-center text-white text-xl font-bold mb-4">
          E
        </div>
        <h2 className="text-lg font-semibold text-[#111827] mb-2">Раздел готовится</h2>
        <p className="text-sm text-[#6b7280] mb-1">
          Сценарии работы с Event появятся после выхода продукта.
        </p>
        <p className="text-xs text-[#9ca3af]">
          Следите за обновлениями в документации r_keeper.
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-[#e5e7eb]">
        <Link href="/instructions" className="text-sm text-[#1a56db] hover:underline no-underline">
          &larr; Все инструкции
        </Link>
      </div>
    </div>
  );
}
