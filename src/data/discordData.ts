export interface Message {
  id: number;
  user: string;
  time: string;
  content: string;
  isBot?: boolean;
  hasButton?: boolean;
  buttonText?: string;
  hasButtons?: boolean;
  buttons?: string[];
  hasInvite?: boolean;
  hasLinks?: boolean;
  links?: string[];
  isWelcome?: boolean;
  hasReactions?: boolean;
  reactions?: { emoji: string; count: number }[];
}

export interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice' | 'dm';
  messages: Message[];
  description?: string;
  serverId?: number;
}

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  aboutMe: string;
  createdOn: string;
  status?: string;
  members?: string;
}

export interface Server {
  id: number;
  name: string;
  icon: string;
  textChannels: Channel[];
  voiceChannels: { name: string; users: number }[];
}

// Server 2 - Gaming Server
const gamingChannels: Channel[] = [
  {
    id: 'game-announcements',
    name: '📢-announcements',
    type: 'text',
    serverId: 2,
    description: 'Gaming announcements and updates',
    messages: [
      {
        id: 1,
        user: 'GameBot',
        time: '9:00 AM',
        content: 'Welcome to the Gaming Server! 🎮\n\nThis is the start of our gaming community.',
        isBot: true,
        isWelcome: true
      },
      {
        id: 2,
        user: 'Admin',
        time: '10:30 AM',
        content: '🎉 **NEW TOURNAMENT ANNOUNCED!**\n\nJoin our weekly tournament this Friday at 8 PM EST!\n\nPrizes:\n🥇 $100 Steam Gift Card\n🥈 $50 Steam Gift Card\n🥉 $25 Steam Gift Card\n\nRegister in #tournament-signup!',
        isBot: false,
        hasReactions: true,
        reactions: [{ emoji: '🎮', count: 45 }, { emoji: '🔥', count: 32 }, { emoji: '💰', count: 28 }]
      }
    ]
  },
  {
    id: 'general-gaming',
    name: 'general-gaming',
    type: 'text',
    serverId: 2,
    description: 'General gaming discussion',
    messages: [
      {
        id: 1,
        user: 'Gamer1',
        time: '2:15 PM',
        content: 'Anyone playing the new RPG that just came out? The graphics are insane! 🎮',
        isBot: false,
        hasReactions: true,
        reactions: [{ emoji: '🎮', count: 8 }, { emoji: '🔥', count: 5 }]
      },
      {
        id: 2,
        user: 'Gamer2',
        time: '2:18 PM',
        content: 'Yes! I\'ve been grinding for 6 hours straight. The skill tree is so complex but rewarding.',
        isBot: false
      },
      {
        id: 3,
        user: 'Gamer3',
        time: '2:20 PM',
        content: 'I\'m still stuck on the first boss 😅 Any tips?',
        isBot: false,
        hasReactions: true,
        reactions: [{ emoji: '😅', count: 12 }, { emoji: '💪', count: 6 }]
      }
    ]
  },
  {
    id: 'tournament-signup',
    name: '🏆-tournament-signup',
    type: 'text',
    serverId: 2,
    description: 'Sign up for tournaments',
    messages: [
      {
        id: 1,
        user: 'TournamentBot',
        time: '8:00 AM',
        content: 'Tournament Registration is now OPEN! 🏆\n\nReact with ⚔️ to join the tournament!',
        isBot: true,
        hasReactions: true,
        reactions: [{ emoji: '⚔️', count: 156 }]
      }
    ]
  }
];

