'use client';
import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { HeartHandshake } from 'lucide-react';
import toast from 'react-hot-toast';

interface TipModalProps {
  open: boolean;
  onClose: () => void;
  specialistName?: string;
  bookingId: string;
}

const QUICK_AMOUNTS = [100, 200, 500, 1000];

export function TipModal({ open, onClose, specialistName, bookingId }: TipModalProps) {
  const [amount, setAmount] = useState<number | ''>('');
  const [selectedQuick, setSelectedQuick] = useState<number | null>(null);

  const handleQuick = (val: number) => {
    setSelectedQuick(val);
    setAmount(val);
  };

  const handleSubmit = () => {
    const val = Number(amount);
    if (!val || val <= 0) { toast.error('Укажите сумму чаевых'); return; }
    toast.success('Спасибо! Сервис чаевых появится soon 💛', { duration: 3000 });
    handleClose();
  };

  const handleClose = () => {
    setAmount('');
    setSelectedQuick(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={`Чаевые${specialistName ? ` — ${specialistName}` : ''}`}
      actions={
        <div className="flex gap-3 w-full">
          <button onClick={handleClose} className="glass-btn flex-1 text-sm">Отмена</button>
          <button onClick={handleSubmit} disabled={!amount} className="glass-btn flex-1 text-sm disabled:opacity-50">
            <HeartHandshake className="w-4 h-4" /> Отблагодарить
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-[#6b7280]">Выберите сумму чаевых</p>
        <div className="grid grid-cols-4 gap-2">
          {QUICK_AMOUNTS.map((val) => (
            <button
              key={val}
              onClick={() => handleQuick(val)}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                selectedQuick === val
                  ? 'border-[#dc2626] bg-[#fef2f2] text-[#dc2626]'
                  : 'border-[#e5e7eb] text-[#374151] hover:border-[#dc2626]'
              }`}
            >
              {val}₽
            </button>
          ))}
        </div>
        <div>
          <p className="text-xs text-[#6b7280] mb-1">Своя сумма</p>
          <input
            type="number"
            className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2 text-sm"
            placeholder="Введите сумму"
            value={amount}
            onChange={(e) => { setAmount(Number(e.target.value)); setSelectedQuick(null); }}
            min={1}
          />
        </div>
        <div className="text-xs text-[#9ca3af] text-center pt-2 border-t border-[#e5e7eb]">
          Скоро: НетМонет / СберЧаевые
        </div>
      </div>
    </Modal>
  );
}
