import type { Tournament, LeaderboardEntry } from '@/lib/types';

export const TOURNAMENTS: Tournament[] = [
  {
    id: 'vf-clash-1',
    name: 'Battle Royale (Solo)',
    prizePool: 10000,
    entryFee: 500,
    format: '4v4 Squad Battle',
    date: 'July 30, 2024',
    imageUrl: 'https://placehold.co/400x400.png',
    imageHint: 'solo warrior purple',
  },
  {
    id: 'lone-wolf-2',
    name: 'Battle Royale (Duo/Team)',
    prizePool: 5000,
    entryFee: 250,
    format: '1v1 Solo Duel',
    date: 'August 5, 2024',
    imageUrl: 'https://placehold.co/400x400.png',
    imageHint: 'team battle blue',
  },
  {
    id: 'squad-wars-3',
    name: 'Battle Royale (Squad/Team)',
    prizePool: 25000,
    entryFee: 1000,
    format: '4v4 Squad Battle',
    date: 'August 15, 2024',
    imageUrl: 'https://placehold.co/400x400.png',
    imageHint: 'squad battle red',
  },
];

export const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, playerName: 'Galaxy', points: 1556 },
  { rank: 2, playerName: 'TEHZEEB HAIDER', points: 795 },
  { rank: 3, playerName: 'NBL ADIL', points: 782 },
  { rank: 4, playerName: 'Hashim Qureshi', points: 608 },
  { rank: 5, playerName: 'Ali Jutt', points: 595 },
  { rank: 6, playerName: 'waseh', points: 515 },
  { rank: 7, playerName: 'abubakar', points: 501 },
  { rank: 8, playerName: 'KAMRAN', points: 485 },
  { rank: 9, playerName: 'Gareeboo', points: 440 },
  { rank: 10, playerName: 'LOƧT☯ƧAI3I♪7', points: 360 },
  { rank: 11, playerName: 'RT | SKYE ☁', points: 355 },
];
