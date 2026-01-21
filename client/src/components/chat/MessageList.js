import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBubble from './MessageBubble';
import LoadingSpinner from '../common/LoadingSpinner';
import { useChat } from '../../context/ChatContext';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';

const MessageList = ({ activeChat }) => {
  const { messages, loading } = useChat();
  const { markMessageAsRead } = useSocket();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mark messages as read when they come into view
  useEffect(() => {
    if (messages.length > 0 && activeChat && user) {
      const unreadMessages = messages.filter(msg => 
        !msg.isRead && 
        msg.sender._id !== user.id && 
        (msg.receiver === user.id || msg.receiver?._id === user.id)
      );

      unreadMessages.forEach(msg => {
        markMessageAsRead(msg._id);
      });
    }
  }, [messages, activeChat, markMessageAsRead, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Group messages by date for better organization
  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(message => {
      const date = new Date(message.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const formatDateHeader = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  const containerStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    scrollBehavior: 'smooth',
    '@media (max-width: 768px)': {
      padding: '12px 8px',
      gap: '2px',
    },
    '@media (max-width: 480px)': {
      padding: '8px 4px',
    }
  };

  const emptyStateStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    textAlign: 'center',
  };

  const emptyIconStyle = {
    width: '80px',
    height: '80px',
    margin: '0 auto 24px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
  };

  const welcomeStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.7)',
  };

  const welcomeIconStyle = {
    width: '120px',
    height: '120px',
    margin: '0 auto 32px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(15px)',
  };

  const dateHeaderStyle = {
    textAlign: 'center',
    margin: '16px 0',
    position: 'relative',
  };

  const dateTextStyle = {
    display: 'inline-block',
    background: 'rgba(0, 0, 0, 0.7)',
    color: 'rgba(255, 255, 255, 0.9)',
    padding: '6px 16px',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: '600',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
    '@media (max-width: 480px)': {
      padding: '4px 12px',
      fontSize: '11px',
    }
  };

  if (!activeChat) {
    return (
      <div style={welcomeStyle}>
        <div>
          <div style={welcomeIconStyle}>
            <svg
              width="60"
              height="60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '600',
            marginBottom: '12px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            margin: '0 0 12px 0',
          }}>
            Welcome to GlassChat
          </h3>
          <p style={{
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.6)',
            margin: 0,
          }}>
            Select a conversation to start messaging
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(messages);
  const sortedDates = Object.keys(messageGroups).sort((a, b) => new Date(a) - new Date(b));

  return (
    <div 
      ref={containerRef}
      style={containerStyle}
    >
      {messages.length === 0 ? (
        <div style={emptyStateStyle}>
          <div>
            <div style={emptyIconStyle}>
              <svg
                width="40"
                height="40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
            </div>
            <p style={{
              fontSize: '18px',
              fontWeight: '500',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '8px',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              margin: '0 0 8px 0',
            }}>
              No messages yet
            </p>
            <p style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.6)',
              margin: 0,
            }}>
              Start the conversation with {activeChat.name}!
            </p>
          </div>
        </div>
      ) : (
        <AnimatePresence initial={false}>
          {sortedDates.map(date => (
            <div key={date}>
              {/* Date header */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={dateHeaderStyle}
              >
                <span style={dateTextStyle}>
                  {formatDateHeader(date)}
                </span>
              </motion.div>

              {/* Messages for this date */}
              {messageGroups[date].map((message, index) => {
                const isLastInGroup = index === messageGroups[date].length - 1;
                const isLastOverall = date === sortedDates[sortedDates.length - 1] && isLastInGroup;
                
                return (
                  <MessageBubble
                    key={message._id}
                    message={message}
                    isLast={isLastOverall}
                    showAvatar={true}
                  />
                );
              })}
            </div>
          ))}
        </AnimatePresence>
      )}
      
      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;