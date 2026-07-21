import Link from 'next/link';

const steps = [
  {
    title: 'Авторизуйтесь в колл-центре Delivery',
    body: 'Откройте веб-интерфейс r_k Delivery и войдите в раздел «Колл-центр». Убедитесь, что у вас есть права оператора колл-центра.',
  },
  {
    title: 'Просмотрите список заказов',
    body: 'На главном экране колл-центра отображаются все текущие заказы: новые, в обработке, переданные на кухню, переданные курьеру. Фильтруйте по статусу при необходимости.',
  },
  {
    title: 'Откройте карточку заказа',
    body: 'Кликните на заказ в списке — откроется карточка с деталями: состав заказа, адрес доставки, гость, способ оплаты, статус.',
  },
  {
    title: 'Скорректируйте заказ (если нужно)',
    body: (
      <ul className="list-disc pl-5 space-y-1 text-[#6b7280]">
        <li>Измените состав заказа (добавьте или удалите позиции).</li>
        <li>Скорректируйте адрес доставки или контактные данные гостя.</li>
        <li>Измените способ оплаты или сумму.</li>
      </ul>
    ),
  },
  {
    title: 'Назначьте курьера',
    body: 'Если автоматическое назначение не настроено — выберите доступного курьера из списка и назначьте его на заказ. Курьер получит уведомление в CourierApp.',
  },
  {
    title: 'Подтвердите и передайте заказ',
    body: 'После всех корректировок нажмите «Подтвердить». Заказ отправится на кухню (KDS) и курьеру. Статус изменится на «В работе».',
  },
];

const errors = [
  {
    error: 'Заказ не отображается в колл-центре',
    reason: 'Заказ был создан через сайт доставки и ещё не синхронизирован с r_k Delivery.',
    solution: 'Подождите несколько минут — синхронизация происходит автоматически. Если заказ не появился — проверьте настройки интеграции.',
  },
  {
    error: 'Не удаётся изменить состав заказа',
    reason: 'Заказ уже передан на кухню (KDS) и находится в статусе «Готовится».',
    solution: 'Изменение состава недоступно после передачи на кухню. Предложите гостю дополнительный заказ или отмените текущий и создайте новый.',
  },
  {
    error: 'Нет доступных курьеров для назначения',
    reason: 'Все курьеры заняты или не вышли на смену.',
    solution: 'Проверьте, вышли ли курьеры на смену в CourierApp. Если курьеров не хватает — увеличьте время доставки или свяжитесь с администратором.',
  },
  {
    error: 'Гость не найден в базе',
    reason: 'Номер телефона гостя отсутствует в системе или введён неверно.',
    solution: 'Уточните номер телефона у гостя. Если гость новый — создайте его карточку через «Создать гостя».',
  },
];

export default function CallCenterPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-[#6b7280] mb-3">
          <Link href="/instructions" className="text-[#1a56db] hover:underline no-underline">Инструкции</Link>
          <span>/</span>
          <Link href="/instructions/rkeeper/delivery" className="text-[#1a56db] hover:underline no-underline">Delivery</Link>
          <span>/</span>
          <span className="text-[#111827]">Приём заказа в колл-центре</span>
        </div>
        <h1 className="text-3xl font-bold text-[#111827] mb-3">Приём заказа в колл-центре</h1>
        <p className="text-[#6b7280] text-base leading-relaxed">
          Консультация: как работать с заказами в колл-центре r_k Delivery — просмотр, корректировка, назначение курьера.
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
          <Link href="/instructions/rkeeper/delivery/create-order" className="text-sm text-[#1a56db] hover:underline no-underline">&larr; Создание заказа доставки</Link>
          <Link href="/instructions/rkeeper/delivery/courier-app" className="text-sm text-[#1a56db] hover:underline no-underline">CourierApp &rarr;</Link>
        </div>
      </div>
    </div>
  );
}
