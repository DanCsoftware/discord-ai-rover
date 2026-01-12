import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface RoverAvatarProps {
  size?: "sm" | "md" | "lg";
  isThinking?: boolean;
  showVerified?: boolean;
  className?: string;
}

const RoverAvatar = ({ 
  size = "md", 
  isThinking = false, 
  showVerified = true,
  className 
}: RoverAvatarProps) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-12 h-12"
  };

  const iconScale = {
    sm: 0.6,
    md: 1,
    lg: 1.2
  };

  return (
    <div className={cn("relative", className)}>
      {/* Main Avatar */}
      <div 
        className={cn(
          sizeClasses[size],
          "rounded-full bg-gradient-to-br from-[#5865F2] via-[#7289DA] to-[#9B59B6]",
          "flex items-center justify-center shadow-lg",
          "border-2 border-[#5865F2]/30",
          isThinking && "animate-rover-pulse"
        )}
      >
        {/* Discord Clyde-style Robot Face */}
        <svg 
          viewBox="0 0 24 24" 
          fill="none"
          style={{ 
            width: `${18 * iconScale[size]}px`, 
            height: `${18 * iconScale[size]}px` 
          }}
        >
          {/* Main head shape */}
          <path 
            d="M12 4C7.5 4 5 6.5 5 10C5 12.5 6 14 7.5 15C7.5 15.8 8 17 12 17C16 17 16.5 15.8 16.5 15C18 14 19 12.5 19 10C19 6.5 16.5 4 12 4Z"
            fill="white"
          />
          {/* Left ear */}
          <path 
            d="M5 10C3.5 10 3 9 3 8C3 7 3.5 6.5 5 7"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Right ear */}
          <path 
            d="M19 10C20.5 10 21 9 21 8C21 7 20.5 6.5 19 7"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Left eye */}
          <circle cx="9" cy="10" r="1.8" fill="#36393f"/>
          {/* Right eye */}
          <circle cx="15" cy="10" r="1.8" fill="#36393f"/>
        </svg>
      </div>

      {/* Verified Badge */}
      {showVerified && (
        <div 
          className={cn(
            "absolute -bottom-0.5 -right-0.5 bg-[#5865F2] rounded-full",
            "flex items-center justify-center border-2 border-[#36393f]",
            size === "sm" ? "w-3 h-3" : "w-4 h-4"
          )}
        >
          <Check 
            className="text-white" 
            style={{ 
              width: size === "sm" ? 6 : 10, 
              height: size === "sm" ? 6 : 10 
            }} 
            strokeWidth={3}
          />
        </div>
      )}

      {/* Thinking Ring Animation */}
      {isThinking && (
        <div 
          className={cn(
            "absolute inset-0 rounded-full border-2 border-[#5865F2]",
            "animate-ping opacity-75"
          )}
        />
      )}
    </div>
  );
};

export default RoverAvatar;
