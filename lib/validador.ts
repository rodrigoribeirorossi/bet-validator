import {
  BetValidationResult,
  TeamStats,
  GoalStats,
  OverUnderHistory,
  BTTSHistory,
  CornerStats,
  CardStats,
  RefereeStats,
} from '@/types';

/**
 * Calculate implied probability from odds
 */
export function calculateImpliedProbability(odds: number): number {
  return 1 / odds;
}

/**
 * Calculate value bet
 * Value = (Real Probability × Odds) - 1
 */
export function calculateValueBet(probability: number, odds: number): number {
  return probability * odds - 1;
}

/**
 * Calculate edge (advantage)
 */
export function calculateEdge(calculatedProb: number, impliedProb: number): number {
  return calculatedProb - impliedProb;
}

/**
 * Calculate fair odds
 */
export function calculateFairOdds(probability: number): number {
  return 1 / probability;
}

/**
 * Kelly Criterion for stake calculation
 * Kelly% = (p × b - q) / b
 * We use Quarter Kelly to reduce variance
 */
export function calculateKellyStake(
  probability: number,
  odds: number,
  bankroll: number,
  fraction: number = 0.25
): number {
  const b = odds - 1; // Decimal odds - 1
  const p = probability;
  const q = 1 - p;
  
  const kelly = (p * b - q) / b;
  const kellyPercentage = Math.max(0, kelly * fraction);
  
  return bankroll * kellyPercentage;
}

/**
 * Calculate Expected Value (EV)
 */
export function calculateEV(probability: number, odds: number, stake: number): number {
  const winAmount = stake * odds;
  const expectedWin = probability * winAmount;
  const expectedLoss = (1 - probability) * stake;
  
  return expectedWin - expectedLoss;
}

/**
 * Calculate Expected ROI
 */
export function calculateExpectedROI(probability: number, odds: number): number {
  return (probability * odds - 1);
}

/**
 * Get recommendation based on value
 */
export function getRecommendation(value: number, edge: number): BetValidationResult['recommendation'] {
  if (value >= 0.15 && edge >= 0.10) return 'APOSTAR_FORTE';
  if (value >= 0.05 && edge >= 0.05) return 'APOSTAR';
  if (value > 0 && edge > 0) return 'CAUTELA';
  return 'EVITAR';
}

/**
 * Get confidence level based on sample size
 */
export function getConfidenceLevel(sampleSize: number): BetValidationResult['confidenceLevel'] {
  if (sampleSize >= 20) return 'ALTA';
  if (sampleSize >= 10) return 'MEDIA';
  return 'BAIXA';
}

/**
 * Poisson Distribution - Calculate probability of k goals
 * P(X = k) = (e^(-λ) × λ^k) / k!
 */
function poissonProbability(lambda: number, k: number): number {
  const e = Math.E;
  const factorial = (n: number): number => {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
  };
  
  return (Math.pow(e, -lambda) * Math.pow(lambda, k)) / factorial(k);
}

/**
 * Calculate probability of over N goals using Poisson
 */
export function calculateOverProbability(expectedGoals: number, line: number): number {
  let probabilityUnder = 0;
  
  // Sum probabilities from 0 to line
  for (let k = 0; k <= Math.floor(line); k++) {
    probabilityUnder += poissonProbability(expectedGoals, k);
  }
  
  return 1 - probabilityUnder;
}

/**
 * Calculate probability of under N goals using Poisson
 */
export function calculateUnderProbability(expectedGoals: number, line: number): number {
  let probabilityUnder = 0;
  
  // Sum probabilities from 0 to line
  for (let k = 0; k <= Math.floor(line); k++) {
    probabilityUnder += poissonProbability(expectedGoals, k);
  }
  
  return probabilityUnder;
}

/**
 * Validate 1X2 (Moneyline) bet
 */
