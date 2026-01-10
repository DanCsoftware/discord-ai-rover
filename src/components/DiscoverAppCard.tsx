import { DiscordApp } from "@/data/appsData";

interface DiscoverAppCardProps {
  app: DiscordApp;
  onClick?: () => void;
}

const DiscoverAppCard = ({ app, onClick }: DiscoverAppCardProps) => {
  return (
    <div
      onClick={onClick}
      className="rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg group"
      style={{ backgroundColor: 'hsl(var(--discord-bg-secondary))' }}
    >
      {/* Banner */}
      <div 
        className="h-32 relative flex items-center justify-center"
        style={{ background: app.bannerGradient }}
      >
        {/* Large centered icon */}
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
          style={{ backgroundColor: app.iconBg }}
        >
          {app.iconEmoji}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Small icon + name row */}
        <div className="flex items-center gap-3 mb-2">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
            style={{ backgroundColor: app.iconBg }}
          >
            {app.iconEmoji}
          </div>
          <div className="min-w-0">
            <h3 
              className="font-semibold text-sm truncate"
              style={{ color: 'hsl(var(--discord-text-normal))' }}
            >
              {app.name}
            </h3>
            <p 
              className="text-xs"
              style={{ color: 'hsl(var(--discord-text-muted))' }}
            >
              {app.categoryLabel}
            </p>
          </div>
        </div>

        {/* Description */}
        <p 
          className="text-xs line-clamp-2"
          style={{ color: 'hsl(var(--discord-text-muted))' }}
        >
          {app.description}
        </p>
      </div>
    </div>
  );
};

export default DiscoverAppCard;
