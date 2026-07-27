'use client';
import React, { useEffect, useRef } from 'react';

interface Props {
  createGame: (parent: HTMLElement) => { destroy: () => void } | Promise<{ destroy: () => void }>;
  className?: string;
}

export default function PhaserMount({ createGame, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const destroyedRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    destroyedRef.current = false;

    const result = createGame(el);
    const gamePromise = result instanceof Promise ? result : Promise.resolve(result);

    gamePromise.then(game => {
      if (destroyedRef.current) {
        game.destroy();
        return;
      }
      el._phaserGame = game;
    });

    return () => {
      destroyedRef.current = true;
      if (el._phaserGame) {
        el._phaserGame.destroy();
        delete el._phaserGame;
      }
    };
  }, [createGame]);

  return <div ref={containerRef} className={`${className} overflow-hidden`} style={{ aspectRatio: '2/3' }} />;
}

declare global {
  interface HTMLElement {
    _phaserGame?: { destroy: () => void };
  }
}