import Link from 'next/link';

const steps = [
  {
    title: 'Запустите приложение Event',
    body: 'Откройте приложение Event на кассовом ПК с установленным rk Cash Desk. При первом запуске приложение автоматически подключается к кассе.',
  },
  {
    title: 'Перейдите в раздел «Настройки»',
    body: 'В главном меню выберите «Настройки» → «Оповещения». Откроется список событий, для которых можно включить уведомления.',
  },
  {
    title: 'Выберите типы событий',
    body: (
      <ul className="list-disc pl-5 space-y-1 text-[#6b7280]">
        <li>Новая позиция в заказе (подача на кухню).</li>
        <li>Закрытие счёта и оплата.</li>
        <li>Оформление возврата по чеку.</li>
        <li>Новый заказ доставки (при активной интеграции Delivery).</li>
        <li>Ошибки кассы: отсутствие связи, закрытие смены, чековая лента.</li>
      </ul>
    ),
  },
  {
    title: 'Настройте канал оповещения',
    body: 'Для каждого события укажите способ оповещения: всплывающее окно на экране, звуковой сигнал или вывод на внешнее табло. Можно выбрать сразу несколько каналов.',
  },
  {
    title: 'Настройте звук и приоритет',
    body: 'Выберите звуковой файл для сигнала и количество повторов. Для критичных событий (ошибки кассы, возвраты) задайте повышенный приоритет, чтобы оповещение выделялось цветом.',
  },
  {
    title: 'Проверьте на тестовом событии',
    body: 'Создайте тестовое событие: откройте пробный заказ на кассе и добавьте позицию. Убедитесь, что оповещение появилось на экране, а звук воспроизвёлся.',
  },
  {
    title: 'Сохраните настройки',
    body: 'Нажмите «Сохранить». Настройки применяются сразу и действуют для всех рабочих мест, подключённых к кассе.',
  },
];

const errors = [
  {
    error: 'Оповещения не приходят',
    reason: 'Тип события отключён в настройках или приложение Event не подключено к кассе.',
    solution: 'Проверьте статус подключения в шапке Event (индикатор «Онлайн»). Убедитесь, что нужный тип события включён в «Настройки» → «Оповещения».',
  },
  {
    error: 'Звуковой сигнал не воспроизводится',
    reason: 'Для события выбран канал «Окно» без звука, либо звук отключён на устройстве.',
    solution: 'Добавьте канал «Звук» к событию и проверьте уровень громкости кассового ПК. Убедитесь, что выбрано рабочее аудиоустройство.',
  },
  {
    error: 'События дублируются',
    reason: 'Несколько копий Event подключены к одной кассе одновременно.',
    solution: 'Закройте лишние экземпляры приложения. К одной кассе должен быть подключён только один экземпляр Event.',
  },
  {
    error: 'После обновления настройки сбросились',
    reason: 'Файл конфигурации не сохранился при обновлении приложения.',
    solution: 'Повторно задайте настройки и нажмите «Сохранить». При необходимости скопируйте конфигурацию с другого рабочего места.',
  },
];

export default function EventNotificationsPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-[#6b7280] mb-3">
          <Link href="/docs" className="text-[#1a56db] hover:underline no-underline">Документация</Link>
          <span>/</span>
          <Link href="/docs/rkeeper/event" className="text-[#1a56db] hover:underline no-underline">Event</Link>
          <span>/</span>
          <span className="text-[#111827]">Настройка оповещений с кассы</span>
        </div>
        <h1 className="text-3xl font-bold text-[#111827] mb-3">Настройка оповещений с кассы</h1>
        <p className="text-[#6b7280] text-base leading-relaxed">
          Консультация: как настроить приложение Event — выбрать типы событий, каналы оповещения и проверить работу на тестовом событии.
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
          <Link href="/docs/rkeeper/event" className="text-sm text-[#1a56db] hover:underline no-underline">
            &larr; Все инструкции Event
          </Link>
          <Link href="/docs/rkeeper/event/event-screen" className="text-sm text-[#1a56db] hover:underline no-underline">
            Экран событий &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
