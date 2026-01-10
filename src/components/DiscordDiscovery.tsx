import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { servers, serverDiscoveryData } from "@/data/discordData";
import { discordApps, appCategories } from "@/data/appsData";
import DiscordDiscoverSidebar from "./DiscordDiscoverSidebar";
import DiscoverServerCard from "./DiscoverServerCard";
import DiscoverAppCard from "./DiscoverAppCard";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DiscordDiscoveryProps {
  onServerClick: (serverId: number) => void;
}

const DiscordDiscovery = ({ onServerClick }: DiscordDiscoveryProps) => {
  const [activeTab, setActiveTab] = useState<'apps' | 'servers' | 'quests'>('servers');
  const [activeCategory, setActiveCategory] = useState<string>('home');
  const [activeAppCategory, setActiveAppCategory] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState('');

  const serverCategories = [
    { id: 'home', label: 'Home' },
    { id: 'gaming', label: 'Gaming' },
    { id: 'music', label: 'Music' },
    { id: 'entertainment', label: 'Entertainment' },
    { id: 'science', label: 'Science & Tech' },
    { id: 'education', label: 'Education' },
    { id: 'student', label: 'Student Hubs' },
  ];

  // Get current categories based on active tab
  const getCurrentCategories = () => {
    if (activeTab === 'servers') return serverCategories;
    if (activeTab === 'apps') return appCategories;
    return [];
  };

  const currentCategories = getCurrentCategories();

  const getCategoryForServer = (serverId: number): string[] => {
    const categoryMap: Record<number, string[]> = {
      2: ['gaming', 'entertainment'],
      3: ['music', 'entertainment'],
      4: ['science', 'entertainment'],
      5: ['science', 'education'],
      6: ['entertainment'],
      7: ['education'],
      8: ['entertainment'],
      9: ['education', 'science'],
    };
    return categoryMap[serverId] || [];
  };

  const filteredServers = servers.filter(server => {
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!server.name.toLowerCase().includes(query)) {
        return false;
      }
    }
    
    // Filter by category
    if (activeCategory !== 'home') {
      const serverCats = getCategoryForServer(server.id);
      if (!serverCats.includes(activeCategory)) {
        return false;
      }
    }
    
    return true;
  });

  const filteredApps = discordApps.filter(app => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!app.name.toLowerCase().includes(query)) {
        return false;
      }
    }
    
    if (activeAppCategory !== 'featured') {
      if (app.category !== activeAppCategory) {
        return false;
      }
    }
    
    return true;
  });

  const promotedApps = discordApps.filter(app => app.isPromoted);
  const puzzleGames = discordApps.filter(app => app.category === 'games' && !app.isPromoted);

  return (
    <div className="flex h-full" style={{ backgroundColor: 'hsl(var(--discord-bg-primary))' }}>
      {/* Discovery Sidebar */}
      <DiscordDiscoverSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Category Navigation - Only show for Apps and Servers */}
        {activeTab !== 'quests' && (
          <div 
            className="flex items-center justify-between px-6 py-3 flex-shrink-0"
            style={{ borderBottom: '1px solid hsl(var(--discord-bg-quaternary))' }}
          >
            <div className="flex items-center gap-6">
              {currentCategories.map((category) => {
                const isActive = activeTab === 'servers' 
                  ? activeCategory === category.id 
                  : activeAppCategory === category.id;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      if (activeTab === 'servers') {
                        setActiveCategory(category.id);
                      } else {
                        setActiveAppCategory(category.id);
                      }
                    }}
                    className="text-sm font-medium pb-1 transition-colors relative"
                    style={{
                      color: isActive 
                        ? 'hsl(var(--discord-text-normal))' 
                        : 'hsl(var(--discord-text-muted))',
                      borderBottom: isActive 
                        ? '2px solid hsl(var(--discord-text-normal))' 
                        : '2px solid transparent'
                    }}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div 
              className="flex items-center gap-2 px-3 py-1.5 rounded-md"
              style={{ backgroundColor: 'hsl(var(--discord-bg-tertiary))' }}
            >
              <Search className="w-4 h-4" style={{ color: 'hsl(var(--discord-text-muted))' }} />
              <input
                type="text"
                placeholder={activeTab === 'servers' ? "Explore servers" : "Search apps"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-40"
                style={{ color: 'hsl(var(--discord-text-normal))' }}
              />
            </div>
          </div>
        )}

        {/* Quests Header */}
        {activeTab === 'quests' && (
          <div 
            className="flex items-center px-6 py-3 flex-shrink-0"
            style={{ borderBottom: '1px solid hsl(var(--discord-bg-quaternary))' }}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" style={{ color: '#fbbf24' }} />
              <button
                className="text-sm font-medium pb-1"
                style={{
                  color: 'hsl(var(--discord-text-normal))',
                  borderBottom: '2px solid hsl(var(--discord-text-normal))'
                }}
              >
                All Quests
              </button>
            </div>
          </div>
        )}

        {/* Scrollable Content */}
        <ScrollArea className="flex-1">
          {activeTab === 'servers' && (
            <div className="p-6">
              {/* Hero Banner */}
              <div 
                className="relative rounded-xl overflow-hidden mb-8 p-8"
                style={{
                  background: 'linear-gradient(135deg, #5865f2 0%, #3b44c4 40%, #1e1f22 100%)',
                  minHeight: '200px'
                }}
              >
                <div className="relative z-10 max-w-lg">
                  <h1 
                    className="text-3xl font-bold mb-3 uppercase tracking-wide"
                    style={{ color: 'white' }}
                  >
                    Find your community on Discord
                  </h1>
                  <p 
                    className="text-base opacity-90"
                    style={{ color: 'rgba(255,255,255,0.8)' }}
                  >
                    From gaming, to music, to learning, there's a place for you.
                  </p>
                </div>
                
                {/* Decorative elements */}
                <div 
                  className="absolute top-4 right-8 w-32 h-32 rounded-full opacity-20"
                  style={{ background: 'radial-gradient(circle, #eb459e 0%, transparent 70%)' }}
                />
                <div 
                  className="absolute bottom-4 right-32 w-20 h-20 rounded-full opacity-15"
                  style={{ background: 'radial-gradient(circle, #57f287 0%, transparent 70%)' }}
                />
              </div>

              {/* Featured Servers Section */}
              <div className="mb-6">
                <h2 
                  className="text-lg font-bold mb-4"
                  style={{ color: 'hsl(var(--discord-text-normal))' }}
                >
                  {activeCategory === 'home' ? 'Featured Communities' : serverCategories.find(c => c.id === activeCategory)?.label}
                </h2>

                {filteredServers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredServers.map((server) => {
                      const discoveryMeta = serverDiscoveryData[server.id];
                      if (!discoveryMeta) return null;
                      
                      return (
                        <DiscoverServerCard
                          key={server.id}
                          server={server}
                          discoveryMeta={discoveryMeta}
                          onClick={() => onServerClick(server.id)}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div 
                    className="text-center py-12"
                    style={{ color: 'hsl(var(--discord-text-muted))' }}
                  >
                    <p>No servers found in this category.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'apps' && (
            <div className="p-6">
              {/* Hero Banner for Apps */}
              <div 
                className="relative rounded-xl overflow-hidden mb-8 p-8"
                style={{
                  background: 'linear-gradient(135deg, #5865f2 0%, #7c3aed 40%, #1e1f22 100%)',
                  minHeight: '200px'
                }}
              >
                <div className="relative z-10 max-w-lg">
                  <h1 
                    className="text-3xl font-bold mb-3 uppercase tracking-wide"
                    style={{ color: 'white' }}
                  >
                    Find things to do together
                  </h1>
                  <p 
                    className="text-base opacity-90"
                    style={{ color: 'rgba(255,255,255,0.8)' }}
                  >
                    Bring the fun to your hangouts with apps for games, music, creative tools, and more.
                  </p>
                </div>
                
                {/* Decorative elements */}
                <div 
                  className="absolute top-4 right-8 w-32 h-32 rounded-full opacity-20"
                  style={{ background: 'radial-gradient(circle, #fbbf24 0%, transparent 70%)' }}
                />
                <div 
                  className="absolute bottom-4 right-32 w-20 h-20 rounded-full opacity-15"
                  style={{ background: 'radial-gradient(circle, #22c55e 0%, transparent 70%)' }}
                />
              </div>

              {/* Promoted Games Section */}
              {activeAppCategory === 'featured' && (
                <>
                  <div className="mb-6">
                    <h2 
                      className="text-lg font-bold mb-4"
                      style={{ color: 'hsl(var(--discord-text-normal))' }}
                    >
                      Promoted Games
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {promotedApps.map((app) => (
                        <DiscoverAppCard key={app.id} app={app} />
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h2 
                      className="text-lg font-bold mb-4"
                      style={{ color: 'hsl(var(--discord-text-normal))' }}
                    >
                      Puzzle Games
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {puzzleGames.slice(0, 4).map((app) => (
                        <DiscoverAppCard key={app.id} app={app} />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Filtered Apps */}
              {activeAppCategory !== 'featured' && (
                <div className="mb-6">
                  <h2 
                    className="text-lg font-bold mb-4"
                    style={{ color: 'hsl(var(--discord-text-normal))' }}
                  >
                    {appCategories.find(c => c.id === activeAppCategory)?.label || 'Apps'}
                  </h2>
                  {filteredApps.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {filteredApps.map((app) => (
                        <DiscoverAppCard key={app.id} app={app} />
                      ))}
                    </div>
                  ) : (
                    <div 
                      className="text-center py-12"
                      style={{ color: 'hsl(var(--discord-text-muted))' }}
                    >
                      <p>No apps found in this category.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'quests' && (
            <div className="p-6">
              {/* Hero Banner for Quests */}
              <div 
                className="relative rounded-xl overflow-hidden mb-8"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed 0%, #5865f2 30%, #3b82f6 60%, #1e1f22 100%)',
                  minHeight: '280px'
                }}
              >
                {/* Decorative stars */}
                <div className="absolute inset-0 overflow-hidden">
                  <div 
                    className="absolute top-6 left-12 text-2xl opacity-60"
                    style={{ color: '#fbbf24' }}
                  >
                    ✦
                  </div>
                  <div 
                    className="absolute top-16 right-24 text-lg opacity-40"
                    style={{ color: '#fbbf24' }}
                  >
                    ★
                  </div>
                  <div 
                    className="absolute bottom-12 left-32 text-sm opacity-30"
                    style={{ color: '#fbbf24' }}
                  >
                    ✦
                  </div>
                  <div 
                    className="absolute top-24 left-1/3 text-xl opacity-50"
                    style={{ color: '#a855f7' }}
                  >
                    ★
                  </div>
                  <div 
                    className="absolute bottom-20 right-1/4 text-2xl opacity-40"
                    style={{ color: '#60a5fa' }}
                  >
                    ✦
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full py-12 px-8 text-center">
                  <h1 
                    className="text-4xl font-bold mb-6 uppercase tracking-wide"
                    style={{ color: 'white' }}
                  >
                    Quests have moved!
                  </h1>
                  <button 
                    className="px-6 py-3 rounded-md font-semibold text-sm transition-all hover:opacity-90"
                    style={{ 
                      backgroundColor: 'white', 
                      color: '#1e1f22'
                    }}
                  >
                    View Quests
                  </button>
                </div>
              </div>

              {/* Info Section */}
              <div className="text-center max-w-xl mx-auto">
                <h2 
                  className="text-xl font-bold mb-4"
                  style={{ color: 'hsl(var(--discord-text-normal))' }}
                >
                  Quests have moved!
                </h2>
                <p 
                  className="text-sm mb-4 leading-relaxed"
                  style={{ color: 'hsl(var(--discord-text-muted))' }}
                >
                  We've moved Quests to their own dedicated space! You can now find all your quests, 
                  rewards, and progress tracking in one convenient location. Click the button above 
                  or use the link below to access Quest Home.
                </p>
                <a 
                  href="#"
                  className="text-sm font-medium hover:underline"
                  style={{ color: '#5865f2' }}
                >
                  Go to Quest Home
                </a>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default DiscordDiscovery;
