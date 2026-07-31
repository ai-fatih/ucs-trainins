import Link from 'next/link';

const steps = [
  {
    title: 'Подключите внешнее устройство',
    body: 'Подключите табло заказов или звуковое устройство к кассовому ПК через USB или локальную сеть. Используйте адаптер с совместимым блоком питания, если он идёт в комплекте.',
  },
  {
    title: 'Установите драйвер',
    body: 'Установите драйвер устройства. Для табло обычно используется драйвер под COM-порт или USB-адаптер. После установки перезагрузите кассовый ПК, если этого требует драйвер.',
  },
  {
    title: 'Укажите порт в Event',
    body: 'В приложении Event откройте «Настройки» → «Устройства» → «Добавить устройство». Выберите тип (табло или звук) и укажите порт, к которому подключено устройство.',
  },
  {
    title: 'Проверьте подключение',
    body: 'В списке устройств нажмите «Проверить». При успешном подключении у устройства появится статус «Готово». При ошибке — проверьте порт и драйвер.',
  },
  {
    title: 'Назначьте события на устройство',
    body: 'Перейдите в «Оповещения» и для нужных типов событий выберите вывод на подключённое устройство: например, вывод заказа на табло и звуковой сигнал при ошибке кассы.',
  },
  {
    title: 'Выполните тестовую проверку',
    body: 'Отправьте тестовое событие с кассы и убедитесь, что табло отобразило информацию, а звуковой сигнал воспроизвёлся. Проверьте работу нескольких событий подряд.',
  },
];

const errors = [
  {
    error: 'Устройство не определяется',
    reason: 'Не установлен драйвер или устройство подключено к неверному порту.',
    solution: 'Установите драйвер из комплекта поставки и проверьте порт в «Диспетчере устройств» Windows. В Event укажите тот же порт.',
  },
  {
    error: 'Табло показывает старые данные',
    reason: 'Табло не получило команду обновления от Event.',
    solution: 'Проверьте настройку порта и длину кабеля. Перезапустите Event и повторите тест — табло обновится после первого события.',
  },
  {
    error: 'Звук воспроизводится на системных колонках, а не на устройстве',
    reason: 'Для события выбран системный канал, а не внешнее звуковое устройство.',
    solution: 'В «Оповещениях» измените канал на внешнее устройство. Проверьте, что оно выбрано устройством вывода звука по умолчанию.',
  },
];

export default function EventDevicesPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-[#6b7280] mb-3">
          <Link href="/docs" className="text-[#1a56db] hover:underline no-underline">Документация</Link>
          <span>/</span>
          <Link href="/docs/rkeeper/event" className="text-[#1a56db] hover:underline no-underline">Event</Link>
          <span>/</span>
          <span className="text-[#111827]">Подключение внешних устройств</span>
        </div>
        <h1 className="text-3xl font-bold text-[#111827] mb-3">Подключение внешних устройств оповещений</h1>
        <p className="text-[#6b7280] text-base leading-relaxed">
          Консультация: как подключить к Event табло заказов и звуковые устройства, назначить на них события и проверить работу.
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
          <Link href="/docs/rkeeper/event/event-screen" className="text-sm text-[#1a56db] hover:underline no-underline">
            &larr; Экран событий
          </Link>
          <Link href="/docs/rkeeper/event" className="text-sm text-[#1a56db] hover:underline no-underline">
            Все инструкции Event &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