export function validate1X2(
  homeStats: TeamStats,
  awayStats: TeamStats,
  odds: number,
  bankroll: number,
  outcome: '1' | 'X' | '2'
): BetValidationResult {
  const totalGames = homeStats.wins + homeStats.draws + homeStats.losses;
  const awayTotalGames = awayStats.wins + awayStats.draws + awayStats.losses;
  
  // Calculate probabilities based on historical performance
  let homeProbability = homeStats.wins / totalGames;
  let drawProbability = homeStats.draws / totalGames;
  let awayProbability = awayStats.wins / awayTotalGames;
  
  // Normalize probabilities
  const total = homeProbability + drawProbability + awayProbability;
  homeProbability = homeProbability / total;
  drawProbability = drawProbability / total;
  awayProbability = awayProbability / total;
  
  let calculatedProb = 0;
  if (outcome === '1') calculatedProb = homeProbability;
  else if (outcome === 'X') calculatedProb = drawProbability;
  else calculatedProb = awayProbability;
  
  const impliedProb = calculateImpliedProbability(odds);
  const value = calculateValueBet(calculatedProb, odds);
  const edge = calculateEdge(calculatedProb, impliedProb);
  const fairOdds = calculateFairOdds(calculatedProb);
  const stake = calculateKellyStake(calculatedProb, odds, bankroll);
  const ev = calculateEV(calculatedProb, odds, stake);
  const roi = calculateExpectedROI(calculatedProb, odds);
  const recommendation = getRecommendation(value, edge);
  const confidenceLevel = getConfidenceLevel(totalGames + awayTotalGames);
  
  return {
    impliedProbability: impliedProb,
    calculatedProbability: calculatedProb,
    valueBet: value,
    edge,
    fairOdds,
    recommendedStake: stake,
    expectedValue: ev,
    expectedROI: roi,
    recommendation,
    confidenceLevel,
  };
}

/**
 * Validate Over/Under Goals bet
 */
export function validateOverUnder(
  homeGoals: GoalStats,
  awayGoals: GoalStats,
  history: OverUnderHistory,
  line: number,
  odds: number,
  bankroll: number,
  betType: 'OVER' | 'UNDER'
): BetValidationResult {
  // Calculate expected goals using team averages
  const homeAvgScored = homeGoals.scored / homeGoals.games;
  const homeAvgConceded = homeGoals.conceded / homeGoals.games;
  const awayAvgScored = awayGoals.scored / awayGoals.games;
  const awayAvgConceded = awayGoals.conceded / awayGoals.games;
  
  const expectedHomeGoals = (homeAvgScored + awayAvgConceded) / 2;
  const expectedAwayGoals = (awayAvgScored + homeAvgConceded) / 2;
  const expectedTotalGoals = expectedHomeGoals + expectedAwayGoals;
  
  // Calculate Poisson probability
  const poissonProb = betType === 'OVER' 
    ? calculateOverProbability(expectedTotalGoals, line)
    : calculateUnderProbability(expectedTotalGoals, line);
  
  // Calculate historical probability
  const totalHistorical = history.over + history.under;
  const historicalProb = betType === 'OVER'
    ? history.over / totalHistorical
    : history.under / totalHistorical;
  
  // Combine probabilities (60% Poisson, 40% Historical)
  const calculatedProb = poissonProb * 0.6 + historicalProb * 0.4;
  
  const impliedProb = calculateImpliedProbability(odds);
  const value = calculateValueBet(calculatedProb, odds);
  const edge = calculateEdge(calculatedProb, impliedProb);
  const fairOdds = calculateFairOdds(calculatedProb);
  const stake = calculateKellyStake(calculatedProb, odds, bankroll);
  const ev = calculateEV(calculatedProb, odds, stake);
  const roi = calculateExpectedROI(calculatedProb, odds);
  const recommendation = getRecommendation(value, edge);
  const sampleSize = homeGoals.games + awayGoals.games + totalHistorical;
  const confidenceLevel = getConfidenceLevel(sampleSize);
  
  return {
    impliedProbability: impliedProb,
    calculatedProbability: calculatedProb,
    valueBet: value,
    edge,
    fairOdds,
    recommendedStake: stake,
    expectedValue: ev,
    expectedROI: roi,
    recommendation,
    confidenceLevel,
  };
}

