import type { User } from '@/lib/types';

// This is a placeholder for a real user database.
// In a real application, you would fetch this data from your database.
const users: User[] = [
  { id: 'user-1', name: 'Galaxy', winnings: 1556 },
  { id: 'user-2', name: 'TEHZEEB HAIDER', winnings: 795 },
  { id: 'user-3', name: 'NBL ADIL', winnings: 782 },
  { id: 'user-4', name: 'Hashim Qureshi', winnings: 608 },
  { id: 'user-5', name: 'Ali Jutt', winnings: 595 },
  { id: 'user-6', name: 'waseh', winnings: 515 },
  { id: 'user-7', name: 'abubakar', winnings: 501 },
  { id: 'user-8', name: 'KAMRAN', winnings: 485 },
  { id: 'user-9', name: 'Gareeboo', winnings: 440 },
  { id: 'user-10', name: 'LOƧT☯ƧAI3I♪7', winnings: 360 },
  { id: 'user-11', name: 'RT | SKYE ☁', winnings: 355 },
  { id: 'user-12', name: 'Player 12', winnings: 320 },
  { id: 'user-13', name: 'Player 13', winnings: 310 },
  { id: 'user-14', name: 'Player 14', winnings: 290 },
  { id: 'user-15', name: 'Player 15', winnings: 250 },
  { id: 'user-16', name: 'Player 16', winnings: 220 },
  { id: 'user-17', name: 'Player 17', winnings: 180 },
  { id: 'user-18', name: 'Player 18', winnings: 150 },
  { id: 'user-19', name: 'Player 19', winnings: 120 },
  { id: 'user-20', name: 'Player 20', winnings: 100 },
];

// In a real application, you would query your database to get users sorted by winnings.
export async function getLeaderboard() {
  const sortedUsers = [...users].sort((a, b) => b.winnings - a.winnings);
  return sortedUsers.slice(0, 20).map((user, index) => ({
    rank: index + 1,
    playerName: user.name,
    points: user.winnings,
  }));
}
