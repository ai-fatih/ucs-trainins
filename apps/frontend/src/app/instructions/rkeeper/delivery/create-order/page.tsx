import Link from 'next/link';

const steps = [
  {
    title: 'Авторизуйтесь в r_k Delivery',
    body: 'Откройте веб-интерфейс r_k Delivery и войдите в учётную запись заведения. Убедитесь, что у вас есть права на создание заказов.',
  },
  {
    title: 'Перейдите в раздел «Заказы»',
    body: 'В главном меню выберите «Заказы» → «Создать заказ». Откроется форма нового заказа.',
  },
  {
    title: 'Выберите гостя (или создайте нового)',
    body: (
      <ul className="list-disc pl-5 space-y-1 text-[#6b7280]">
        <li>Начните вводить имя или телефон гостя — система покажет совпадения.</li>
        <li>Если гость новый, нажмите «Создать гостя» и заполните контактные данные.</li>
        <li>Обязательно укажите номер телефона для связи.</li>
      </ul>
    ),
  },
  {
    title: 'Добавьте адрес доставки',
    body: 'Выберите адрес из сохранённых или создайте новый. Укажите улицу, дом, квартиру и комментарий для курьера (домофон, этаж, ориентиры).',
  },
  {
    title: 'Соберите заказ из меню',
    body: (
      <ul className="list-disc pl-5 space-y-1 text-[#6b7280]">
        <li>Выберите категорию блюд в левой панели.</li>
        <li>Кликните на позицию меню, чтобы добавить её в заказ.</li>
        <li>При необходимости измените количество, добавьте модификаторы (размер, соус и т.д.).</li>
        <li>Укажите комментарий к блюду (например, «без лука»).</li>
      </ul>
    ),
  },
  {
    title: 'Выберите способ оплаты',
    body: 'Укажите, как гость будет оплачивать: наличными курьеру, картой курьеру или онлайн. Если оплата онлайн — система сформирует ссылку для оплаты.',
  },
  {
    title: 'Назначьте курьера (опционально)',
    body: 'Если в заведении настроено автоматическое назначение, курьер будет назначен системой. При необходимости можно назначить курьера вручную.',
  },
  {
    title: 'Подтвердите заказ',
    body: 'Проверьте состав заказа, адрес и сумму. Нажмите «Подтвердить». Заказ отправится на кухню (KDS) и курьеру (CourierApp).',
  },
];

const errors = [
  {
    error: 'Гость не сохраняется — не указан телефон',
    reason: 'Номер телефона обязателен для создания гостя в системе доставки.',
    solution: 'Уточните у гостя номер телефона. Без него заказ не сможет быть обработан курьером.',
  },
  {
    error: 'Адрес доставки не найден на карте',
    reason: 'Введённый адрес отсутствует в базе геоданных.',
    solution: 'Уточните адрес у гостя. Если адрес корректен, попробуйте ввести его иначе (например, «ул. Ленина, д. 1» вместо «проспект Ленина, 1»).',
  },
  {
    error: 'Блюдо не добавляется в заказ',
    reason: 'Блюдо не опубликовано в меню доставки или закончился лимит на день.',
    solution: 'Проверьте статус блюда в разделе «Меню». Если блюдо отключено для доставки, предложите гостю альтернативу.',
  },
  {
    error: 'Заказ завис в статусе «Ожидание»',
    reason: 'Не настроена интеграция с кухней (KDS) или нет свободных курьеров.',
    solution: 'Проверьте подключение KDS. Если курьеров нет, свяжитесь с администратором или предупредите гостя об увеличении времени доставки.',
  },
  {
    error: 'Сумма заказа не совпадает с меню сайта',
    reason: 'Цены в r_k Delivery отличаются от цен на сайте из-за устаревшей синхронизации.',
    solution: 'Обновите меню в разделе «Интеграции» → «Синхронизация меню». Проверьте цены в обоих источниках.',
  },
];

export default function CreateOrderPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-[#6b7280] mb-3">
          <Link href="/instructions" className="text-[#1a56db] hover:underline no-underline">Инструкции</Link>
          <span>/</span>
          <Link href="/instructions/rkeeper/delivery" className="text-[#1a56db] hover:underline no-underline">Delivery</Link>
          <span>/</span>
          <span className="text-[#111827]">Создание заказа доставки</span>
        </div>
        <h1 className="text-3xl font-bold text-[#111827] mb-3">Создание заказа доставки</h1>
        <p className="text-[#6b7280] text-base leading-relaxed">
          Консультация: как создать заказ доставки в r_k Delivery — от выбора гостя до передачи заказа на кухню и курьеру.
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
          <Link href="/instructions/rkeeper/delivery" className="text-sm text-[#1a56db] hover:underline no-underline">
            &larr; Все инструкции Delivery
          </Link>
          <Link href="/instructions/rkeeper/delivery/courier-app" className="text-sm text-[#1a56db] hover:underline no-underline">
            CourierApp &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
