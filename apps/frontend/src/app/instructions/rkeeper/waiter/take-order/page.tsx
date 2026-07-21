import Link from 'next/link';

const steps = [
  {
    title: 'Установите и откройте Waiter',
    body: 'Скачайте приложение r_k Waiter из Google Play или App Store. Установите и откройте его на смартфоне официанта.',
  },
  {
    title: 'Авторизуйтесь в приложении',
    body: 'Введите логин и пароль, выданные администратором. Выберите заведение (если их несколько). После входа вы попадёте на главный экран.',
  },
  {
    title: 'Выйдите на смену',
    body: 'На главном экране нажмите «Выйти на смену». Приложение синхронизируется с кассовым сервером и загрузит актуальное меню и план зала.',
  },
  {
    title: 'Выберите столик',
    body: 'На плане зала нажмите на свободный столик (обычно обозначен зелёным цветом). Откроется окно нового заказа для этого столика.',
  },
  {
    title: 'Добавьте блюда в заказ',
    body: (
      <ul className="list-disc pl-5 space-y-1 text-[#6b7280]">
        <li>Выберите категорию меню (например, «Салаты», «Горячее»).</li>
        <li>Кликните на блюдо — оно добавится в заказ.</li>
        <li>При необходимости укажите количество, модификаторы (размер, соус) и комментарий.</li>
        <li>Повторите для всех блюд, которые заказал гость.</li>
      </ul>
    ),
  },
  {
    title: 'Отправьте заказ на кухню',
    body: 'Проверьте состав заказа. Нажмите «Отправить заказ» (или «На кухню»). Заказ появится на экране KDS (кухонный дисплей) и начнёт готовиться.',
  },
  {
    title: 'При необходимости дополните заказ',
    body: 'Если гость хочет добавить блюда после отправки — откройте заказ, нажмите «Добавить позиции» и повторите шаг 5. Новые позиции отправятся на кухню отдельно.',
  },
];

const errors = [
  {
    error: 'Не удаётся авторизоваться',
    reason: 'Неверный логин или пароль, либо учётная запись не активирована.',
    solution: 'Проверьте правильность ввода данных. Если пароль забыт — обратитесь к администратору для сброса.',
  },
  {
    error: 'Не отображается план зала',
    reason: 'Нет синхронизации с кассовым сервером или не назначены столики для официанта.',
    solution: 'Проверьте подключение к Wi-Fi. Если интернет есть — перезапустите приложение. Если проблема осталась — обратитесь к администратору.',
  },
  {
    error: 'Блюдо не отображается в меню',
    reason: 'Блюдо отключено в меню на кассовом сервере или закончился лимит на день.',
    solution: 'Проверьте статус блюда через менеджерскую станцию. Сообщите гостю, что блюдо временно недоступно, и предложите альтернативу.',
  },
  {
    error: 'Заказ не отправляется на кухню',
    reason: 'Потеряна связь с сервером или ошибка синхронизации.',
    solution: 'Проверьте интернет-соединение. Если связь нестабильна — подойдите ближе к роутеру или повторите отправку позже.',
  },
];

export default function TakeOrderPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-[#6b7280] mb-3">
          <Link href="/instructions" className="text-[#1a56db] hover:underline no-underline">Инструкции</Link>
          <span>/</span>
          <Link href="/instructions/rkeeper/waiter" className="text-[#1a56db] hover:underline no-underline">Waiter & Cash Desk</Link>
          <span>/</span>
          <span className="text-[#111827]">Приём заказа через Waiter</span>
        </div>
        <h1 className="text-3xl font-bold text-[#111827] mb-3">Приём заказа через Waiter</h1>
        <p className="text-[#6b7280] text-base leading-relaxed">
          Консультация: как принять заказ у столика через мобильное приложение Waiter — от авторизации до отправки на кухню.
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
          <Link href="/instructions/rkeeper/waiter" className="text-sm text-[#1a56db] hover:underline no-underline">&larr; Все сценарии Waiter & Cash Desk</Link>
          <Link href="/instructions/rkeeper/waiter/payment" className="text-sm text-[#1a56db] hover:underline no-underline">Оплата счета через Cash Desk &rarr;</Link>
        </div>
      </div>
    </div>
  );
}