// Server 3 - Music Server
const musicChannels: Channel[] = [
  {
    id: 'music-announcements',
    name: '🎵-announcements',
    type: 'text',
    serverId: 3,
    description: 'Music community announcements',
    messages: [
      {
        id: 1,
        user: 'MusicBot',
        time: '7:00 AM',
        content: 'Welcome to the Music Lovers Community! 🎵\n\nShare your favorite tracks and discover new music!',
        isBot: true,
        isWelcome: true
      },
      {
        id: 2,
        user: 'DJ_Mike',
        time: '11:45 AM',
        content: '🎧 **LIVE MIX SESSION TONIGHT!**\n\nJoin me at 9 PM for a 2-hour electronic music mix!\n\nGenres: House, Techno, Progressive\n\nSee you in the voice channel! 🔊',
        isBot: false,
        hasReactions: true,
        reactions: [{ emoji: '🎧', count: 67 }, { emoji: '🔊', count: 45 }, { emoji: '🎵', count: 89 }]
      }
    ]
  },
  {
    id: 'song-recommendations',
    name: '🎼-song-recommendations',
    type: 'text',
    serverId: 3,
    description: 'Share and discover new music',
    messages: [
      {
        id: 1,
        user: 'MusicLover1',
        time: '1:30 PM',
        content: 'Just discovered this amazing indie band! Check out "Midnight Dreams" by Aurora Waves 🌙✨',
        isBot: false,
        hasReactions: true,
        reactions: [{ emoji: '🎵', count: 15 }, { emoji: '❤️', count: 8 }]
      },
      {
        id: 2,
        user: 'VinylCollector',
        time: '1:35 PM',
        content: 'Classic recommendation: Pink Floyd - "Wish You Were Here" 🎸\n\nIf you haven\'t heard this masterpiece, you\'re missing out!',
        isBot: false,
        hasReactions: true,
        reactions: [{ emoji: '🎸', count: 23 }, { emoji: '🔥', count: 18 }]
      }
    ]
  },
  {
    id: 'music-production',
    name: '🎛️-music-production',
    type: 'text',
    serverId: 3,
    description: 'Music production tips and tricks',
    messages: [
      {
        id: 1,
        user: 'Producer1',
        time: '3:45 PM',
        content: 'Working on a new track! Any tips for getting that warm analog sound in digital? 🎹',
        isBot: false
      },
      {
        id: 2,
        user: 'StudioMaster',
        time: '3:50 PM',
        content: 'Try using some tape saturation plugins and vintage EQ emulations. Also, don\'t forget about harmonic distortion!',
        isBot: false,
        hasReactions: true,
        reactions: [{ emoji: '🎯', count: 12 }, { emoji: '🙏', count: 7 }]
      }
    ]
  }
];

