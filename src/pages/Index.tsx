
import DiscordSidebar from "@/components/DiscordSidebar";
import DiscordChat from "@/components/DiscordChat";
import DiscordUserPanel from "@/components/DiscordUserPanel";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useDiscordState } from "@/hooks/useDiscordState";

const Index = () => {
  const {
    activeChannel,
    activeChannelType, 
    activeUser,
    switchToChannel,
    switchToDM,
    getCurrentMessages,
    getCurrentChannelName
  } = useDiscordState();

  return (
    <div className="h-screen bg-gray-900 flex overflow-hidden">
      <ResizablePanelGroup direction="horizontal" className="w-full">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <DiscordSidebar 
            onChannelClick={switchToChannel}
            onDMClick={switchToDM}
            activeChannel={activeChannel}
            activeChannelType={activeChannelType}
          />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={60} minSize={40}>
          <DiscordChat 
            channelName={getCurrentChannelName()}
            messages={getCurrentMessages()}
            activeUser={activeUser}
            channelType={activeChannelType}
          />
        </ResizablePanel>
        
        <ResizableHandle withHandle className="hidden lg:flex" />
        
        <ResizablePanel defaultSize={20} minSize={0} maxSize={25} className="hidden lg:block">
          <DiscordUserPanel activeUser={activeUser} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Index;
