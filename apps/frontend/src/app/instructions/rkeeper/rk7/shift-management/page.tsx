import Link from 'next/link';

const steps = [
  {
    title: 'Откройте кассовое приложение',
    body: 'Запустите r_keeper 7 на кассовой станции. Убедитесь, что у вас есть права на работу со сменами.',
  },
  {
    title: 'Откройте смену (начало работы)',
    body: 'Нажмите F2 или выберите «Открыть смену» на панели инструментов. Система запросит подтверждение — нажмите «Да». После открытия смены касса готова к работе.',
  },
  {
    title: 'Снимите X-отчёт (промежуточный)',
    body: 'В процессе работы можно снять промежуточный отчёт без закрытия смены. Нажмите F2 → «X-отчёт». Отчёт покажет текущие обороты, но не обнулит смену.',
  },
  {
    title: 'Закройте смену (окончание работы)',
    body: 'В конце дня нажмите F2 → «Закрыть смену» (или «Z-отчёт»). Система предложит распечатать Z-отчёт — нажмите «Да». После закрытия смены касса перейдёт в режим ожидания.',
  },
  {
    title: 'Проверьте Z-отчёт',
    body: 'После закрытия смены проверьте: итоговая сумма, количество чеков, возвраты, скидки. Если данные не сходятся — сверьте с фактической выручкой.',
  },
  {
    title: 'Сдайте выручку',
    body: 'Фактическая выручка должна совпадать с итогом Z-отчёта. При расхождениях оформите акт инвентаризации кассы.',
  },
];

const errors = [
  {
    error: 'Не удаётся открыть смену — "Смена уже открыта"',
    reason: 'Смена была открыта на другом терминале и не закрыта.',
    solution: 'Закройте смену на терминале, где она была открыта. Если терминал недоступен, обратитесь к администратору для принудительного закрытия.',
  },
  {
    error: 'Z-отчёт не печатается',
    reason: 'Принтер не готов: нет бумаги, нет связи.',
    solution: 'Проверьте принтер. Если печать невозможна, сохраните отчёт в электронном виде и распечатайте позже.',
  },
  {
    error: 'Расход в Z-отчёте не совпадает с выручкой',
    reason: 'Ошибка при подсчёте наличных или не учтены возвраты.',
    solution: 'Проверьте все возвраты за смену. Пересчитайте наличные в кассе. При необходимости оформите акт расхождения.',
  },
  {
    error: 'Смена не закрывается — есть незавершённые заказы',
    reason: 'В системе есть открытые заказы, которые нужно закрыть или отложить.',
    solution: 'Закройте или отложите все открытые заказы. После этого повторите закрытие смены.',
  },
];

export default function ShiftManagementPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-[#6b7280] mb-3">
          <Link href="/instructions" className="text-[#1a56db] hover:underline no-underline">Инструкции</Link>
          <span>/</span>
          <Link href="/instructions/rkeeper/rk7" className="text-[#1a56db] hover:underline no-underline">r_keeper 7</Link>
          <span>/</span>
          <span className="text-[#111827]">Управление сменами</span>
        </div>
        <h1 className="text-3xl font-bold text-[#111827] mb-3">Управление сменами</h1>
        <p className="text-[#6b7280] text-base leading-relaxed">
          Консультация: как открыть и закрыть кассовую смену, снять X- и Z-отчёты, проверить выручку в r_keeper 7.
        </p>
      </div>

      <div className="glass-card p-6 mb-10">
        <h2 className="text-xl font-semibold text-[#111827] mb-6">Пошаговая инструкция</h2>
        <ol className="space-y-6">
          {steps.map((step, i) => (
            <li key={i} className="pl-2">
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#1a56db] to-[#0d9488] text-white flex items-center justify-center text-sm font-semibold">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-medium text-[#111827] mb-1">{step.title}</h3>
                  <div className="text-sm text-[#6b7280] leading-relaxed">{step.body}</div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-[#111827] mb-6">Типовые ошибки</h2>
        <div className="space-y-4">
          {errors.map((err, i) => (
            <div key={i} className="border border-[#e5e7eb] rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">!</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#111827] mb-1">{err.error}</p>
                  <p className="text-xs text-[#6b7280] mb-2">{err.reason}</p>
                  <p className="text-sm text-[#1a56db]">{err.solution}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-[#e5e7eb]">
        <h3 className="text-sm font-semibold text-[#6b7280] mb-2">Связанные инструкции</h3>
        <div className="flex flex-wrap gap-3">
          <Link href="/instructions/rkeeper/rk7/create-order" className="text-sm text-[#1a56db] hover:underline no-underline">&larr; Создание и оплата заказа</Link>
          <Link href="/instructions/rkeeper/rk7/discounts-returns" className="text-sm text-[#1a56db] hover:underline no-underline">Скидки и возвраты &rarr;</Link>
        </div>
      </div>
    </div>
  );
}