// Midjourney Server (Server 4) - keep existing channels
const midjourneyChannels: Channel[] = [
  {
    id: 'general',
    name: 'general',
    type: 'text',
    serverId: 4,
    description: 'General discussion for the community',
    messages: [
      {
        id: 1,
        user: 'ModBot',
        time: '12:00 PM',
        content: 'Welcome to #general! This is where our community comes together to chat about anything and everything.',
        isBot: true,
        isWelcome: true
      },
      {
        id: 2,
        user: 'User1',
        time: '3:45 PM',
        content: 'Hey everyone! Just joined the community. Really excited to be here and learn from all of you.',
        isBot: false,
        hasReactions: true,
        reactions: [{ emoji: '👋', count: 5 }, { emoji: '🎉', count: 3 }]
      },
      {
        id: 3,
        user: 'User2',
        time: '3:47 PM',
        content: 'Welcome @User1! Make sure to check out the rules channel and introduce yourself properly.',
        isBot: false
      },
      {
        id: 4,
        user: 'User3',
        time: '3:50 PM',
        content: 'Has anyone tried the new features that were released yesterday? The updates look amazing!',
        isBot: false,
        hasReactions: true,
        reactions: [{ emoji: '🔥', count: 12 }, { emoji: '💯', count: 8 }]
      }
    ]
  },
  {
    id: 'official-links',
    name: '🔗-official-links',
    type: 'text',
    serverId: 4,
    description: 'Official links and resources',
    messages: [
      {
        id: 1,
        user: 'Admin',
        time: '8:15 PM',
        content: 'Welcome to #🔗-official-links!\n\nThis is the start of the #🔗-official-links channel.',
        isBot: true,
        isWelcome: true
      },
      {
        id: 2,
        user: 'ProjectBot',
        time: '8:16 PM',
        content: 'Those are the only official links for our project, do not interact with others.',
        isBot: true,
        hasReactions: true,
        reactions: [{ emoji: '📌', count: 45 }]
      },
      {
        id: 3,
        user: 'ProjectBot',
        time: '8:17 PM',
        content: 'Official Resources:\n\n🌐 Website: https://ourproject.com\n📚 Documentation: https://docs.ourproject.com\n💻 GitHub: https://github.com/ourproject\n📱 Mobile App: https://app.ourproject.com\n🔗 Secondary: https://backup.ourproject.com',
        isBot: true,
        hasLinks: true,
        links: ['https://ourproject.com', 'https://docs.ourproject.com', 'https://github.com/ourproject'],
        hasReactions: true,
        reactions: [{ emoji: '🔗', count: 89 }, { emoji: '📌', count: 156 }, { emoji: '✅', count: 234 }]
      }
    ]
  },
  {
    id: 'newbies',
    name: 'newbies',
    type: 'text',
    serverId: 4,
    description: 'Help and support for new members',
    messages: [
      {
        id: 1,
        user: 'HelperBot',
        time: '10:30 AM',
        content: 'Welcome to #newbies! This is a safe space for beginners to ask questions and get help from our community.',
        isBot: true,
        isWelcome: true
      },
      {
        id: 2,
        user: 'User4',
        time: '2:35 PM',
        content: 'Hi everyone! I\'m completely new to this. Can someone explain the basics of how everything works?',
        isBot: false
      },
      {
        id: 3,
        user: 'User5',
        time: '2:37 PM',
        content: 'Welcome! I\'d recommend starting with our beginner guide: https://docs.ourproject.com/beginners\n\nAlso, don\'t hesitate to ask questions here - we\'re all very friendly!',
        isBot: false,
        hasReactions: true,
        reactions: [{ emoji: '❤️', count: 8 }, { emoji: '🙏', count: 4 }]
      },
      {
        id: 4,
        user: 'User6',
        time: '2:40 PM',
        content: 'I second that! Also make sure to read the #rules channel when you have a chance.',
        isBot: false
      }
    ]
  },
  {
    id: 'showcase',
    name: '🎨-showcase',
    type: 'text',
    serverId: 4,
    description: 'Show off your creations and projects',
    messages: [
      {
        id: 1,
        user: 'ShowcaseBot',
        time: '9:00 AM',
        content: 'Welcome to #🎨-showcase! Share your amazing creations and projects here!',
        isBot: true,
        isWelcome: true
      },
      {
        id: 2,
        user: 'User7',
        time: '1:15 PM',
        content: 'Just finished my latest project! Check it out: https://myproject.dev\n\nBuilt with the latest technologies and really proud of how it turned out!',
        isBot: false,
        hasReactions: true,
        reactions: [{ emoji: '🔥', count: 23 }, { emoji: '💯', count: 18 }, { emoji: '🎉', count: 15 }]
      },
      {
        id: 3,
        user: 'User8',
        time: '1:20 PM',
        content: 'Wow @User7, that design is absolutely stunning! The animations are so smooth. Did you use any specific framework?',
        isBot: false
      },
      {
        id: 4,
        user: 'User7',
        time: '1:22 PM',
        content: 'Thanks! I used React with Framer Motion for the animations. The design system is custom built with Tailwind CSS.',
        isBot: false,
        hasReactions: true,
        reactions: [{ emoji: '👍', count: 12 }]
      }
    ]
  },
  {
    id: 'rules',
    name: '🚨-rules',
    type: 'text',
    serverId: 4,
    description: 'Community rules and guidelines',
    messages: [
      {
        id: 1,
        user: 'Admin',
        time: '12:00 PM',
        content: 'Welcome to #🚨-rules!\n\nPlease read and follow all community guidelines.',
        isBot: true,
        isWelcome: true
      },
      {
        id: 2,
        user: 'Admin',
        time: '12:01 PM',
        content: '📋 **COMMUNITY RULES**\n\n1. **Be Respectful** - Treat everyone with kindness and respect\n2. **No Spam** - Keep conversations meaningful and on-topic\n3. **No NSFW Content** - Keep all content appropriate for all ages\n4. **Use Appropriate Channels** - Post in the right channels for your content\n5. **No Self-Promotion** - Don\'t advertise without permission\n6. **Help Others** - Be supportive of fellow community members\n7. **Follow Discord ToS** - All Discord Terms of Service apply\n\nViolation of these rules may result in warnings, mutes, or bans.',
        isBot: true,
        hasReactions: true,
        reactions: [{ emoji: '📌', count: 156 }, { emoji: '✅', count: 89 }, { emoji: '👍', count: 234 }]
      }
    ]
  },
  {
    id: 'announcements',
    name: '📢-announcements',
    type: 'text',
    serverId: 4,
    description: 'Important announcements and updates',
    messages: [
      {
        id: 1,
        user: 'Admin',
        time: '9:00 AM',
        content: 'Welcome to #📢-announcements! Stay updated with the latest news and updates.',
        isBot: true,
        isWelcome: true
      },
      {
        id: 2,
        user: 'Admin',
        time: '2:30 PM',
        content: '🎉 **BIG UPDATE INCOMING!**\n\nWe\'re excited to announce major new features coming next week:\n\n• Enhanced user interface\n• New collaboration tools\n• Improved performance\n• Mobile app updates\n\nStay tuned for more details!',
        isBot: true,
        hasReactions: true,
        reactions: [{ emoji: '🎉', count: 89 }, { emoji: '🔥', count: 156 }, { emoji: '👀', count: 234 }]
      }
    ]
  }
];

