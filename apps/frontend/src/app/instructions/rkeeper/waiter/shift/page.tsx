import Link from 'next/link';

const steps = [
  {
    title: 'Откройте приложение Waiter',
    body: 'Запустите r_k Waiter на смартфоне. Убедитесь, что устройство подключено к интернету (Wi-Fi или мобильная сеть).',
  },
  {
    title: 'Авторизуйтесь',
    body: 'Введите логин и пароль сотрудника. Если авторизация не проходит — проверьте подключение к интернету и правильность ввода данных.',
  },
  {
    title: 'Выйдите на смену',
    body: 'На главном экране нажмите кнопку «Выйти на смену». Приложение синхронизируется с кассовым сервером — загрузит план зала, меню и текущие заказы.',
  },
  {
    title: 'Работайте в течение смены',
    body: 'Принимайте заказы, отправляйте их на кухню, оплачивайте счета через Cash Desk. Приложение автоматически синхронизирует данные с сервером.',
  },
  {
    title: 'Завершите смену',
    body: (
      <ul className="list-disc pl-5 space-y-1 text-[#6b7280]">
        <li>Убедитесь, что все заказы завершены или переданы другому сотруднику.</li>
        <li>Нажмите на профиль → «Закрыть смену».</li>
        <li>Подтвердите закрытие — приложение синхронизирует последние данные и выйдет из рабочего режима.</li>
      </ul>
    ),
  },
  {
    title: 'Выйдите из приложения',
    body: 'После закрытия смены нажмите «Выйти» для завершения сеанса. Это освободит лицензию для другого сотрудника.',
  },
];

const errors = [
  {
    error: 'Не удаётся выйти на смену',
    reason: 'Смена уже открыта на другом устройстве, или нет связи с сервером.',
    solution: 'Проверьте, не активна ли смена на другом телефоне. Если да — закройте её оттуда. Проверьте интернет-соединение.',
  },
  {
    error: 'Смена не закрывается — есть активные заказы',
    reason: 'На вас остались незавершённые заказы.',
    solution: 'Завершите или передайте все активные заказы другому сотруднику. После этого повторите закрытие смены.',
  },
  {
    error: 'Данные не синхронизируются',
    reason: 'Нестабильное интернет-соединение или проблемы с сервером.',
    solution: 'Проверьте подключение к сети. Перезапустите приложение. Если проблема остаётся — сообщите администратору.',
  },
  {
    error: 'Приложение зависло во время смены',
    reason: 'Недостаточно памяти на устройстве или ошибка приложения.',
    solution: 'Перезапустите приложение. Если не помогает — перезагрузите смартфон. После перезапуска смена восстановится автоматически.',
  },
];

export default function ShiftPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-[#6b7280] mb-3">
          <Link href="/instructions" className="text-[#1a56db] hover:underline no-underline">Инструкции</Link>
          <span>/</span>
          <Link href="/instructions/rkeeper/waiter" className="text-[#1a56db] hover:underline no-underline">Waiter & Cash Desk</Link>
          <span>/</span>
          <span className="text-[#111827]">Выход на смену и завершение</span>
        </div>
        <h1 className="text-3xl font-bold text-[#111827] mb-3">Выход на смену и завершение</h1>
        <p className="text-[#6b7280] text-base leading-relaxed">
          Консультация: как начать смену в приложении Waiter, синхронизировать данные и корректно завершить работу.
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
          <Link href="/instructions/rkeeper/waiter/payment" className="text-sm text-[#1a56db] hover:underline no-underline">&larr; Оплата счета через Cash Desk</Link>
          <Link href="/instructions/rkeeper/waiter" className="text-sm text-[#1a56db] hover:underline no-underline">Все сценарии Waiter & Cash Desk &rarr;</Link>
        </div>
      </div>
    </div>
  );
}
