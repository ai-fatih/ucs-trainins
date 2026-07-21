import Link from 'next/link';

const steps = [
  {
    title: 'Откройте заказ в Cash Desk',
    body: 'Запустите приложение Cash Desk на смартфоне. Авторизуйтесь и выберите заказ, который нужно оплатить. Заказ можно найти по номеру столика или имени гостя.',
  },
  {
    title: 'Проверьте состав заказа',
    body: 'Перед оплатой покажите гостю состав заказа и итоговую сумму в приложении. При необходимости можно изменить количество или добавить позиции.',
  },
  {
    title: 'Выберите способ оплаты',
    body: 'Нажмите «Оплатить». Выберите способ оплаты: <strong>Наличные</strong> или <strong>Карта</strong>. При необходимости можно разделить оплату между разными способами.',
  },
  {
    title: 'Примите оплату наличными',
    body: 'Введите сумму, полученную от гостя. Приложение рассчитает сдачу. После подтверждения чек будет отправлен на печать.',
  },
  {
    title: 'Примите оплату картой',
    body: 'Поднесите смартфон с включённым NFC к терминалу гостя (или используйте внешний терминал). После успешной транзакции приложение покажет подтверждение оплаты.',
  },
  {
    title: 'Завершите оплату',
    body: 'После успешной оплаты заказ закроется. Чек автоматически отправится на печать (если настроена печать). Гость может получить электронный чек по SMS или email.',
  },
];

const errors = [
  {
    error: 'Не удаётся открыть заказ для оплаты',
    reason: 'Заказ уже оплачен или закрыт. Либо заказ принадлежит другому официанту.',
    solution: 'Проверьте статус заказа. Если заказ принадлежит другому сотруднику, попросите его передать заказ вам.',
  },
  {
    error: 'Оплата картой не проходит',
    reason: 'NFC не включён на смартфоне, или терминал не поддерживает связь.',
    solution: 'Включите NFC в настройках телефона. Проверьте, поддерживает ли ваш смартфон бесконтактную оплату. Если не помогает — используйте наличные.',
  },
  {
    error: 'Чек не печатается после оплаты',
    reason: 'Нет связи с принтером или принтер отключён.',
    solution: 'Распечатайте чек повторно через меню «История заказов». Если принтер недоступен, сформируйте электронный чек.',
  },
  {
    error: 'Неверная сумма сдачи',
    reason: 'Ошибка при вводе полученной от гостя суммы.',
    solution: 'Отмените оплату и проведите её заново, внимательно введя полученную сумму.',
  },
];

export default function PaymentPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-[#6b7280] mb-3">
          <Link href="/instructions" className="text-[#1a56db] hover:underline no-underline">Инструкции</Link>
          <span>/</span>
          <Link href="/instructions/rkeeper/waiter" className="text-[#1a56db] hover:underline no-underline">Waiter & Cash Desk</Link>
          <span>/</span>
          <span className="text-[#111827]">Оплата счета через Cash Desk</span>
        </div>
        <h1 className="text-3xl font-bold text-[#111827] mb-3">Оплата счета через Cash Desk</h1>
        <p className="text-[#6b7280] text-base leading-relaxed">
          Консультация: как принять оплату наличными или картой у столика через мобильное приложение Cash Desk.
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
          <Link href="/instructions/rkeeper/waiter/take-order" className="text-sm text-[#1a56db] hover:underline no-underline">&larr; Приём заказа через Waiter</Link>
          <Link href="/instructions/rkeeper/waiter/shift" className="text-sm text-[#1a56db] hover:underline no-underline">Выход на смену &rarr;</Link>
        </div>
      </div>
    </div>
  );
}
