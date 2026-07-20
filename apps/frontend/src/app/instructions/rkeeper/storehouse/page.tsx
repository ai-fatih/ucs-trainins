import Link from 'next/link';

const sections = [
  {
    title: 'Документы складского учёта',
    items: [
      { href: '/instructions/rkeeper/storehouse/write-off', label: 'Списание товаров' },
      { href: '/instructions/rkeeper/storehouse/inventory', label: 'Инвентаризация' },
      { href: '/instructions/rkeeper/storehouse/arrival', label: 'Оприходование товаров' },
    ],
  },
];

export default function StoreHousePage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-[#6b7280] mb-3">
          <Link href="/instructions" className="text-[#1a56db] hover:underline no-underline">Инструкции</Link>
          <span>/</span>
          <span className="text-[#111827]">StoreHouse Pro</span>
        </div>
        <h1 className="text-3xl font-bold text-[#111827] mb-3">StoreHouse Pro</h1>
        <p className="text-[#6b7280] text-base leading-relaxed">
          Система управления складом, производством и кухней. В этом разделе &mdash; инструкции по основным операциям в приложении StoreHouse Pro.
        </p>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="text-lg font-semibold text-[#111827] mb-3">{section.title}</h2>
            <div className="grid gap-3">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="glass-card p-5 no-underline transition-all hover:-translate-y-0.5"
                >
                  <span className="text-base font-medium text-[#1a56db]">{item.label}</span>
                  <span className="block text-sm text-[#6b7280] mt-1">
                    Пошаговая инструкция с типовыми ошибками
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
