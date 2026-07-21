import Link from 'next/link';

const steps = [
  {
    title: 'Откройте заказ для редактирования',
    body: 'В открытой смене найдите заказ, к которому нужно применить скидку или оформить возврат. Если заказ ещё не оплачен — откройте его из списка активных заказов.',
  },
  {
    title: 'Примените скидку на позицию',
    body: 'Выделите нужную позицию в чеке. Нажмите F4 (или кнопку «Скидка»). Введите процент скидки (например, 10 для 10%). Нажмите Enter — цена позиции пересчитается.',
  },
  {
    title: 'Примените скидку на весь чек',
    body: 'Не выделяя позиций, нажмите F4 (или кнопку «Скидка на чек»). Введите процент скидки на весь заказ. Система пропорционально распределит скидку между всеми позициями.',
  },
  {
    title: 'Оформите возврат позиции из открытого чека',
    body: 'Выделите позицию для возврата. Нажмите кнопку «Возврат» или выберите «Удалить позицию». Позиция удалится из чека — сумма пересчитается.',
  },
  {
    title: 'Оформите возврат из закрытого чека',
    body: (
      <ul className="list-disc pl-5 space-y-1 text-[#6b7280]">
        <li>Нажмите F10 → «Возвраты» (или «Операции с чеком»).</li>
        <li>Найдите закрытый чек по номеру, сумме или дате.</li>
        <li>Выберите позиции для возврата или верните чек полностью.</li>
        <li>Система создаст документ возврата и распечатает чек возврата.</li>
      </ul>
    ),
  },
  {
    title: 'Проверьте результат',
    body: 'Убедитесь, что скидка или возврат корректно отобразились в чеке. При возврате из закрытого чека — проверьте, что сумма возврата совпадает с ожиданиями гостя.',
  },
];

const errors = [
  {
    error: 'Не удаётся применить скидку — кнопка не активна',
    reason: 'Скидки отключены в настройках заведения или превышен лимит скидки для данного сотрудника.',
    solution: 'Проверьте настройки скидок в менеджерской станции. Если лимит превышен — запросите разрешение у администратора.',
  },
  {
    error: 'Возврат из закрытого чека недоступен',
    reason: 'Чек был закрыт в предыдущую смену, и смена уже закрыта.',
    solution: 'Возврат возможен только в пределах текущей смены. Для возврата из прошлой смены обратитесь к администратору.',
  },
  {
    error: 'Скидка применилась не на ту позицию',
    reason: 'Перед нажатием F4 не была выделена нужная позиция, и скидка применилась на весь чек.',
    solution: 'Отмените скидку (нажмите F4 → 0%) и примените её заново, предварительно выделив нужную позицию.',
  },
  {
    error: 'После возврата сумма чека стала отрицательной',
    reason: 'Сумма возврата превысила сумму чека.',
    solution: 'Возврат не может быть больше суммы чека. Проверьте количество позиций к возврату.',
  },
];

export default function DiscountsReturnsPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-[#6b7280] mb-3">
          <Link href="/instructions" className="text-[#1a56db] hover:underline no-underline">Инструкции</Link>
          <span>/</span>
          <Link href="/instructions/rkeeper/rk7" className="text-[#1a56db] hover:underline no-underline">r_keeper 7</Link>
          <span>/</span>
          <span className="text-[#111827]">Скидки и возвраты</span>
        </div>
        <h1 className="text-3xl font-bold text-[#111827] mb-3">Скидки и возвраты</h1>
        <p className="text-[#6b7280] text-base leading-relaxed">
          Консультация: как применить скидку на позицию или чек, оформить возврат из открытого и закрытого чека в r_keeper 7.
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
          <Link href="/instructions/rkeeper/rk7/shift-management" className="text-sm text-[#1a56db] hover:underline no-underline">&larr; Управление сменами</Link>
          <Link href="/instructions/rkeeper/rk7" className="text-sm text-[#1a56db] hover:underline no-underline">Все сценарии r_keeper 7 &rarr;</Link>
        </div>
      </div>
    </div>
  );
}