export const servers: Server[] = [
  {
    id: 2,
    name: "Gaming Hub",
    icon: "🔥",
    textChannels: gamingChannels,
    voiceChannels: [
      { name: "Gaming Lounge", users: 5 },
      { name: "Tournament Arena", users: 12 },
      { name: "Chill Gaming", users: 3 },
      { name: "Strategy Games", users: 0 }
    ]
  },
  {
    id: 3,
    name: "Music Lovers",
    icon: "🎵",
    textChannels: musicChannels,
    voiceChannels: [
      { name: "Music Listening", users: 8 },
      { name: "DJ Booth", users: 15 },
      { name: "Jam Session", users: 4 },
      { name: "Production Talk", users: 2 }
    ]
  },
  {
    id: 4,
    name: "Midjourney",
    icon: "/lovable-uploads/ca8cef9f-1434-48e7-a22c-29adeb14325a.png",
    textChannels: midjourneyChannels,
    voiceChannels: [
      { name: "General", users: 0 },
      { name: "🎨 Creative Session", users: 3 },
      { name: "Help Desk", users: 1 }
    ]
  }
];

// Legacy exports for backward compatibility
export const channels: Channel[] = midjourneyChannels;

export const dmUsers: User[] = [
  {
    id: 'user1',
    name: 'User1',
    username: 'User1#1234',
    avatar: '',
    aboutMe: 'Frontend developer passionate about React and TypeScript. Always learning new technologies!',
    createdOn: 'Mar 15, 2023',
    status: 'online'
  },
  {
    id: 'user2', 
    name: 'User2',
    username: 'User2#5678',
    avatar: '',
    aboutMe: 'Full-stack developer with 5 years of experience. Love building scalable web applications.',
    createdOn: 'Jan 8, 2022'
  },
  {
    id: 'user3',
    name: 'User3',
    username: 'User3#9012',
    avatar: '',
    aboutMe: 'UI/UX Designer who codes. Creating beautiful and functional user experiences.',
    createdOn: 'Jul 22, 2023'
  },
  {
    id: 'midjourney-bot',
    name: 'Midjourney Bot',
    username: 'Midjourney Bot#9282',
    avatar: '/lovable-uploads/ca8cef9f-1434-48e7-a22c-29adeb14325a.png',
    aboutMe: 'Generate an image based on a text prompt in under 60 seconds using the /imagine command!',
    createdOn: 'Jan 29, 2022'
  }
];

export const dmMessages: Record<string, Message[]> = {
  'user1': [
    {
      id: 1,
      user: 'User1',
      time: '4:30 PM',
      content: 'Hey! How\'s your project going?',
      isBot: false
    },
    {
      id: 2,
      user: 'You',
      time: '4:32 PM',
      content: 'Going well! Just implemented some new features.',
      isBot: false
    },
    {
      id: 3,
      user: 'User1',
      time: '4:33 PM',
      content: 'That\'s awesome! Would love to see it when you\'re ready to share.',
      isBot: false
    }
  ],
  'user2': [
    {
      id: 1,
      user: 'User2',
      time: '2:15 PM',
      content: 'Thanks for helping me with that React question earlier!',
      isBot: false
    },
    {
      id: 2,
      user: 'You',
      time: '2:17 PM',
      content: 'No problem! Always happy to help.',
      isBot: false
    }
  ],
  'user3': [
    {
      id: 1,
      user: 'User3',
      time: '11:45 AM',
      content: 'Check out this cool design I found: https://dribbble.com/shots/example',
      isBot: false
    },
    {
      id: 2,
      user: 'You',
      time: '11:50 AM',
      content: 'Wow, that\'s really clean! I love the color scheme.',
      isBot: false
    }
  ],
  'midjourney-bot': [
    {
      id: 1,
      user: 'Midjourney Bot',
      time: '2:13 AM',
      content: 'Heya! Welcome to Midjourney. I\'m here to help you get started.',
      isBot: true
    },
    {
      id: 2,
      user: 'Midjourney Bot',
      time: '',
      content: 'First, you\'ll need to accept our terms of service. You can review them at https://docs.midjourney.com/docs/terms-of-service',
      isBot: true,
      hasButton: true,
      buttonText: 'Accept TOS'
    },
    {
      id: 3,
      user: 'Midjourney Bot',
      time: '',
      content: 'Let\'s explore the basics of Midjourney',
      isBot: true,
      hasButtons: true,
      buttons: ['Start Tutorial', 'Skip']
    },
    {
      id: 4,
      user: 'Midjourney Bot',
      time: '',
      content: 'Visit the Midjourney server to be inspired by what others are creating, get support, or learn more about creation.',
      isBot: true,
      hasInvite: true
    },
    {
      id: 5,
      user: 'Midjourney Bot',
      time: '',
      content: 'We hope you enjoy Midjourney! You can always learn more by visiting https://docs.midjourney.com/ or get answers to your questions by using /ask',
      isBot: true
    }
  ]
};
