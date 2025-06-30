import { useState } from 'react';
import { channels, dmUsers, dmMessages, Channel, User, Message } from '@/data/discordData';

export const useDiscordState = () => {
  const [activeChannel, setActiveChannel] = useState<string>('official-links');
  const [activeChannelType, setActiveChannelType] = useState<'text' | 'dm'>('text');
  const [isDMView, setIsDMView] = useState<boolean>(false);
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
      setIsDMView(false);
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
      setIsDMView(true);
      setActiveUser(user);
    }
  };

  const switchToDMView = () => {
    setIsDMView(true);
    setActiveChannelType('dm');
    // Keep current active channel if it's a DM, otherwise switch to first DM
    if (activeChannelType !== 'dm') {
      const firstDM = dmUsers[0];
      if (firstDM) {
        setActiveChannel(firstDM.id);
        setActiveUser(firstDM);
      }
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
    isDMView,
    switchToChannel,
    switchToDM,
    switchToDMView,
    getCurrentMessages,
    getCurrentChannelName
  };
};
