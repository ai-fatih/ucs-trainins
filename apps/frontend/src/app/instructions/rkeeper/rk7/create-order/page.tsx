import Link from 'next/link';

const steps = [
  {
    title: 'Откройте кассовое приложение',
    body: 'Запустите r_keeper 7 на кассовой станции. Дождитесь загрузки главного экрана.',
  },
  {
    title: 'Откройте смену',
    body: 'Нажмите F2 (или кнопку «Открыть смену» на панели). Если смена уже открыта — пропустите этот шаг.',
  },
  {
    title: 'Начните создание заказа',
    body: 'Нажмите кнопку «Новый заказ» или выберите свободный столик на плане зала. Система создаст новый чек.',
  },
  {
    title: 'Добавьте позиции в чек',
    body: (
      <ul className="list-disc pl-5 space-y-1 text-[#6b7280]">
        <li>Наберите код блюда на клавиатуре и нажмите Enter — позиция добавится в чек.</li>
        <li>Или выберите блюдо из меню на экране, кликнув по нему.</li>
        <li>При необходимости измените количество или добавьте модификаторы.</li>
      </ul>
    ),
  },
  {
    title: 'Примените скидку (если нужно)',
    body: 'Выделите позицию или весь чек, нажмите F4 и укажите процент скидки. Либо выберите готовую скидку из списка.',
  },
  {
    title: 'Оплатите заказ',
    body: (
      <ul className="list-disc pl-5 space-y-1 text-[#6b7280]">
        <li><strong>Наличные:</strong> Нажмите F10 → «Наличные» → введите полученную сумму — система рассчитает сдачу.</li>
        <li><strong>Карта:</strong> Нажмите F10 → «Карта» → проведите карту через терминал.</li>
        <li><strong>Смешанная оплата:</strong> Выберите «Разделить оплату» и укажите части.</li>
      </ul>
    ),
  },
  {
    title: 'Распечатайте чек',
    body: 'После успешной оплаты чек печатается автоматически. Если чек не напечатался — нажмите «Повтор печати чека».',
  },
];

const errors = [
  {
    error: 'Не открывается смена',
    reason: 'Смена уже была открыта на другом терминале, или нет прав на открытие смены.',
    solution: 'Проверьте статус смены через F2. Если смена открыта на другом терминале, закройте её оттуда. Если нет прав — обратитесь к администратору.',
  },
  {
    error: 'Позиция не добавляется в чек',
    reason: 'Блюдо не активно в меню, либо закончился лимит продаж.',
    solution: 'Проверьте статус блюда в менеджерской станции. Предложите гостю альтернативу.',
  },
  {
    error: 'Терминал не принимает оплату картой',
    reason: 'Потеряна связь с банковским терминалом или терминал не заряжен.',
    solution: 'Перезагрузите терминал, проверьте подключение. Если не помогает — используйте наличную оплату.',
  },
  {
    error: 'Чек не печатается',
    reason: 'Закончилась бумага в чековом принтере или нет связи с принтером.',
    solution: 'Замените бумагу в принтере. Проверьте подключение принтера к кассовой станции.',
  },
];

export default function CreateOrderPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-[#6b7280] mb-3">
          <Link href="/instructions" className="text-[#1a56db] hover:underline no-underline">Инструкции</Link>
          <span>/</span>
          <Link href="/instructions/rkeeper/rk7" className="text-[#1a56db] hover:underline no-underline">r_keeper 7</Link>
          <span>/</span>
          <span className="text-[#111827]">Создание и оплата заказа</span>
        </div>
        <h1 className="text-3xl font-bold text-[#111827] mb-3">Создание и оплата заказа</h1>
        <p className="text-[#6b7280] text-base leading-relaxed">
          Консультация: как открыть смену, создать заказ, добавить позиции и принять оплату наличными или картой в r_keeper 7.
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
          <Link href="/instructions/rkeeper/rk7" className="text-sm text-[#1a56db] hover:underline no-underline">&larr; Все сценарии r_keeper 7</Link>
          <Link href="/instructions/rkeeper/rk7/shift-management" className="text-sm text-[#1a56db] hover:underline no-underline">Управление сменами &rarr;</Link>
        </div>
      </div>
    </div>
  );
}
