import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiUser, FiLogOut, FiX } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import GlassCard from '../common/GlassCard';
import GlassInput from '../common/GlassInput';
import GlassButton from '../common/GlassButton';
import LoadingSpinner from '../common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { useSocket } from '../../context/SocketContext';

const ChatSidebar = ({ isOpen, onToggle, className = '', style = {} }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user, logout } = useAuth();
  const { users, loading, fetchUsers, setActiveChat, activeChat } = useChat();
  const { onlineUsers } = useSocket();

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserSelect = (selectedUser) => {
    setActiveChat({
      id: selectedUser._id,
      type: 'user',
      name: selectedUser.username,
      avatar: selectedUser.avatar,
      isOnline: onlineUsers.has(selectedUser._id)
    });
    
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      onToggle();
    }
  };

  const sidebarVariants = {
    open: {
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    closed: {
      x: '-100%',
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    }
  };

  // Check if mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const overlayStyle = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(2px)',
    WebkitBackdropFilter: 'blur(2px)',
    zIndex: 40,
    display: isMobile ? 'block' : 'none',
  };

  const sidebarStyle = {
    position: isMobile ? 'fixed' : 'relative',
    top: 0,
    left: 0,
    height: '100%',
    width: '320px',
    zIndex: isMobile ? 50 : 'auto',
    ...style,
  };

  const cardStyle = {
    height: '100%',
    padding: '24px',
    borderRadius: isMobile ? '0' : '16px',
    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
    border: isMobile ? 'none' : '1px solid rgba(255, 255, 255, 0.15)',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  };

  const userInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const avatarStyle = {
    width: '48px',
    height: '48px',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  };

  const usernameStyle = {
    color: 'white',
    fontWeight: '600',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    margin: 0,
  };

  const emailStyle = {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '14px',
    margin: 0,
  };

  const actionsStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const searchStyle = {
    marginBottom: '24px',
  };

  const usersListStyle = {
    flex: 1,
    overflowY: 'auto',
  };

  const titleStyle = {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '16px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    margin: '0 0 16px 0',
  };

  const loadingStyle = {
    display: 'flex',
    justifyContent: 'center',
    padding: '32px 0',
  };

  const emptyStyle = {
    textAlign: 'center',
    padding: '32px 0',
    color: 'rgba(255, 255, 255, 0.6)',
  };

  const userListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const closeButtonStyle = {
    padding: '8px',
    color: 'rgba(255, 255, 255, 0.6)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'color 0.3s ease',
    display: isMobile ? 'block' : 'none',
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            style={overlayStyle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        variants={sidebarVariants}
        animate={isOpen ? 'open' : 'closed'}
        style={sidebarStyle}
        className={className}
      >
        <GlassCard style={cardStyle}>
          {/* Header */}
          <div style={headerStyle}>
            <div style={userInfoStyle}>
              <div style={avatarStyle}>
                <FiUser color="white" size={20} />
              </div>
              <div>
                <h2 style={usernameStyle}>{user?.username}</h2>
                <p style={emailStyle}>{user?.email}</p>
              </div>
            </div>
            
            <div style={actionsStyle}>
              <GlassButton
                onClick={logout}
                variant="secondary"
                size="small"
                style={{ padding: '8px' }}
              >
                <FiLogOut size={16} />
              </GlassButton>
              
              <button
                onClick={onToggle}
                style={closeButtonStyle}
                onMouseEnter={(e) => e.target.style.color = 'white'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
              >
                <FiX size={20} />
              </button>
            </div>
          </div>

          {/* Search */}
          <div style={searchStyle}>
            <GlassInput
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={FiSearch}
            />
          </div>

          {/* Users List */}
          <div style={usersListStyle}>
            <h3 style={titleStyle}>
              Contacts ({filteredUsers.length})
            </h3>

            {loading ? (
              <div style={loadingStyle}>
                <LoadingSpinner />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div style={emptyStyle}>
                {searchTerm ? 'No users found' : 'No users available'}
              </div>
            ) : (
              <div style={userListStyle}>
                {filteredUsers.map((chatUser) => {
                  const isOnline = onlineUsers.has(chatUser._id);
                  const isActive = activeChat?.id === chatUser._id;
                  
                  const userCardStyle = {
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: isActive 
                      ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))'
                      : 'transparent',
                    borderColor: isActive ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                    boxShadow: isActive ? '0 0 20px rgba(59, 130, 246, 0.3)' : 'none',
                  };

                  const userAvatarStyle = {
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    position: 'relative',
                  };

                  const onlineIndicatorStyle = {
                    position: 'absolute',
                    bottom: '-4px',
                    right: '-4px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    background: isOnline ? '#10b981' : '#6b7280',
                    boxShadow: isOnline ? '0 0 8px rgba(16, 185, 129, 0.5)' : 'none',
                  };

                  const userInfoContainerStyle = {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  };

                  const userDetailsStyle = {
                    flex: 1,
                    minWidth: 0,
                  };

                  const userNameStyle = {
                    color: 'white',
                    fontWeight: '500',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    margin: 0,
                  };

                  const userStatusStyle = {
                    color: isOnline ? '#34d399' : 'rgba(255, 255, 255, 0.7)',
                    fontSize: '14px',
                    margin: 0,
                  };
                  
                  return (
                    <motion.div
                      key={chatUser._id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <GlassCard
                        variant={isActive ? 'button' : 'default'}
                        style={userCardStyle}
                        onClick={() => handleUserSelect(chatUser)}
                        animate={false}
                      >
                        <div style={userInfoContainerStyle}>
                          <div style={userAvatarStyle}>
                            {chatUser.avatar ? (
                              <img
                                src={chatUser.avatar}
                                alt={chatUser.username}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  borderRadius: '50%',
                                  objectFit: 'cover',
                                }}
                              />
                            ) : (
                              <FiUser color="white" size={20} />
                            )}
                            
                            {/* Online indicator */}
                            <div style={onlineIndicatorStyle} />
                          </div>
                          
                          <div style={userDetailsStyle}>
                            <h4 style={userNameStyle}>
                              {chatUser.username}
                            </h4>
                            <p style={userStatusStyle}>
                              {isOnline ? (
                                'Online'
                              ) : (
                                `Last seen ${formatDistanceToNow(new Date(chatUser.lastSeen), { addSuffix: true })}`
                              )}
                            </p>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </GlassCard>
      </motion.div>
    </>
  );
};

export default ChatSidebar;