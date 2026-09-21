import React, { useState, useEffect } from 'react';
import { ChatProvider, useChat } from './context/ChatContext';
import NavigationRail from './components/layout/NavigationRail';
import SidebarList from './components/layout/SidebarList';
import ChatArea from './components/chat/ChatArea';
import StatusStoryViewer from './components/status/StatusStoryViewer';
import CreateStatusModal from './components/status/CreateStatusModal';
import CallOverlay from './components/calls/CallOverlay';
import NewChatModal from './components/modals/NewChatModal';
import SettingsModal from './components/settings/SettingsModal';
import UsernameOnboardingModal from './components/modals/UsernameOnboardingModal';
import { ChevronLeft } from 'lucide-react';

function AppContent() {
  const { activeChat, setActiveChatId } = useChat();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMobileChat, setShowMobileChat] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setShowMobileChat(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile && activeChat) {
      setShowMobileChat(true);
    }
  }, [activeChat, isMobile]);

  return (
    <div
      style={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        backgroundColor: 'var(--bg-root)',
        color: 'var(--text-primary)',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Mobile Back Header Button if in Chat */}
      {isMobile && showMobileChat && (
        <button
          onClick={() => setShowMobileChat(false)}
          style={{
            position: 'absolute',
            top: '14px',
            left: '12px',
            zIndex: 60,
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-sidebar-hover)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* Navigation Rail (Leftmost) */}
      {(!isMobile || !showMobileChat) && <NavigationRail />}

      {/* Sidebar List (Chats, Status, Channels, Calls) */}
      {(!isMobile || !showMobileChat) && <SidebarList />}

      {/* Main Chat Workspace */}
      {(!isMobile || showMobileChat) && <ChatArea />}

      {/* Global Modals & Overlays */}
      <StatusStoryViewer />
      <CreateStatusModal />
      <CallOverlay />
      <NewChatModal />
      <SettingsModal />
      <UsernameOnboardingModal />
    </div>
  );
}

export default function App() {
  return (
    <ChatProvider>
      <AppContent />
    </ChatProvider>
  );
}
