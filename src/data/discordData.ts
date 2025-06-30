
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
}

export interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice' | 'dm';
  messages: Message[];
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

export const channels: Channel[] = [
  {
    id: 'general',
    name: 'general',
    type: 'text',
    messages: [
      {
        id: 1,
        user: 'User1',
        time: '3:45 PM',
        content: 'Hey everyone! Welcome to the general channel. This is where we chat about anything and everything.',
        isBot: false
      },
      {
        id: 2,
        user: 'User2',
        time: '3:47 PM',
        content: 'Thanks! Excited to be here. What kind of projects are you all working on?',
        isBot: false
      },
      {
        id: 3,
        user: 'User3',
        time: '3:50 PM',
        content: 'Currently building a React app. Check out this cool component library: https://ui.shadcn.com/',
        isBot: false
      }
    ]
  },
  {
    id: 'newbies',
    name: 'newbies',
    type: 'text',
    messages: [
      {
        id: 1,
        user: 'ModeratorBot',
        time: '2:30 PM',
        content: 'Welcome to the newbies channel! This is a safe space for beginners to ask questions.',
        isBot: true
      },
      {
        id: 2,
        user: 'User4',
        time: '2:35 PM',
        content: 'Hi! I\'m new to React. Can someone explain what props are?',
        isBot: false
      },
      {
        id: 3,
        user: 'User5',
        time: '2:37 PM',
        content: 'Props are like arguments you pass to functions, but for React components! Here\'s a good tutorial: https://react.dev/learn/passing-props-to-a-component',
        isBot: false
      }
    ]
  },
  {
    id: 'showcase',
    name: '🎨-showcase',
    type: 'text',
    messages: [
      {
        id: 1,
        user: 'User6',
        time: '1:15 PM',
        content: 'Just finished my portfolio website! Check it out: https://myportfolio.dev',
        isBot: false
      },
      {
        id: 2,
        user: 'User7',
        time: '1:20 PM',
        content: 'Wow, that design is amazing! Did you use Tailwind CSS?',
        isBot: false
      },
      {
        id: 3,
        user: 'User6',
        time: '1:22 PM',
        content: 'Yes! Tailwind makes styling so much easier. Also used Framer Motion for animations.',
        isBot: false
      }
    ]
  },
  {
    id: 'prompt-help',
    name: 'prompt-help',
    type: 'text',
    messages: [
      {
        id: 1,
        user: 'AIHelper',
        time: '12:00 PM',
        content: 'Need help with AI prompts? Share your prompts here and get feedback from the community!',
        isBot: true
      },
      {
        id: 2,
        user: 'User8',
        time: '12:05 PM',
        content: 'How can I make ChatGPT write better code? My prompts seem too vague.',
        isBot: false
      },
      {
        id: 3,
        user: 'User9',
        time: '12:07 PM',
        content: 'Be specific! Include the programming language, framework, and exact requirements. Also mention coding style preferences.',
        isBot: false
      }
    ]
  }
];

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
