import { useState, useEffect } from "react";
import RoverAvatar from "./RoverAvatar";
import { cn } from "@/lib/utils";

const roverHints = [
  '"help me navigate to privacy settings"',
  '"search for messages about crypto"',
  '"summarize the last 30 minutes"',
  '"check if this link is safe"',
  '"find gaming servers near me"',
  '"fact check this claim"',
  '"recommend servers about art"',
  '"show server health report"',
];

const RoverHintCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsSliding(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % roverHints.length);
        setIsSliding(false);
      }, 300);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-[#2b2d31]/50 border-t border-[#3f4147]/50">
      <RoverAvatar size="sm" showVerified={false} />
      
      <div className="overflow-hidden flex-1">
        <span 
          className={cn(
            "inline-block text-xs transition-all duration-300 ease-out",
            isSliding 
              ? "translate-x-8 opacity-0" 
              : "translate-x-0 opacity-100"
          )}
        >
          <span className="text-[#b5bac1]">try: </span>
          <span className="text-[#dbdee1] italic">{roverHints[currentIndex]}</span>
        </span>
      </div>
    </div>
  );
};

export default RoverHintCarousel;
