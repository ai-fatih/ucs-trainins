import Link from 'next/link';
import { PhoneLink } from '@/components/PhoneLink';
import {
  GraduationCap, BookOpen, TrendingUp, FileText, Mail, ArrowRight, CheckCircle,
  ChevronDown, ChevronRight, Monitor, Database, Truck, Smartphone, Bell,
} from 'lucide-react';

const heroHighlights: { href: string; title: string; desc: string; icon: React.ElementType; accent: string }[] = [
  { href: '/#docs', title: 'Документация', desc: 'Пошаговые инструкции по всем продуктам rkeeper', icon: BookOpen, accent: 'text-[#0d9488]' },
  { href: '/#school', title: 'Школа', desc: 'Открытые курсы и тренажёры для ваших сотрудников', icon: GraduationCap, accent: 'text-[#5eead4]' },
  { href: '/docs/cases', title: 'Кейсы месяца', desc: 'Разбор реальных обращений и типовых ошибок', icon: TrendingUp, accent: 'text-[#f59e0b]' },
];

const docProducts: { label: string; href: string; icon: React.ElementType; gradient: string; desc: string; count: number; featured?: boolean; scenarios?: { title: string; href: string }[] }[] = [
  {
    label: 'r_keeper 7',
    href: '/docs/rkeeper/rk7',
    icon: Monitor,
    gradient: 'from-[#1a56db] to-[#2563eb]',
    desc: 'Кассовые операции, смены, скидки и возвраты',
    count: 3,
    featured: true,
    scenarios: [
      { title: 'Создание и оплата заказа', href: '/docs/rkeeper/rk7/create-order' },
      { title: 'Управление сменами', href: '/docs/rkeeper/rk7/shift-management' },
      { title: 'Скидки и возвраты', href: '/docs/rkeeper/rk7/discounts-returns' },
    ],
  },
  {
    label: 'StoreHouse Pro',
    href: '/docs/rkeeper/storehouse',
    icon: Database,
    gradient: 'from-[#0d9488] to-[#14b8a6]',
    desc: 'Складской учёт: списание, инвентаризация, оприходование',
    count: 3,
  },
  {
    label: 'Delivery',
    href: '/docs/rkeeper/delivery',
    icon: Truck,
    gradient: 'from-[#d97706] to-[#f59e0b]',
    desc: 'Приём заказов, колл-центр, приложение курьера',
    count: 3,
  },
  {
    label: 'Event',
    href: '/docs/rkeeper/event',
    icon: Bell,
    gradient: 'from-[#9ca3af] to-[#b0b7c3]',
    desc: 'Уведомления с кассы rk Cash Desk',
    count: 3,
  },
  {
    label: 'Waiter & Cash Desk',
    href: '/docs/rkeeper/waiter',
    icon: Smartphone,
    gradient: 'from-[#7c3aed] to-[#8b5cf6]',
    desc: 'Мобильные приложения для официантов и кассиров',
    count: 3,
  },
];

