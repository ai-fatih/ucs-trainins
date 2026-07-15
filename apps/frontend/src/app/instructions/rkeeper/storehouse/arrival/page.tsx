import Link from 'next/link';

const steps = [
  {
    title: 'Перейдите в раздел «Оприходование товаров»',
    body: 'В приложении StoreHouse Pro откройте «Документы» → «Оприходование товаров». Здесь отображаются все поступления товаров.',
  },
  {
    title: 'Создайте новый документ поступления',
    body: 'Нажмите кнопку «Создать». Откроется форма документа оприходования.',
  },
  {
    title: 'Заполните шапку документа',
    body: (
      <ul className="list-disc pl-5 space-y-1 text-[#6b7280]">
        <li><strong>Склад</strong> — выберите склад, на который поступают товары.</li>
        <li><strong>Поставщик</strong> — укажите контрагента из справочника.</li>
        <li><strong>Дата</strong> — дата фактического поступления.</li>
        <li><strong>Номер накладной</strong> — номер документа поставщика (необязательно).</li>
      </ul>
    ),
  },
  {
    title: 'Добавьте товары в документ',
    body: (
      <ul className="list-disc pl-5 space-y-1 text-[#6b7280]">
        <li>Нажмите «Добавить» и выберите товары из справочника номенклатуры.</li>
        <li>Для каждого товара укажите <strong>количество</strong> и <strong>цену</strong> поступления.</li>
        <li>Если товара нет в справочнике — сначала заведите его через раздел «Номенклатура».</li>
      </ul>
    ),
  },
  {
    title: 'Проверьте итоговые суммы',
    body: 'Система автоматически рассчитает общую сумму поступления. Сверьте её с накладной поставщика.',
  },
  {
    title: 'Проведите документ',
    body: 'Нажмите «Провести». Товары поступят на склад, и остатки увеличатся на указанное количество.',
  },
];

const errors = [
  {
    error: 'Товар не добавляется — нет цены в справочнике',
    reason: 'Для товара не задана учётная цена в карточке номенклатуры.',
    solution: 'Откройте карточку товара и укажите цену поступления. Если товар поступает по разным ценам, можно ввести цену прямо в документе.',
  },
  {
    error: 'Неверно рассчитана сумма документа',
    reason: 'В одной из строк документа указана некорректная цена или количество.',
    solution: 'Проверьте каждую строку документа. Убедитесь, что цена и количество указаны верно.',
  },
  {
    error: 'Поставщика нет в справочнике',
    reason: 'Контрагент не заведён в системе.',
    solution: 'Перейдите в «Справочники» → «Контрагенты» и добавьте нового поставщика, после чего вернитесь к документу и выберите его.',
  },
  {
    error: 'Документ провёлся, но остатки не изменились',
    reason: 'Вероятно, товар был оприходован на склад, не совпадающий с тем, где ожидалось увидеть изменение.',
    solution: 'Проверьте, какой склад указан в документе. При необходимости создайте документ перемещения между складами.',
  },
];

export default function ArrivalPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-[#6b7280] mb-3">
          <Link href="/instructions" className="text-[#1a56db] hover:underline no-underline">Инструкции</Link>
          <span>/</span>
          <Link href="/instructions/rkeeper/storehouse" className="text-[#1a56db] hover:underline no-underline">StoreHouse Pro</Link>
          <span>/</span>
          <span className="text-[#111827]">Оприходование товаров</span>
        </div>
        <h1 className="text-3xl font-bold text-[#111827] mb-3">Оприходование товаров</h1>
        <p className="text-[#6b7280] text-base leading-relaxed">
          Консультация: как оформить поступление товаров на склад, добавить номенклатуру и провести документ в StoreHouse Pro.
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
          <Link href="/instructions/rkeeper/storehouse/write-off" className="text-sm text-[#1a56db] hover:underline no-underline">
            Списание товаров &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
