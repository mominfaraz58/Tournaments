
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

export type User = {
  id: string;
  fullName: string;
  inGameName: string;
  uid: string;
  mobileNo: string;
  password?: string;
  referralCode: string;
  winnings: number;
  funds: number;
  matchesWon: number;
};


export type LeaderboardEntry = {
  rank: number;
  playerName: string;
  points: number;
};

export type Transaction = {
  id: string;
  userId: string;
  type: 'deposit' | 'withdraw' | 'convert' | 'entry_fee' | 'win';
  amount: number;
  date: string;
  details?: string;
  status: 'pending' | 'approved' | 'rejected';
};
