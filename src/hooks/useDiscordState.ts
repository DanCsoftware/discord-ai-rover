import { useState } from 'react';
import { channels, dmUsers, dmMessages, Channel, User, Message } from '@/data/discordData';

export const useDiscordState = () => {
  const [activeChannel, setActiveChannel] = useState<string>('official-links');
  const [activeChannelType, setActiveChannelType] = useState<'text' | 'dm'>('text');
  const [activeUser, setActiveUser] = useState<User>({
    id: 'server',
    name: 'Midjourney Official',
    username: '',
    avatar: '/lovable-uploads/ca8cef9f-1434-48e7-a22c-29adeb14325a.png',
    aboutMe: 'Official Midjourney Discord Server',
    createdOn: 'Jan 29, 2022'
  });

  const switchToChannel = (channelId: string) => {
    const channel = channels.find(c => c.id === channelId);
    if (channel) {
      setActiveChannel(channelId);
      setActiveChannelType('text');
      setActiveUser({
        id: 'server',
        name: 'Midjourney Official',
        username: '',
        avatar: '/lovable-uploads/ca8cef9f-1434-48e7-a22c-29adeb14325a.png',
        aboutMe: 'Official Midjourney Discord Server',
        createdOn: 'Jan 29, 2022'
      });
    }
  };

  const switchToDM = (userId: string) => {
    const user = dmUsers.find(u => u.id === userId);
    if (user) {
      setActiveChannel(userId);
      setActiveChannelType('dm');
      setActiveUser(user);
    }
  };

  const getCurrentMessages = (): Message[] => {
    if (activeChannelType === 'text') {
      const channel = channels.find(c => c.id === activeChannel);
      return channel?.messages || [];
    } else {
      return dmMessages[activeChannel] || [];
    }
  };

  const getCurrentChannelName = (): string => {
    if (activeChannelType === 'text') {
      const channel = channels.find(c => c.id === activeChannel);
      return channel?.name || '';
    } else {
      return activeUser.name;
    }
  };

  return {
    activeChannel,
    activeChannelType,
    activeUser,
    switchToChannel,
    switchToDM,
    getCurrentMessages,
    getCurrentChannelName
  };
};
