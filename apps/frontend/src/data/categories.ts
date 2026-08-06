import type { CaseCategory } from '@/types';

export const CATEGORY_LABELS: Record<CaseCategory, string> = {
  marking: 'Маркировка / Честный Знак',
  egais: 'ЕГАИС',
  errors: 'Ошибки и сбои',
  nomenclature: 'Номенклатура / Меню',
  cash: 'Касса и чеки',
  reports: 'Отчёты',
  pricing: 'Скидки и цены',
  integration: 'Выгрузка / Интеграции',
};

export const CATEGORY_OPTIONS = (Object.keys(CATEGORY_LABELS) as CaseCategory[]).map(
  (value) => ({ value, label: CATEGORY_LABELS[value] }),
);

export const CATEGORY_COLORS: Record<CaseCategory, { bg: string; text: string }> = {
  marking: { bg: '#e8effa', text: '#1a56db' },
  egais: { bg: '#ecfdf5', text: '#059669' },
  errors: { bg: '#fef2f2', text: '#dc2626' },
  nomenclature: { bg: '#f0f4ff', text: '#1e40af' },
  cash: { bg: '#fefce8', text: '#a16207' },
  reports: { bg: '#f5f3ff', text: '#6d28d9' },
  pricing: { bg: '#fff7ed', text: '#c2410c' },
  integration: { bg: '#e0f2fe', text: '#0369a1' },
};