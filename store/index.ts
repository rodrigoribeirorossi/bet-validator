import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BankrollState, BankrollEntry, ValidationHistory } from '@/types';

interface AppState {
  // Bankroll
  bankroll: BankrollState;
  updateBankroll: (amount: number) => void;
  addBankrollEntry: (entry: Omit<BankrollEntry, 'id'>) => void;
  
  // Validation History
  history: ValidationHistory[];
  addValidation: (validation: Omit<ValidationHistory, 'id'>) => void;
  updateValidationOutcome: (id: string, outcome: 'WIN' | 'LOSS') => void;
  
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Bankroll state
      bankroll: {
        currentBankroll: 1000,
        initialBankroll: 1000,
        history: [],
      },
      
      updateBankroll: (amount: number) => {
        set((state) => ({
          bankroll: {
            ...state.bankroll,
            currentBankroll: amount,
          },
        }));
      },
      
      addBankrollEntry: (entry) => {
        const id = `${Date.now()}-${Math.random()}`;
        set((state) => ({
          bankroll: {
            ...state.bankroll,
            history: [...state.bankroll.history, { ...entry, id }],
          },
        }));
      },
      
      // History state
      history: [],
      
      addValidation: (validation) => {
        const id = `${Date.now()}-${Math.random()}`;
        set((state) => ({
          history: [...state.history, { ...validation, id }],
        }));
      },
      
      updateValidationOutcome: (id: string, outcome: 'WIN' | 'LOSS') => {
        set((state) => ({
          history: state.history.map((h) =>
            h.id === id ? { ...h, outcome } : h
          ),
        }));
      },
      
      // Theme state
      theme: 'light',
      
      toggleTheme: () => {
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        }));
      },
    }),
    {
      name: 'bet-validator-storage',
    }
  )
);