/**
 * Validate BTTS (Both Teams To Score) bet
 */
export function validateBTTS(
  homeGoals: GoalStats,
  awayGoals: GoalStats,
  history: BTTSHistory,
  odds: number,
  bankroll: number,
  betType: 'YES' | 'NO'
): BetValidationResult {
  // Calculate probability each team scores
  const homeScoringProb = Math.min(homeGoals.scored / homeGoals.games / 2, 0.95);
  const awayScoringProb = Math.min(awayGoals.scored / awayGoals.games / 2, 0.95);
  
  // Probability both score (independent events)
  const bothScoreProb = homeScoringProb * awayScoringProb;
  
  // Historical probability
  const totalHistorical = history.yes + history.no;
  const historicalProb = betType === 'YES'
    ? history.yes / totalHistorical
    : history.no / totalHistorical;
  
  // Combine probabilities (50% calculated, 50% historical)
  let calculatedProb = betType === 'YES'
    ? bothScoreProb * 0.5 + historicalProb * 0.5
    : (1 - bothScoreProb) * 0.5 + historicalProb * 0.5;
  
  const impliedProb = calculateImpliedProbability(odds);
  const value = calculateValueBet(calculatedProb, odds);
  const edge = calculateEdge(calculatedProb, impliedProb);
  const fairOdds = calculateFairOdds(calculatedProb);
  const stake = calculateKellyStake(calculatedProb, odds, bankroll);
  const ev = calculateEV(calculatedProb, odds, stake);
  const roi = calculateExpectedROI(calculatedProb, odds);
  const recommendation = getRecommendation(value, edge);
  const sampleSize = homeGoals.games + awayGoals.games + totalHistorical;
  const confidenceLevel = getConfidenceLevel(sampleSize);
  
  return {
    impliedProbability: impliedProb,
    calculatedProbability: calculatedProb,
    valueBet: value,
    edge,
    fairOdds,
    recommendedStake: stake,
    expectedValue: ev,
    expectedROI: roi,
    recommendation,
    confidenceLevel,
  };
}

/**
 * Validate Corners bet
 */
export function validateCorners(
  homeCorners: CornerStats,
  awayCorners: CornerStats,
  line: number,
  odds: number,
  bankroll: number,
  betType: 'OVER' | 'UNDER'
): BetValidationResult {
  // Calculate expected corners
  const homeAvgFor = homeCorners.favor / homeCorners.games;
  const homeAvgAgainst = homeCorners.against / homeCorners.games;
  const awayAvgFor = awayCorners.favor / awayCorners.games;
  const awayAvgAgainst = awayCorners.against / awayCorners.games;
  
  const expectedHomeCorners = (homeAvgFor + awayAvgAgainst) / 2;
  const expectedAwayCorners = (awayAvgFor + homeAvgAgainst) / 2;
  const expectedTotalCorners = expectedHomeCorners + expectedAwayCorners;
  
  // Use Poisson distribution for corners
  const calculatedProb = betType === 'OVER'
    ? calculateOverProbability(expectedTotalCorners, line)
    : calculateUnderProbability(expectedTotalCorners, line);
  
  const impliedProb = calculateImpliedProbability(odds);
  const value = calculateValueBet(calculatedProb, odds);
  const edge = calculateEdge(calculatedProb, impliedProb);
  const fairOdds = calculateFairOdds(calculatedProb);
  const stake = calculateKellyStake(calculatedProb, odds, bankroll);
  const ev = calculateEV(calculatedProb, odds, stake);
  const roi = calculateExpectedROI(calculatedProb, odds);
  const recommendation = getRecommendation(value, edge);
  const sampleSize = homeCorners.games + awayCorners.games;
  const confidenceLevel = getConfidenceLevel(sampleSize);
  
  return {
    impliedProbability: impliedProb,
    calculatedProbability: calculatedProb,
    valueBet: value,
    edge,
    fairOdds,
    recommendedStake: stake,
    expectedValue: ev,
    expectedROI: roi,
    recommendation,
    confidenceLevel,
  };
}

