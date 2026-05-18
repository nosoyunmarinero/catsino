// src/store/useCasinoStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCasinoStore = create(
  persist(
    (set) => ({
      balance: 1000,
      freeSpinsLeft: 0, 
      history: [],
      turboMode: false,
      
      adjustBalance: (amount) => set((state) => ({ balance: state.balance + amount })),
      
      adjustFreeSpins: (amount) => set((state) => ({ 
        freeSpinsLeft: Math.max(0, state.freeSpinsLeft + amount) 
      })),
      
      setTurboMode: (enabled) => set({ turboMode: enabled }),
      
      claimFreeCoins: () => set((state) => ({ balance: state.balance + 1000 })),
      
      addHistoryRecord: (record) => set((state) => ({
        history: [
          { ...record, id: Date.now(), timestamp: new Date().toISOString() },
          ...state.history
        ].slice(0, 50)
      })),
    }),
    {
      name: 'catsino-storage',
    }
  )
);
