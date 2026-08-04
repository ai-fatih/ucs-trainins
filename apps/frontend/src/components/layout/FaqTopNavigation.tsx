import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function FaqTopNavigation() {
  return (
    <div className="max-w-[1000px] mx-auto px-4 py-12">
      <nav className="flex justify-between items-center">
        <Link
          href="/faq"
          className="inline-flex items-center gap-1 text-sm text-[#1a56db] hover:underline no-underline"
        >
          <ArrowLeft className="w-4 h-4" /> Назад к годовому срезу
        </Link>
        <div className="text-sm text-[#9ca3af]">
          Всего: 8 обращений (3 разбора)
        </div>
        <Link
          href="/faq-top"
          className="inline-flex items-center gap-1 text-sm text-[#1a56db] hover:underline no-underline"
        >
          Топ-5 по месяцам
          <ArrowRight className="w-4 h-4" />
        </Link>
      </nav>
    </div>
  );
}