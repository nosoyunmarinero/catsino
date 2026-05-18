import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCasinoStore = create(
  persist(
    (set) => ({
      balance: 1000,
      history: [],
      turboMode: false,
      
      adjustBalance: (amount) => set((state) => ({ balance: state.balance + amount })),
      
      setTurboMode: (enabled) => set({ turboMode: enabled }),
      
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
