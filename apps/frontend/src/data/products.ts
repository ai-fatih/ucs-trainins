export type ProductId =
  | 'rk7'
  | 'rk5'
  | 'mobwaiter'
  | 'sh5-to-1c'
  | 'fr'
  | 'storehouse'
  | 'delivery'
  | 'event'
  | 'waiter';

export const PRODUCT_LABELS: Record<ProductId, string> = {
  rk7: 'r_keeper 7',
  rk5: 'StoreHouse 5',
  mobwaiter: 'MobWaiter',
  'sh5-to-1c': 'Выгрузка SH5 → 1C',
  fr: 'Конфигурация ФР',
  storehouse: 'StoreHouse Pro',
  delivery: 'Delivery',
  event: 'Event',
  waiter: 'Waiter & Cash Desk',
};

export const PRODUCT_OPTIONS = (Object.keys(PRODUCT_LABELS) as ProductId[]).map(
  (value) => ({ value, label: PRODUCT_LABELS[value] }),
);