/**
 * Validate Cards bet
 */
export function validateCards(
  homeCards: CardStats,
  awayCards: CardStats,
  refereeStats: RefereeStats | undefined,
  line: number,
  odds: number,
  bankroll: number,
  betType: 'OVER' | 'UNDER'
): BetValidationResult {
  // Calculate expected cards from teams
  const homeAvg = homeCards.average;
  const awayAvg = awayCards.average;
  let expectedTotalCards = homeAvg + awayAvg;
  
  // Adjust for referee if available
  if (refereeStats?.totalCardsAverage) {
    expectedTotalCards = expectedTotalCards * 0.6 + refereeStats.totalCardsAverage * 0.4;
  }
  
  // Use Poisson distribution for cards
  const calculatedProb = betType === 'OVER'
    ? calculateOverProbability(expectedTotalCards, line)
    : calculateUnderProbability(expectedTotalCards, line);
  
  const impliedProb = calculateImpliedProbability(odds);
  const value = calculateValueBet(calculatedProb, odds);
  const edge = calculateEdge(calculatedProb, impliedProb);
  const fairOdds = calculateFairOdds(calculatedProb);
  const stake = calculateKellyStake(calculatedProb, odds, bankroll);
  const ev = calculateEV(calculatedProb, odds, stake);
  const roi = calculateExpectedROI(calculatedProb, odds);
  const recommendation = getRecommendation(value, edge);
  const sampleSize = homeCards.games + awayCards.games;
  const confidenceLevel = getConfidenceLevel(sampleSize);
  
  return {
    impliedProbability: impliedProb,
    calculatedProbability: calculatedProb,
    valueBet: value,
    edge,
    fairOdds,
    recommendedStake: stake,
    expectedValue: ev,
    expectedROI: roi,
    recommendation,
    confidenceLevel,
  };
}

/**
 * Validate Asian Handicap bet
 */
export function validateAsianHandicap(
  homeStats: TeamStats,
  awayStats: TeamStats,
  handicap: number,
  odds: number,
  bankroll: number,
  betOn: 'HOME' | 'AWAY'
): BetValidationResult {
  const totalHomeGames = homeStats.wins + homeStats.draws + homeStats.losses;
  const totalAwayGames = awayStats.wins + awayStats.draws + awayStats.losses;
  
  // Calculate base probabilities
  const homeWinProb = homeStats.wins / totalHomeGames;
  const awayWinProb = awayStats.wins / totalAwayGames;
  
  // Adjust for handicap
  // This is a simplified model - in practice you'd want more sophisticated goal difference analysis
  let adjustedProb = 0;
  if (betOn === 'HOME') {
    adjustedProb = homeWinProb * (1 + handicap * 0.1);
  } else {
    adjustedProb = awayWinProb * (1 - handicap * 0.1);
  }
  
  // Normalize probability
  const calculatedProb = Math.max(0.05, Math.min(0.95, adjustedProb));
  
  const impliedProb = calculateImpliedProbability(odds);
  const value = calculateValueBet(calculatedProb, odds);
  const edge = calculateEdge(calculatedProb, impliedProb);
  const fairOdds = calculateFairOdds(calculatedProb);
  const stake = calculateKellyStake(calculatedProb, odds, bankroll);
  const ev = calculateEV(calculatedProb, odds, stake);
  const roi = calculateExpectedROI(calculatedProb, odds);
  const recommendation = getRecommendation(value, edge);
  const sampleSize = totalHomeGames + totalAwayGames;
  const confidenceLevel = getConfidenceLevel(sampleSize);
  
  return {
    impliedProbability: impliedProb,
    calculatedProbability: calculatedProb,
    valueBet: value,
    edge,
    fairOdds,
    recommendedStake: stake,
    expectedValue: ev,
    expectedROI: roi,
    recommendation,
    confidenceLevel,
  };
}
