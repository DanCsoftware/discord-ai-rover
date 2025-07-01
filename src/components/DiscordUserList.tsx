import { Crown, Settings } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface User {
  id: string;
  name: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  activity?: string;
  role?: 'owner' | 'admin' | 'moderator' | 'member';
}

interface DiscordUserListProps {
  users: User[];
  className?: string;
}

const DiscordUserList = ({ users, className = "" }: DiscordUserListProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'idle': return 'bg-yellow-400';
      case 'dnd': return 'bg-red-400';
      default: return 'bg-gray-500';
    }
  };

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-3 h-3 text-yellow-400" />;
      case 'admin':
        return <Settings className="w-3 h-3 text-red-400" />;
      case 'moderator':
        return <Settings className="w-3 h-3 text-blue-400" />;
      default:
        return null;
    }
  };

  const groupedUsers = users.reduce((acc, user) => {
    const key = user.role === 'owner' ? 'Owner' : 
                user.role === 'admin' ? 'Admins' :
                user.role === 'moderator' ? 'Moderators' : 
                user.status === 'online' ? 'Online' : 'Offline';
    
    if (!acc[key]) acc[key] = [];
    acc[key].push(user);
    return acc;
  }, {} as Record<string, User[]>);

  return (
    <div className={`bg-gray-800 border-l border-gray-700 flex flex-col ${className}`}>
      <div className="p-4 flex-shrink-0">
        <h3 className="text-white font-semibold text-sm mb-4">
          Members — {users.length}
        </h3>
      </div>
      
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="px-4 pb-4 space-y-4">
            {Object.entries(groupedUsers).map(([groupName, groupUsers]) => (
              <div key={groupName}>
                <h4 className="text-gray-400 text-xs uppercase font-semibold mb-2 flex items-center">
                  {groupName} — {groupUsers.length}
                </h4>
                
                <div className="space-y-1">
                  {groupUsers.map((user) => (
                    <div key={user.id} className="flex items-center space-x-3 px-2 py-1 rounded hover:bg-gray-700 cursor-pointer">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-800 ${getStatusColor(user.status)}`}></div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1">
                          <span className="text-white text-sm font-medium truncate">{user.name}</span>
                          {getRoleIcon(user.role)}
                        </div>
                        {user.activity && (
                          <div className="text-gray-400 text-xs truncate">{user.activity}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default DiscordUserList;
