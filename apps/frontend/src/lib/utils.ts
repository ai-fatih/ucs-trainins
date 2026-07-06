export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatTime(date: string): string {
  const d = new Date(date);
  return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

export function getStatusLabel(status: string): { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'gray' } {
  const map: Record<string, { label: string; variant: any }> = {
    scheduled: { label: 'Предстоит', variant: 'info' },
    in_progress: { label: 'В процессе', variant: 'warning' },
    completed: { label: 'Завершено', variant: 'success' },
    cancelled: { label: 'Отменено', variant: 'danger' },
    no_show: { label: 'No-show', variant: 'danger' },
    rescheduled: { label: 'Перенесено', variant: 'warning' },
  };
  return map[status] || { label: status, variant: 'gray' };
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
