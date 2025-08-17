export type Tournament = {
  id: string;
  name: string;
  prizePool: number;
  entryFee: number;
  format: string;
  date: string;
  imageUrl: string;
  imageHint: string;
};

export type LeaderboardEntry = {
  rank: number;
  playerName: string;
  points: number;
};

export type Transaction = {
  id: string;
  type: 'deposit' | 'withdraw' | 'convert';
  amount: number;
  date: string;
  details?: string;
};
