
import { useState } from "react";
import { Send, Plus, Gift, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Message } from "@/data/discordData";

interface DiscordChatProps {
  channelName: string;
  messages: Message[];
  activeUser: any;
  channelType: 'text' | 'dm';
}

const DiscordChat = ({ channelName, messages, activeUser, channelType }: DiscordChatProps) => {
  const [message, setMessage] = useState("");

  const getChannelIcon = () => {
    if (channelType === 'dm' && activeUser.avatar) {
      return <img src={activeUser.avatar} alt={channelName} className="w-4 h-4 rounded-full" />;
    }
    return <span className="text-gray-400">#</span>;
  };

  const getMessageAvatar = (msgUser: string, isBot?: boolean) => {
    if (msgUser === 'Midjourney Bot' || isBot) {
      return <img src="/lovable-uploads/ca8cef9f-1434-48e7-a22c-29adeb14325a.png" alt="Bot" className="w-6 h-6 rounded-full" />;
    }
    return <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
      {msgUser.charAt(0)}
    </div>;
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-700">
      {/* Chat Header */}
      <div className="h-12 border-b border-gray-600 flex items-center px-4">
        <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center mr-3">
          {getChannelIcon()}
        </div>
        <span className="text-white font-semibold">{channelName}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Profile Section - only show for DMs */}
        {channelType === 'dm' && (
          <div className="flex flex-col items-center text-center py-8">
            <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center mb-4">
              {activeUser.avatar ? (
                <img src={activeUser.avatar} alt={activeUser.name} className="w-16 h-16 rounded-full" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                  {activeUser.name.charAt(0)}
                </div>
              )}
            </div>
            <h2 className="text-white text-2xl font-bold">{activeUser.name}</h2>
            <p className="text-gray-400">{activeUser.username}</p>
            <p className="text-gray-400 mt-2">This is the beginning of your direct message history with {activeUser.name}.</p>
            <div className="flex space-x-2 mt-4">
              <Button variant="destructive" size="sm">Mute</Button>
              <Button variant="secondary" size="sm">View Profile</Button>
              <Button variant="secondary" size="sm">Report</Button>
            </div>
            <div className="text-gray-500 text-sm mt-4">September 14, 2024</div>
          </div>
        )}

        {/* Channel Header - only show for text channels */}
        {channelType === 'text' && (
          <div className="flex flex-col items-start py-8">
            <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center mb-4">
              <span className="text-gray-400 text-2xl">#</span>
            </div>
            <h2 className="text-white text-2xl font-bold">Welcome to #{channelName}!</h2>
            <p className="text-gray-400 mt-2">This is the start of the #{channelName} channel.</p>
            <div className="text-gray-500 text-sm mt-4">September 14, 2024</div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
              {getMessageAvatar(msg.user, msg.isBot)}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-white font-medium">{msg.user}</span>
                {msg.isBot && <span className="bg-indigo-600 text-white text-xs px-1.5 py-0.5 rounded">BOT</span>}
                {msg.time && <span className="text-gray-500 text-xs">{msg.time}</span>}
              </div>
              <div className="text-gray-300 text-sm leading-relaxed">{msg.content}</div>
              
              {msg.hasButton && (
                <Button className="mt-2 bg-green-600 hover:bg-green-700 text-white" size="sm">
                  {msg.buttonText}
                </Button>
              )}
              
              {msg.hasButtons && (
                <div className="flex space-x-2 mt-2">
                  {msg.buttons?.map((button, index) => (
                    <Button 
                      key={index} 
                      className={index === 0 ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 hover:bg-gray-500"} 
                      size="sm"
                    >
                      {button}
                    </Button>
                  ))}
                </div>
              )}

              {msg.hasInvite && (
                <div className="mt-3 bg-gray-800 rounded-lg p-4 max-w-md">
                  <div className="text-white text-sm mb-2">You've Been Invited To Join A Server</div>
                  <div className="flex items-center space-x-3">
                    <img src="/lovable-uploads/ca8cef9f-1434-48e7-a22c-29adeb14325a.png" alt="Server" className="w-12 h-12 rounded-lg" />
                    <div className="flex-1">
                      <div className="text-white font-medium">Midjourney ✅</div>
                      <div className="text-gray-400 text-sm">🟢 858,103 Online ⚫ 20,943,714 Members</div>
                    </div>
                    <Button className="bg-green-600 hover:bg-green-700 text-white" size="sm">
                      Join
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4">
        <div className="bg-gray-600 rounded-lg flex items-center px-4 py-3">
          <button className="mr-3 p-1 hover:bg-gray-500 rounded">
            <Plus className="w-5 h-5 text-gray-400" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Message ${channelType === 'text' ? '#' + channelName : '@' + channelName}`}
            className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
          />
          <div className="flex items-center space-x-2 ml-3">
            <button className="p-1 hover:bg-gray-500 rounded">
              <Gift className="w-5 h-5 text-gray-400" />
            </button>
            <button className="p-1 hover:bg-gray-500 rounded">
              <Smile className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscordChat;
