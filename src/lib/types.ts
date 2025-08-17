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
  playerAvatar: string;
  kills: number;
  points: number;
};

export type Transaction = {
  id: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  date: string;
  details?: string;
};
