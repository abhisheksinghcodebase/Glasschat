import { useState, useEffect } from 'react';
import ChatSidebar from '../components/chat/ChatSidebar';
import ChatHeader from '../components/chat/ChatHeader';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';
import { useChat } from '../context/ChatContext';

const ChatPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { activeChat } = useChat();

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const containerStyle = {
    height: '100vh',
    display: 'flex',
    overflow: 'hidden',
    position: 'relative',
  };

  const backgroundStyle = {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)',
  };

  const overlayStyle = {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 50%, rgba(236, 72, 153, 0.1) 100%)',
  };

  const blobStyle = (size, position, color, delay = 0) => ({
    position: 'absolute',
    ...position,
    width: `${size}px`,
    height: `${size}px`,
    background: color,
    borderRadius: '50%',
    mixBlendMode: 'multiply',
    filter: 'blur(48px)',
    animation: `blob 7s infinite`,
    animationDelay: `${delay}s`,
  });

  const gridStyle = {
    position: 'absolute',
    inset: 0,
    opacity: 0.05,
    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
    backgroundSize: '50px 50px',
  };

  const mainChatStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    zIndex: 10,
  };

  const messagesAreaStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
  };

  return (
    <div style={containerStyle}>
      {/* Enhanced animated background */}
      <div style={backgroundStyle}>
        <div style={overlayStyle} />
        
        {/* Animated background elements */}
        <div style={blobStyle(384, { top: 0, left: 0 }, 'rgba(59, 130, 246, 0.05)', 0)} />
        <div style={blobStyle(384, { top: 0, right: 0 }, 'rgba(139, 92, 246, 0.05)', 2)} />
        <div style={blobStyle(384, { bottom: 0, left: '50%', transform: 'translateX(-50%)' }, 'rgba(236, 72, 153, 0.05)', 4)} />
        <div style={blobStyle(288, { bottom: 0, right: 0 }, 'rgba(99, 102, 241, 0.05)', 6)} />
        
        {/* Grid pattern overlay */}
        <div style={gridStyle} />
      </div>

      {/* Sidebar */}
      <ChatSidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        style={{ position: 'relative', zIndex: 10 }}
      />

      {/* Main chat area */}
      <div style={mainChatStyle}>
        {/* Chat header */}
        <ChatHeader
          activeChat={activeChat}
          onToggleSidebar={toggleSidebar}
        />

        {/* Messages area */}
        <div style={messagesAreaStyle}>
          <MessageList activeChat={activeChat} />
          <MessageInput activeChat={activeChat} />
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default ChatPage;