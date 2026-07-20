import Link from 'next/link';

const steps = [
  {
    title: 'Установите и откройте CourierApp',
    body: 'Скачайте приложение r_k CourierApp из Google Play или App Store. Установите и откройте его на мобильном устройстве.',
  },
  {
    title: 'Авторизуйтесь в приложении',
    body: 'Введите логин и пароль, выданные администратором. Если авторизация не проходит — проверьте подключение к интернету и правильность ввода данных.',
  },
  {
    title: 'Выйдите на смену',
    body: 'На главном экране нажмите «Выйти на смену». Приложение начнёт получать новые заказы. Статус сменится на «На смене».',
  },
  {
    title: 'Примите заказ',
    body: 'Когда поступит новый заказ, приложение оповестит звуком и вибрацией. Откройте заказ — ознакомьтесь с адресом, составом и суммой к оплате.',
  },
  {
    title: 'Возьмите заказ на кухне',
    body: 'Подойдите к зоне выдачи (KDS), убедитесь, что заказ готов, и нажмите «Взять заказ». Приложение начнёт отсчёт времени доставки.',
  },
  {
    title: 'Доставьте заказ гостю',
    body: 'Следуйте по маршруту до адреса доставки. В приложении доступна навигация по карте.',
  },
  {
    title: 'Завершите заказ',
    body: (
      <ul className="list-disc pl-5 space-y-1 text-[#6b7280]">
        <li>Передайте заказ гостю.</li>
        <li>Примите оплату, если она не была выполнена онлайн.</li>
        <li>В приложении нажмите «Завершить заказ».</li>
        <li>Если гость оплатил наличными — введите полученную сумму, приложение рассчитает сдачу.</li>
      </ul>
    ),
  },
  {
    title: 'Вернитесь на точку сбора',
    body: 'После завершения заказа приложение покажет следующий доступный заказ или предложит вернуться в ресторан для ожидания.',
  },
];

const errors = [
  {
    error: 'Не удаётся авторизоваться',
    reason: 'Неверный логин или пароль, либо учётная запись заблокирована.',
    solution: 'Проверьте правильность ввода данных. Если пароль забыт — обратитесь к администратору для сброса.',
  },
  {
    error: 'Не приходят уведомления о новых заказах',
    reason: 'Отключены push-уведомления на устройстве или слабый интернет.',
    solution: 'Проверьте настройки уведомлений в телефоне и в самом приложении. Убедитесь, что интернет-соединение стабильно.',
  },
  {
    error: 'Не получается завершить заказ',
    reason: 'Заказ уже был завершён другим курьером или изменился его статус в системе.',
    solution: 'Обновите список заказов (потяните вниз). Если статус не меняется, свяжитесь с колл-центром.',
  },
  {
    error: 'Навигация показывает неверный адрес',
    reason: 'Адрес доставки указан некорректно или карта не обновилась.',
    solution: 'Проверьте адрес в карточке заказа. Используйте внешнее навигационное приложение (Яндекс.Карты, Google Maps), скопировав адрес.',
  },
  {
    error: 'Не удаётся выйти на смену',
    reason: 'Смена уже открыта или устройство не прошло проверку геолокации.',
    solution: 'Проверьте, не активна ли смена на другом устройстве. Включите геолокацию на телефоне и повторите попытку.',
  },
];

export default function CourierAppPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-[#6b7280] mb-3">
          <Link href="/instructions" className="text-[#1a56db] hover:underline no-underline">Инструкции</Link>
          <span>/</span>
          <Link href="/instructions/rkeeper/delivery" className="text-[#1a56db] hover:underline no-underline">Delivery</Link>
          <span>/</span>
          <span className="text-[#111827]">CourierApp</span>
        </div>
        <h1 className="text-3xl font-bold text-[#111827] mb-3">CourierApp — приложение курьера</h1>
        <p className="text-[#6b7280] text-base leading-relaxed">
          Консультация: как работать в мобильном приложении курьера CourierApp — от выхода на смену до завершения доставки.
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
          <Link href="/instructions/rkeeper/delivery/create-order" className="text-sm text-[#1a56db] hover:underline no-underline">
            &larr; Создание заказа доставки
          </Link>
          <Link href="/instructions/rkeeper/delivery" className="text-sm text-[#1a56db] hover:underline no-underline">
            Все инструкции Delivery &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
