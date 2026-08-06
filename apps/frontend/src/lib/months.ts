const MONTH_SHORT: Record<string, string> = {
  '01': 'Янв',
  '02': 'Фев',
  '03': 'Мар',
  '04': 'Апр',
  '05': 'Май',
  '06': 'Июн',
  '07': 'Июл',
  '08': 'Авг',
  '09': 'Сен',
  '10': 'Окт',
  '11': 'Ноя',
  '12': 'Дек',
};

export function monthShortLabel(month: string): string {
  const mm = month.split('-')[1];
  return MONTH_SHORT[mm] ?? month;
}

export function monthShortFromLabel(label: string): string {
  return label.slice(0, 3);
}
