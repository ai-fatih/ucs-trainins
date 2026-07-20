import Link from 'next/link';

const steps = [
  {
    title: 'Откройте раздел «Инвентаризация»',
    body: 'В приложении StoreHouse Pro перейдите в «Документы» → «Инвентаризация». Откроется журнал инвентаризаций.',
  },
  {
    title: 'Создайте новый документ',
    body: 'Нажмите «Создать». Система предложит заполнить параметры будущей инвентаризации.',
  },
  {
    title: 'Выберите склад и группу товаров',
    body: (
      <ul className="list-disc pl-5 space-y-1 text-[#6b7280]">
        <li><strong>Склад</strong> — укажите склад, на котором проводится инвентаризация.</li>
        <li><strong>Группа товаров</strong> — можно выбрать конкретную группу или оставить «Все товары».</li>
      </ul>
    ),
  },
  {
    title: 'Распечатайте инвентаризационную опись',
    body: 'Нажмите «Печать» — система сформирует опись товаров с колонками для внесения фактических остатков. Передайте опись сотрудникам для пересчёта.',
  },
  {
    title: 'Введите фактические остатки',
    body: 'После пересчёта внесите фактические количества в документ. Можно вводить вручную или через терминал сбора данных (ТСД).',
  },
  {
    title: 'Проверьте расхождения',
    body: 'Система автоматически рассчитает отклонения между учётными и фактическими остатками. Просмотрите строки с расхождениями — при необходимости перепроверьте товары.',
  },
  {
    title: 'Проведите инвентаризацию',
    body: 'Если расхождения корректны, нажмите «Провести». Система спишет недостачу и оприходует излишки в одном документе.',
  },
];

const errors = [
  {
    error: 'Документ не проводится — несоответствие итогов',
    reason: 'Сумма расхождений по документу превышает допустимый лимит, заданный в настройках.',
    solution: 'Проверьте введённые фактические остатки. Если данные верны, попросите администратора увеличить лимит расхождений.',
  },
  {
    error: 'Часть товаров не попала в опись',
    reason: 'Во время выбора группы товаров не были включены все необходимые позиции.',
    solution: 'Создайте новый документ инвентаризации и выберите «Все товары» или укажите несколько групп.',
  },
  {
    error: 'Не совпадают остатки после ТСД',
    reason: 'Данные не выгрузились с терминала сбора данных или выгрузились с ошибкой.',
    solution: 'Проверьте соединение ТСД с сервером. Выгрузите данные повторно. Если ошибка остаётся, используйте ручной ввод остатков.',
  },
  {
    error: 'Нулевые остатки по всем товарам',
    reason: 'На момент создания документа на складе не было остатков, либо выбран неверный склад.',
    solution: 'Проверьте выбранный склад и дату документа. Сформируйте отчёт «Остатки товаров» для проверки.',
  },
];

export default function InventoryPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-[#6b7280] mb-3">
          <Link href="/instructions" className="text-[#1a56db] hover:underline no-underline">Инструкции</Link>
          <span>/</span>
          <Link href="/instructions/rkeeper/storehouse" className="text-[#1a56db] hover:underline no-underline">StoreHouse Pro</Link>
          <span>/</span>
          <span className="text-[#111827]">Инвентаризация</span>
        </div>
        <h1 className="text-3xl font-bold text-[#111827] mb-3">Инвентаризация</h1>
        <p className="text-[#6b7280] text-base leading-relaxed">
          Консультация: как провести инвентаризацию на складе, внести фактические остатки и обработать расхождения в StoreHouse Pro.
        </p>
      </div>

      <div className="glass-card p-6 mb-10">
        <h2 className="text-xl font-semibold text-[#111827] mb-6">Пошаговая инструкция</h2>
        <ol className="space-y-6">
          {steps.map((step, i) => (
            <li key={i} className="pl-2">
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#1a56db] to-[#0d9488] text-white flex items-center justify-center text-sm font-semibold">
                  {i + 1}
                </span>
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
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">
                  !
                </span>
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
          <Link href="/instructions/rkeeper/storehouse/write-off" className="text-sm text-[#1a56db] hover:underline no-underline">
            &larr; Списание товаров
          </Link>
          <Link href="/instructions/rkeeper/storehouse/arrival" className="text-sm text-[#1a56db] hover:underline no-underline">
            Оприходование товаров &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
