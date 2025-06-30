
import { Settings, User, Bell, Crown } from "lucide-react";

interface DiscordUserPanelProps {
  activeUser: any;
}

const DiscordUserPanel = ({ activeUser }: DiscordUserPanelProps) => {
  return (
    <div className="h-full bg-gray-800 border-l border-gray-700 flex flex-col overflow-hidden">
      {/* User Profile */}
      <div className="p-4 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
            {activeUser.avatar ? (
              <img src={activeUser.avatar} alt={activeUser.name} className="w-12 h-12 rounded-full" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                {activeUser.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-white font-bold text-lg truncate">{activeUser.name}</div>
            <div className="text-gray-400 text-sm truncate">{activeUser.username}</div>
          </div>
        </div>
        
        {activeUser.name === 'Midjourney Bot' && (
          <div className="bg-indigo-600 text-white px-3 py-1 rounded text-sm inline-block mb-3">
            APP
          </div>
        )}

        <div className="space-y-3">
          <div>
            <h3 className="text-white font-semibold mb-1">About Me</h3>
            <p className="text-gray-400 text-sm">
              {activeUser.aboutMe}
            </p>
          </div>
          
          {activeUser.name === 'Midjourney Bot' && (
            <div>
              <a href="#" className="text-indigo-400 hover:underline text-sm break-all">
                https://docs.midjourney.com/docs/terms-of-service
              </a>
            </div>
          )}

          <div>
            <h3 className="text-white font-semibold mb-1">Created On</h3>
            <p className="text-gray-400 text-sm">{activeUser.createdOn}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 flex-shrink-0">
        {activeUser.name === 'Midjourney Bot' ? (
          <>
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded mb-2 text-sm font-medium">
              Commands
            </button>
            <button className="w-full text-gray-400 hover:text-white py-2 text-sm">
              View Full Profile
            </button>
          </>
        ) : (
          <>
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded mb-2 text-sm font-medium">
              Send Message
            </button>
            <button className="w-full text-gray-400 hover:text-white py-2 text-sm">
              View Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DiscordUserPanel;
