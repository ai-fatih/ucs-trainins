'use client';
import { useEffect } from 'react';

export function PreloaderCleanup() {
  useEffect(() => {
    const el = document.getElementById('preloader');
    if (el) {
      el.classList.add('hidden');
      setTimeout(() => el.remove(), 400);
    }
  }, []);

  return null;
}
