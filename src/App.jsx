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
function AppContent() {
  const { activeChat, setActiveChatId } = useChat();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMobileChat, setShowMobileChat] = useState(Boolean(window.innerWidth < 768 && activeChat));

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
    if (!activeChat) {
      setShowMobileChat(false);
    } else if (isMobile) {
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
      {/* Navigation Rail (Left rail on desktop, bottom bar on mobile) */}
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
