import InstructionPager from '@/components/docs/InstructionPager';
import DocPageToolbar from '@/components/docs/DocPageToolbar';

const steps = [
  {
    title: 'Откройте экран событий Event',
    body: 'Запустите приложение Event на кассовом ПК. После подключения к кассе откроется лента событий, которая обновляется в реальном времени.',
  },
  {
    title: 'Ознакомьтесь с лентой событий',
    body: (
      <ul className="list-disc pl-5 space-y-1 text-[#6b7280]">
        <li>Каждая запись содержит тип события, время и связанный объект (стол, заказ, чек).</li>
        <li>Критичные события выделяются цветом и отображаются в начале списка.</li>
        <li>Новые события подсвечиваются до тех пор, пока их не подтвердили.</li>
      </ul>
    ),
  },
  {
    title: 'Отфильтруйте события',
    body: 'Используйте фильтры по типу (заказ, оплата, возврат, ошибка) и по статусу (новые, подтверждённые). Фильтры помогают быстро найти события за смену.',
  },
  {
    title: 'Подтвердите событие',
    body: 'Кликните по событию, чтобы открыть подробности. Нажмите «Подтвердить», если событие обработано. Подтверждённые события перестают подсвечиваться.',
  },
  {
    title: 'Работайте с историей',
    body: 'Все события хранятся в журнале. Перейдите в «История» для просмотра событий за прошлые дни — данные группируются по сменам и датам.',
  },
  {
    title: 'Экспортируйте отчёт',
    body: 'В разделе «Отчёты» сформируйте сводку по событиям за период и экспортируйте её в файл для передачи руководству или в техподдержку.',
  },
];

const errors = [
  {
    error: 'Лента не обновляется',
    reason: 'Потеряна связь между Event и кассой rk Cash Desk.',
    solution: 'Проверьте индикатор подключения в шапке окна. Перезапустите Event — приложение повторно подключится к кассе автоматически.',
  },
  {
    error: 'Событие не отображается в истории',
    reason: 'Событие было подтверждено, но не сохранено из-за сбоя записи в журнал.',
    solution: 'Проверьте доступ к журналу и наличие свободного места на диске. При необходимости восстановите события из резервной копии.',
  },
  {
    error: 'Не хватает данных об отменённом событии',
    reason: 'Событие удалено из ленты вручную до подтверждения.',
    solution: 'Восстановите событие из архива «Удалённые» или обратитесь к администратору за выгрузкой журнала кассы.',
  },
];

export default function EventScreenPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      <div className="mb-10">
                <h1 className="text-3xl font-bold text-[#111827] mb-3">Экран событий: просмотр и подтверждение</h1>
        <p className="text-[#6b7280] text-base leading-relaxed">
          Консультация: как работать с лентой событий на кассе — фильтровать, подтверждать события и формировать отчёты.
        </p>
      </div>

      <DocPageToolbar steps={steps} />

      <div className="glass-card p-6 mb-10">
        <h2 id="steps" className="text-xl font-semibold text-[#111827] mb-6">Пошаговая инструкция</h2>
        <ol className="space-y-6">
          {steps.map((step, i) => (
            <li key={i} id={`step-${i}`} className="pl-2">
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
        <h2 id="errors" className="text-xl font-semibold text-[#111827] mb-6">Типовые ошибки</h2>
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

      <InstructionPager productId="event" currentHref="/docs/rkeeper/event/event-screen" />
    </div>
  );
}
