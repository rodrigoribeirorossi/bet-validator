import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BetValidationResult {
  impliedProbability: number;
  calculatedProbability: number;
  valueBet: number;
  edge: number;
  fairOdds: number;
  recommendedStake: number;
  expectedValue: number;
  expectedROI: number;
  recommendation: 'APOSTAR_FORTE' | 'APOSTAR' | 'CAUTELA' | 'EVITAR';
  confidenceLevel: 'ALTA' | 'MEDIA' | 'BAIXA';
}

export interface ValidationHistory {
  id: string;
  date: Date;
  type: string;
  match: string;
  result: BetValidationResult;
  odds: number;
  stake: number;
}

export interface UserProfile {
  name: string;
  email?: string;
}

export interface Bankroll {
  initialBankroll: number;
  currentBankroll: number;
  lastUpdated: Date;
}

interface AppState {
  // User
  user: UserProfile;
  setUser: (user: Partial<UserProfile>) => void;
  
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // Bankroll
  bankroll: Bankroll;
  setBankroll: (amount: number) => void;
  updateCurrentBankroll: (amount: number) => void;
  
  // History
  validationHistory: ValidationHistory[];
  addValidation: (validation: Omit<ValidationHistory, 'id'>) => void;
  clearHistory: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User
      user: {
        name: 'Usuário',
      },
      setUser: (userData) =>
        set((state) => ({
          user: { ...state.user, ...userData },
        })),

      // Theme
      theme: 'light',
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),

      // Bankroll
      bankroll: {
        initialBankroll: 1000,
        currentBankroll: 1000,
        lastUpdated: new Date(),
      },
      setBankroll: (amount) =>
        set({
          bankroll: {
            initialBankroll: amount,
            currentBankroll: amount,
            lastUpdated: new Date(),
          },
        }),
      updateCurrentBankroll: (amount) =>
        set((state) => ({
          bankroll: {
            ...state.bankroll,
            currentBankroll: amount,
            lastUpdated: new Date(),
          },
        })),

      // History
      validationHistory: [],
      addValidation: (validation) =>
        set((state) => ({
          validationHistory: [
            {
              ...validation,
              id: crypto.randomUUID(),
            },
            ...state.validationHistory,
          ],
        })),
      clearHistory: () => set({ validationHistory: [] }),
    }),
    {
      name: 'bet-validator-storage',
    }
  )
);
