import type { Tournament } from '@/lib/types';

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
