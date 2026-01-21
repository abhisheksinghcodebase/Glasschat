import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isYesterday } from 'date-fns';
import { FiDownload, FiImage, FiFile, FiCheck, FiCheckCircle, FiCopy, FiMoreHorizontal } from 'react-icons/fi';
import GlassCard from '../common/GlassCard';
import { useAuth } from '../../context/AuthContext';

const MessageBubble = ({ message, isLast, showAvatar = false }) => {
  const { user } = useAuth();
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);
  const isOwn = message.sender._id === user?.id;

  const handleFileDownload = () => {
    if (message.fileUrl) {
      const link = document.createElement('a');
      link.href = message.fileUrl;
      link.download = message.fileName || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCopyMessage = async () => {
    if (message.content) {
      try {
        await navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy message:', err);
      }
    }
  };

  const formatMessageTime = (date) => {
    const messageDate = new Date(date);
    if (isToday(messageDate)) {
      return format(messageDate, 'HH:mm');
    } else if (isYesterday(messageDate)) {
      return `Yesterday ${format(messageDate, 'HH:mm')}`;
    } else {
      return format(messageDate, 'MMM dd, HH:mm');
    }
  };

  const renderMessageContent = () => {
    switch (message.messageType) {
      case 'image':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <motion.div
              style={{ position: 'relative', cursor: 'pointer' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <img
                src={message.fileUrl}
                alt="Shared image"
                style={{
                  maxWidth: '280px',
                  maxHeight: '200px',
                  borderRadius: '12px',
                  objectFit: 'cover',
                  transition: 'all 0.3s ease',
                }}
                onClick={() => window.open(message.fileUrl, '_blank')}
                onLoad={(e) => {
                  e.target.style.opacity = '1';
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'opacity 0.3s ease',
                }}
              >
                <FiImage color="white" size={24} />
              </motion.div>
            </motion.div>
            {message.content && (
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.95)', 
                margin: 0,
                lineHeight: '1.4',
                wordBreak: 'break-word'
              }}>
                {message.content}
              </p>
            )}
          </div>
        );

      case 'file':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <GlassCard
                style={{
                  padding: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
                onClick={handleFileDownload}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <FiFile color="white" size={20} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      color: 'white',
                      fontWeight: '500',
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {message.fileName || 'File'}
                    </p>
                    <p style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '12px',
                      margin: 0,
                    }}>
                      Click to download
                    </p>
                  </div>
                  <FiDownload color="rgba(255, 255, 255, 0.7)" size={16} />
                </div>
              </GlassCard>
            </motion.div>
            {message.content && (
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.95)', 
                margin: 0,
                lineHeight: '1.4',
                wordBreak: 'break-word'
              }}>
                {message.content}
              </p>
            )}
          </div>
        );

      default:
        return (
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.95)', 
            margin: 0,
            lineHeight: '1.5',
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
          }}>
            {message.content}
          </p>
        );
    }
  };

  const bubbleVariants = {
    initial: { 
      opacity: 0, 
      y: 20, 
      scale: 0.95,
      x: isOwn ? 20 : -20
    },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
        mass: 1
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: isOwn ? 'flex-end' : 'flex-start',
    marginBottom: isLast ? '16px' : '8px',
    position: 'relative',
    padding: '0 8px',
    '@media (max-width: 768px)': {
      padding: '0 4px',
    }
  };

  const messageGroupStyle = {
    maxWidth: '85%',
    width: 'fit-content',
    position: 'relative',
    '@media (max-width: 768px)': {
      maxWidth: '90%',
    },
    '@media (max-width: 480px)': {
      maxWidth: '95%',
    }
  };

  const senderNameStyle = {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '12px',
    fontWeight: '500',
    marginBottom: '4px',
    marginLeft: '12px',
    margin: '0 0 4px 12px',
  };

  const bubbleStyle = {
    padding: '12px 16px',
    position: 'relative',
    background: isOwn 
      ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.8), rgba(22, 163, 74, 0.9))'
      : 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${isOwn ? 'rgba(34, 197, 94, 0.4)' : 'rgba(255, 255, 255, 0.25)'}`,
    borderRadius: isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
    boxShadow: isOwn 
      ? '0 8px 32px rgba(34, 197, 94, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
      : '0 8px 32px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.08)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
    minWidth: '60px',
    '@media (max-width: 768px)': {
      padding: '10px 14px',
      borderRadius: isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
    },
    '@media (max-width: 480px)': {
      padding: '8px 12px',
      borderRadius: isOwn ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
    }
  };

  const metaStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: isOwn ? 'flex-end' : 'flex-start',
    gap: '6px',
    marginTop: '8px',
  };

  const timeStyle = {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '11px',
    fontWeight: '500',
  };

  const actionsStyle = {
    position: 'absolute',
    top: '50%',
    [isOwn ? 'left' : 'right']: '-40px',
    transform: 'translateY(-50%)',
    background: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '8px',
    padding: '4px',
    display: 'flex',
    gap: '4px',
    zIndex: 10,
  };

  const actionButtonStyle = {
    background: 'none',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.7)',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <motion.div
      variants={bubbleVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={containerStyle}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div style={messageGroupStyle}>
        {/* Sender name (only for received messages) */}
        {!isOwn && showAvatar && (
          <motion.p 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              ...senderNameStyle,
              '@media (max-width: 480px)': {
                fontSize: '11px',
                marginLeft: '8px',
              }
            }}
          >
            {message.sender.username}
          </motion.p>
        )}

        {/* Message bubble */}
        <motion.div
          style={bubbleStyle}
          whileHover={{ 
            scale: 1.02,
            boxShadow: isOwn 
              ? '0 12px 40px rgba(34, 197, 94, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.2)'
              : '0 12px 40px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.15)'
          }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {renderMessageContent()}

          {/* Message timestamp and status */}
          <div style={metaStyle}>
            <span style={timeStyle}>
              {formatMessageTime(message.createdAt)}
            </span>
            
            {isOwn && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                style={{ 
                  color: 'rgba(255, 255, 255, 0.8)',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {message.isRead ? (
                  <FiCheckCircle size={12} style={{ color: '#ffffff' }} />
                ) : (
                  <FiCheck size={12} style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                )}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Message actions */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={actionsStyle}
            >
              {message.content && (
                <motion.button
                  style={actionButtonStyle}
                  onClick={handleCopyMessage}
                  whileHover={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white'
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
                </motion.button>
              )}
              <motion.button
                style={actionButtonStyle}
                whileHover={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white'
                }}
                whileTap={{ scale: 0.95 }}
              >
                <FiMoreHorizontal size={14} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MessageBubble;