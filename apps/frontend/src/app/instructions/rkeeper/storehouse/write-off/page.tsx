import Link from 'next/link';

const steps = [
  {
    title: 'Откройте приложение StoreHouse Pro',
    body: 'Запустите клиентское приложение StoreHouse Pro на рабочем месте. Дождитесь загрузки главного окна.',
  },
  {
    title: 'Перейдите в раздел документов',
    body: 'В главном меню выберите раздел «Документы», затем — «Списание товаров». Откроется список ранее созданных документов списания.',
  },
  {
    title: 'Создайте новый документ',
    body: 'Нажмите кнопку «Создать» в верхней панели. Система откроет форму нового документа списания.',
  },
  {
    title: 'Заполните шапку документа',
    body: 'Укажите склад, с которого списываются товары, и дату списания. Если дата не указана, подставится текущая.',
  },
  {
    title: 'Добавьте товары в табличную часть',
    body: (
      <ul className="list-disc pl-5 space-y-1 text-[#6b7280]">
        <li>Нажмите «Добавить» — откроется окно выбора товаров.</li>
        <li>Найдите нужный товар по артикулу, штрихкоду или названию.</li>
        <li>Выберите товар и укажите количество списания.</li>
        <li>При необходимости повторите для каждого товара.</li>
      </ul>
    ),
  },
  {
    title: 'Укажите причину списания',
    body: 'В поле «Причина списания» выберите подходящее значение из справочника: бой, порча, истечение срока годности, производственные потери и т.д.',
  },
  {
    title: 'Проверьте документ',
    body: 'Убедитесь, что все товары и количества указаны верно. При необходимости отредактируйте строки.',
  },
  {
    title: 'Проведите документ',
    body: 'Нажмите кнопку «Провести». Система проверит остатки и, если их достаточно, спишет товары со склада.',
  },
];

const errors = [
  {
    error: 'Недостаточно остатков на складе',
    reason: 'Количество товара к списанию превышает фактический остаток.',
    solution: 'Проверьте актуальные остатки через отчёт «Остатки товаров». При необходимости проведите инвентаризацию для корректировки.',
  },
  {
    error: 'Не удаётся найти товар в справочнике',
    reason: 'Товар отсутствует в номенклатуре или отфильтрован по складу.',
    solution: 'Проверьте, заведён ли товар в справочнике. Если товар есть, убедитесь, что он привязан к выбранному складу.',
  },
  {
    error: 'Документ не проводится — заблокирован период',
    reason: 'Дата документа попадает в закрытый (заблокированный) период.',
    solution: 'Измените дату документа на текущую или обратитесь к администратору для разблокировки периода.',
  },
  {
    error: 'После проведения остатки не изменились',
    reason: 'Документ не провёлся из-за ошибки целостности данных.',
    solution: 'Проверьте статус документа: если он остался в статусе «Черновик», повторите попытку. Если ошибка повторяется, обратитесь в отдел консультации.',
  },
];

export default function WriteOffPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-[#6b7280] mb-3">
          <Link href="/instructions" className="text-[#1a56db] hover:underline no-underline">Инструкции</Link>
          <span>/</span>
          <Link href="/instructions/rkeeper/storehouse" className="text-[#1a56db] hover:underline no-underline">StoreHouse Pro</Link>
          <span>/</span>
          <span className="text-[#111827]">Списание товаров</span>
        </div>
        <h1 className="text-3xl font-bold text-[#111827] mb-3">Списание товаров</h1>
        <p className="text-[#6b7280] text-base leading-relaxed">
          Консультация: как создать и провести документ списания товаров в StoreHouse Pro, какие причины списания бывают и что делать, если что-то пошло не так.
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
          <Link href="/instructions/rkeeper/storehouse/inventory" className="text-sm text-[#1a56db] hover:underline no-underline">
            &larr; Инвентаризация
          </Link>
          <Link href="/instructions/rkeeper/storehouse/arrival" className="text-sm text-[#1a56db] hover:underline no-underline">
            Оприходование товаров &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
