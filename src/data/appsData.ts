export interface DiscordApp {
  id: string;
  name: string;
  category: 'games' | 'entertainment' | 'moderation' | 'social' | 'utilities';
  categoryLabel: string;
  description: string;
  bannerGradient: string;
  iconBg: string;
  iconEmoji: string;
  featured?: boolean;
  isPromoted?: boolean;
}

export const discordApps: DiscordApp[] = [
  {
    id: 'wordle',
    name: 'Wordle',
    category: 'games',
    categoryLabel: 'Games',
    description: 'Enjoy Wordle from New York Times Games! You have 6 chances to guess a 5 letter word.',
    bannerGradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    iconBg: '#538d4e',
    iconEmoji: '🟩',
    featured: true,
    isPromoted: true
  },
  {
    id: 'watch-together',
    name: 'Watch Together',
    category: 'social',
    categoryLabel: 'Social',
    description: 'Create and watch a playlist of YouTube videos with your friends in real-time.',
    bannerGradient: 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)',
    iconBg: '#ff0000',
    iconEmoji: '▶️',
    featured: true,
    isPromoted: true
  },
  {
    id: 'poker-night',
    name: 'Poker Night',
    category: 'games',
    categoryLabel: 'Games',
    description: 'Play Texas Hold\'em poker with your friends. Bet, bluff, and win big!',
    bannerGradient: 'linear-gradient(135deg, #2d5016 0%, #1a3009 100%)',
    iconBg: '#2d5016',
    iconEmoji: '🃏',
    featured: true,
    isPromoted: true
  },
  {
    id: 'chess-in-the-park',
    name: 'Chess in the Park',
    category: 'games',
    categoryLabel: 'Games',
    description: 'Play chess with friends in a beautiful park setting. Multiple game modes available.',
    bannerGradient: 'linear-gradient(135deg, #5d4e37 0%, #3d3225 100%)',
    iconBg: '#5d4e37',
    iconEmoji: '♟️',
    featured: true,
    isPromoted: true
  },
  {
    id: 'sketch-heads',
    name: 'Sketch Heads',
    category: 'games',
    categoryLabel: 'Games',
    description: 'Draw and guess with friends! Take turns drawing while others try to guess.',
    bannerGradient: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%)',
    iconBg: '#ff6b6b',
    iconEmoji: '🎨',
    featured: true
  },
  {
    id: 'blazing-8s',
    name: 'Blazing 8s',
    category: 'games',
    categoryLabel: 'Games',
    description: 'A fast-paced card game similar to UNO. Match colors and numbers to win!',
    bannerGradient: 'linear-gradient(135deg, #ff8c00 0%, #ff6600 100%)',
    iconBg: '#ff8c00',
    iconEmoji: '🔥',
    featured: true
  },
  {
    id: 'putt-party',
    name: 'Putt Party',
    category: 'games',
    categoryLabel: 'Games',
    description: 'Mini golf with friends! Compete on creative courses and become the champion.',
    bannerGradient: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
    iconBg: '#22c55e',
    iconEmoji: '⛳',
    featured: true
  },
  {
    id: 'gartic-phone',
    name: 'Gartic Phone',
    category: 'games',
    categoryLabel: 'Games',
    description: 'The telephone game meets drawing! Watch hilarious transformations unfold.',
    bannerGradient: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
    iconBg: '#a855f7',
    iconEmoji: '📞',
    featured: true
  },
  {
    id: 'music-bot',
    name: 'Jukebox',
    category: 'entertainment',
    categoryLabel: 'Entertainment',
    description: 'Play music from Spotify, YouTube, and more. Create playlists and queue songs.',
    bannerGradient: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
    iconBg: '#7c3aed',
    iconEmoji: '🎵',
    featured: true
  },
  {
    id: 'trivia-night',
    name: 'Trivia Night',
    category: 'games',
    categoryLabel: 'Games',
    description: 'Test your knowledge with thousands of trivia questions across many categories.',
    bannerGradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    iconBg: '#fbbf24',
    iconEmoji: '❓',
    featured: true
  },
  {
    id: 'poll-maker',
    name: 'Poll Maker',
    category: 'utilities',
    categoryLabel: 'Utilities',
    description: 'Create polls and surveys easily. Get instant feedback from your community.',
    bannerGradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    iconBg: '#06b6d4',
    iconEmoji: '📊'
  },
  {
    id: 'mod-tools',
    name: 'Mod Tools',
    category: 'moderation',
    categoryLabel: 'Moderation',
    description: 'Advanced moderation tools for managing your server. Auto-mod and logging.',
    bannerGradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    iconBg: '#3b82f6',
    iconEmoji: '🛡️'
  }
];

export const appCategories = [
  { id: 'featured', label: 'Featured' },
  { id: 'games', label: 'Games' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'moderation', label: 'Moderation and Tools' },
  { id: 'social', label: 'Social' },
  { id: 'utilities', label: 'Utilities' },
];
