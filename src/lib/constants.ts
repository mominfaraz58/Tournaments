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
  {
    id: 'lahore-legends-4',
    name: 'Lone Wolf (1v1)',
    prizePool: 15000,
    entryFee: 750,
    format: '4v4 Squad Battle',
    date: 'August 20, 2024',
    imageUrl: 'https://placehold.co/400x400.png',
    imageHint: 'one on one purple',
  },
];

export const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, playerName: 'ProGamerPK', playerAvatar: '/avatars/01.png', kills: 152, points: 4800 },
  { rank: 2, playerName: 'LahoriLion', playerAvatar: '/avatars/02.png', kills: 145, points: 4650 },
  { rank: 3, playerName: 'KarachiKing', playerAvatar: '/avatars/03.png', kills: 138, points: 4500 },
  { rank: 4, playerName: 'Sniper_Sultan', playerAvatar: '/avatars/04.png', kills: 130, points: 4300 },
  { rank: 5, playerName: 'SilentKiller', playerAvatar: '/avatars/05.png', kills: 125, points: 4150 },
  { rank: 6, playerName: 'PindiPhantom', playerAvatar: '/avatars/01.png', kills: 120, points: 4000 },
  { rank: 7, playerName: 'QuettaGladiator', playerAvatar: '/avatars/02.png', kills: 115, points: 3850 },
  { rank: 8, playerName: 'HeadshotMaster', playerAvatar: '/avatars/03.png', kills: 110, points: 3700 },
];
