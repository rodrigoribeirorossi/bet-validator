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

export interface TeamStats {
  wins: number;
  draws: number;
  losses: number;
}

export interface GoalStats {
  scored: number;
  conceded: number;
  games: number;
}

export interface OverUnderHistory {
  over: number;
  under: number;
}

export interface BTTSHistory {
  yes: number;
  no: number;
}

export interface CornerStats {
  favor: number;
  against: number;
  games: number;
}

export interface CardStats {
  average: number;
  games: number;
}

export interface RefereeStats {
  yellowAverage?: number;
  redAverage?: number;
  totalCardsAverage?: number;
}

export interface BankrollState {
  currentBankroll: number;
  initialBankroll: number;
  history: BankrollEntry[];
}

export interface BankrollEntry {
  id: string;
  date: Date;
  amount: number;
  type: 'WIN' | 'LOSS' | 'DEPOSIT' | 'WITHDRAWAL';
  description: string;
}

export interface ValidationHistory {
  id: string;
  date: Date;
  type: 'RESULTADO_1X2' | 'OVER_UNDER' | 'BTTS' | 'HANDICAP' | 'ESCANTEIOS' | 'CARTOES';
  match: string;
  result: BetValidationResult;
  odds: number;
  stake: number;
  outcome?: 'WIN' | 'LOSS' | 'PENDING';
}

export type BetType = 'RESULTADO_1X2' | 'OVER_UNDER' | 'BTTS' | 'HANDICAP' | 'ESCANTEIOS' | 'CARTOES';