const schoolCards: { title: string; desc: string; cta: string; href: string; icon: React.ElementType; gradient: string }[] = [
  { title: 'Курсы', desc: 'Открытые учебные материалы и тренажёры по продуктам', cta: 'К курсам', href: '/school/courses', icon: BookOpen, gradient: 'from-[#1a56db] to-[#2563eb]' },
  { title: 'Кейсы месяца', desc: 'Разбор реальных обращений и типовых ошибок', cta: 'К разбору', href: '/docs/cases', icon: TrendingUp, gradient: 'from-[#d97706] to-[#f59e0b]' },
  { title: 'База знаний', desc: 'Пошаговые инструкции по всем продуктам rkeeper', cta: 'Открыть базу', href: '/docs', icon: FileText, gradient: 'from-[#0d9488] to-[#14b8a6]' },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-[#0f172a]">
        <section id="hero" className="min-h-[520px] grid grid-cols-1 lg:grid-cols-2 relative max-w-[1440px] mx-auto">
          <div className="text-white p-6 md:p-16 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 bg-[rgba(13,148,136,0.2)] text-slate-50 px-3 py-1.5 rounded-full text-xs font-semibold w-fit mb-5">
              ✦ Консультации и обучение
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
              Экспертная поддержка <span className="text-[#0d9488]">пользователей rkeeper</span>
            </h1>
            <p className="text-base text-[#94a3b8] mb-4 max-w-md">
              Консультируем и обучаем сотрудников по работе с пользовательской частью rkeeper
            </p>
            <div className="flex gap-2 flex-wrap mb-8">
              <span className="text-[11px] px-3 py-1 rounded-full font-semibold bg-[rgba(13,148,136,0.15)] text-[#5eead4]">rkeeper</span>
              <span className="text-[11px] px-3 py-1 rounded-full font-semibold bg-[rgba(13,148,136,0.15)] text-[#5eead4]">storehouse</span>
              <span className="text-[11px] px-3 py-1 rounded-full font-semibold bg-[rgba(13,148,136,0.15)] text-[#5eead4]">delivery</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/school"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#1a56db] to-[#0d9488] text-white text-sm font-bold hover:scale-[1.02] hover:shadow-lg transition-all no-underline"
              >
                <GraduationCap className="w-4 h-4" />
                В школу
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.06)] text-white text-sm font-bold hover:bg-[rgba(255,255,255,0.12)] transition-all no-underline"
              >
                <BookOpen className="w-4 h-4" />
                Документация
              </Link>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-4 p-6 md:p-16 bg-gradient-to-br from-[#1e293b] to-[#0f172a] relative overflow-hidden">
            <div className="absolute w-72 h-72 rounded-full blur-[80px] bg-[rgba(26,86,219,0.3)] top-[10%] left-[10%]" />
            <div className="absolute w-72 h-72 rounded-full blur-[80px] bg-[rgba(13,148,136,0.25)] bottom-[10%] right-[10%]" />
            {heroHighlights.map((h) => (
              <Link
                key={h.href}
                href={h.href}
                className="relative bg-[rgba(255,255,255,0.05)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-2xl p-4 md:p-5 flex items-start gap-4 no-underline hover:border-[#0d9488]/30 hover:bg-[rgba(255,255,255,0.08)] transition-all group"
              >
                <span className={`w-11 h-11 rounded-xl bg-[rgba(255,255,255,0.08)] flex items-center justify-center shrink-0 ${h.accent}`}>
                  <h.icon className="w-5 h-5" />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5">
                    <span className="text-sm md:text-base font-semibold text-white">{h.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#64748b] group-hover:text-[#0d9488] group-hover:translate-x-0.5 transition-all" />
                  </span>
                  <span className="text-xs text-[#94a3b8] leading-snug block mt-0.5">{h.desc}</span>
                </span>
              </Link>
            ))}
          </div>

          <a href="#about" className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[#64748b] text-xs hover:text-[#94a3b8] transition-colors no-underline">
            <span>О нас</span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </a>
        </section>
      </div>

      {/* About */}
      <section id="about" className="bg-[#0f172a] py-16 px-4">
        <div className="max-w-[1200px] mx-auto space-y-12">
          <div className="text-center max-w-[600px] mx-auto">
            <h2 className="text-3xl font-bold mb-2 text-white">Отдел консультации и обучения</h2>
            <p className="text-sm text-[#94a3b8] mb-5 leading-relaxed">
              Помогаем ресторанам разобраться с rkeeper, StoreHouse и доставкой. Проводим обучение, заводим справочники, консультируем по любым вопросам.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <div className="bg-[rgba(255,255,255,0.06)] rounded-xl px-5 py-2.5 text-center min-w-[120px]">
                <div className="text-lg font-extrabold text-[#0d9488]">500+</div>
                <div className="text-[11px] text-[#94a3b8]">Клиентов</div>
              </div>
              <div className="bg-[rgba(255,255,255,0.06)] rounded-xl px-5 py-2.5 text-center min-w-[120px]">
                <div className="text-lg font-extrabold text-[#0d9488]">15+</div>
                <div className="text-[11px] text-[#94a3b8]">Лет опыта</div>
              </div>
              <div className="bg-[rgba(255,255,255,0.06)] rounded-xl px-5 py-2.5 text-center min-w-[120px]">
                <div className="text-lg font-extrabold text-[#0d9488]">12+</div>
                <div className="text-[11px] text-[#94a3b8]">Курсов в школе</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] rounded-2xl px-6 py-5 text-white">
            <a href="mailto:school@ucs-service.ru" className="flex items-center gap-2.5 no-underline text-white hover:translate-x-1 transition-all">
              <span className="w-9 h-9 rounded-xl bg-[rgba(255,255,255,0.08)] flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-[#0d9488]" />
              </span>
              <span className="text-[13px] font-semibold">school@ucs-service.ru</span>
            </a>

            <PhoneLink />
          </div>
        </div>
      </section>

      {/* Docs */}
      <section id="docs" className="bg-white py-20 px-4">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#e8effa] text-[#1a56db] mb-4">
              <BookOpen className="w-3 h-3" /> База знаний
            </span>
            <h2 className="text-3xl font-bold mb-3 text-[#111827]">Документация</h2>
            <p className="text-[#6b7280] max-w-xl mx-auto">
              Пошаговые инструкции по всем продуктам r_keeper: касса, склад, доставка, мобильные приложения
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {docProducts.map((doc) => (
              <Link
                key={doc.href}
                href={doc.href}
                className={`glass-card p-6 no-underline group flex flex-col ${doc.featured ? 'md:col-span-2 md:flex-row md:items-center md:gap-8' : ''}`}
              >
                <div className={`flex items-start gap-4 ${doc.featured ? 'md:flex-1' : ''}`}>
                  <span className={`w-14 h-14 rounded-xl bg-gradient-to-br ${doc.gradient} text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-md`}>
                    <doc.icon className="w-7 h-7" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-[#111827] group-hover:text-[#1a56db] transition-colors">{doc.label}</h3>
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${doc.count > 0 ? 'bg-[#e8effa] text-[#1a56db]' : 'bg-[#f3f4f6] text-[#6b7280]'}`}>
                        {doc.count > 0 ? `${doc.count} сценария` : 'Раздел'}
                      </span>
                    </span>
                    <p className="text-sm text-[#6b7280] mt-1.5">{doc.desc}</p>
                  </span>
                </div>
                {doc.featured && doc.scenarios && (
                  <ul className="mt-5 md:mt-0 md:min-w-[300px] space-y-2">
                    {doc.scenarios.map((sc) => (
                      <li key={sc.href} className="flex items-center gap-2 text-sm text-[#4b5563] group-hover:text-[#1a56db] transition-colors">
                        <CheckCircle className="w-4 h-4 text-[#0d9488] shrink-0" />
                        {sc.title}
                      </li>
                    ))}
                  </ul>
                )}
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white no-underline transition-all bg-gradient-to-r from-[#1a56db] to-[#0d9488] hover:shadow-lg hover:-translate-y-0.5"
            >
              Вся документация
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* School */}
      <section id="school" className="bg-white py-20 px-4">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#fef3c7] text-[#d97706] mb-4">
              <GraduationCap className="w-3 h-3" /> Обучение и рост
            </span>
            <h2 className="text-3xl font-bold mb-3 text-[#111827]">Школа UCS</h2>
            <p className="text-[#6b7280] max-w-xl mx-auto">
              Открытые курсы и тренажёры по продуктам rkeeper
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto mb-10">
            {[
              { value: '12+', label: 'Курсов' },
              { value: '50+', label: 'Уроков' },
              { value: '100%', label: 'Бесплатно' },
            ].map((s) => (
              <div key={s.label} className="glass-card py-4 px-5 text-center">
                <div className="text-2xl font-extrabold bg-gradient-to-r from-[#1a56db] to-[#0d9488] bg-clip-text text-transparent">{s.value}</div>
                <div className="text-xs text-[#6b7280] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {schoolCards.map((c) => (
              <Link key={c.href} href={c.href} className="glass-card p-6 no-underline group flex flex-col">
                <span className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.gradient} text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-md mb-5`}>
                  <c.icon className="w-6 h-6" />
                </span>
                <h3 className="text-lg font-semibold mb-2 text-[#111827] group-hover:text-[#1a56db] transition-colors">{c.title}</h3>
                <p className="text-sm text-[#6b7280] mb-5 flex-1">{c.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a56db] group-hover:gap-2.5 transition-all w-fit">
                  {c.cta}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/school"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white no-underline transition-all bg-gradient-to-r from-[#1a56db] to-[#0d9488] hover:shadow-lg hover:-translate-y-0.5"
            >
              Перейти в школу
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
