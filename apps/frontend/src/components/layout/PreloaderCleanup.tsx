'use client';
import { useEffect } from 'react';

export function PreloaderCleanup() {
  useEffect(() => {
    const el = document.getElementById('preloader');
    if (el) {
      console.info('[Preloader] hidden');
      el.classList.add('hidden');
    }
  }, []);

  return null;
}
