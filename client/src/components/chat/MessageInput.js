import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiPaperclip, FiSmile, FiX, FiImage, FiMic, FiPlus } from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';
import EmojiPicker from 'emoji-picker-react';
import GlassCard from '../common/GlassCard';
import GlassButton from '../common/GlassButton';
import { useSocket } from '../../context/SocketContext';
import { useChat } from '../../context/ChatContext';
import toast from 'react-hot-toast';

const MessageInput = ({ activeChat }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  
  const { sendMessage, sendTyping, sendStopTyping } = useSocket();
  const { uploadFile } = useChat();

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  }, [message]);

  // Handle typing indicators
  const handleTyping = useCallback(() => {
    if (!isTyping && activeChat) {
      setIsTyping(true);
      sendTyping(activeChat.type === 'user' ? activeChat.id : null, activeChat.type === 'room' ? activeChat.id : null);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendStopTyping(activeChat.type === 'user' ? activeChat.id : null, activeChat.type === 'room' ? activeChat.id : null);
    }, 1000);
  }, [isTyping, activeChat, sendTyping, sendStopTyping]);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    handleTyping();
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      setShowAttachments(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'audio/*': ['.mp3', '.wav'],
      'video/*': ['.mp4']
    },
    multiple: false,
    noClick: true
  });

  const handleFileSelect = (type = 'all') => {
    const input = document.createElement('input');
    input.type = 'file';
    
    switch (type) {
      case 'image':
        input.accept = 'image/*';
        break;
      case 'document':
        input.accept = '.pdf,.doc,.docx,.txt';
        break;
      default:
        input.accept = 'image/*,application/pdf,.doc,.docx,.txt,audio/*,video/*';
    }
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error('File size must be less than 5MB');
          return;
        }
        setSelectedFile(file);
        setShowAttachments(false);
      }
    };
    input.click();
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!activeChat) {
      toast.error('Please select a chat');
      return;
    }

    if (!message.trim() && !selectedFile) {
      return;
    }

    try {
      let messageData = {
        content: message.trim(),
        messageType: 'text'
      };

      // Add recipient info
      if (activeChat.type === 'user') {
        messageData.receiverId = activeChat.id;
      } else {
        messageData.roomId = activeChat.id;
      }

      // Handle file upload
      if (selectedFile) {
        setIsUploading(true);
        const uploadResult = await uploadFile(selectedFile);
        
        messageData.fileUrl = uploadResult.fileUrl;
        messageData.fileName = uploadResult.fileName;
        messageData.messageType = uploadResult.fileType;
      }

      // Send message
      sendMessage(messageData);

      // Clear form
      setMessage('');
      setSelectedFile(null);
      setIsUploading(false);
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }

      // Stop typing indicator
      if (isTyping) {
        setIsTyping(false);
        sendStopTyping(activeChat.type === 'user' ? activeChat.id : null, activeChat.type === 'room' ? activeChat.id : null);
      }

    } catch (error) {
      console.error('Send message error:', error);
      setIsUploading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Styles
  const containerStyle = {
    padding: '20px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(30px)',
    WebkitBackdropFilter: 'blur(30px)',
    '@media (max-width: 768px)': {
      padding: '16px 12px',
    },
    '@media (max-width: 480px)': {
      padding: '12px 8px',
    }
  };

  const filePreviewStyle = {
    marginBottom: '16px',
  };

  const fileCardStyle = {
    padding: '12px',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
  };

  const inputContainerStyle = {
    position: 'relative',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isDragActive ? 'scale(1.02)' : 'scale(1)',
    background: isDragActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
    borderRadius: '16px',
    border: isDragActive ? '2px dashed rgba(59, 130, 246, 0.5)' : '2px dashed transparent',
    padding: isDragActive ? '8px' : '0',
  };

  const inputWrapperStyle = {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '12px',
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${isFocused ? 'rgba(59, 130, 246, 0.5)' : 'rgba(255, 255, 255, 0.2)'}`,
    borderRadius: '20px',
    padding: '8px',
    transition: 'all 0.3s ease',
    boxShadow: isFocused 
      ? '0 0 0 2px rgba(59, 130, 246, 0.2), 0 8px 25px rgba(0, 0, 0, 0.15)'
      : '0 4px 15px rgba(0, 0, 0, 0.1)',
  };

  const textareaStyle = {
    flex: 1,
    background: 'none',
    border: 'none',
    outline: 'none',
    color: 'white',
    fontSize: '16px',
    lineHeight: '1.5',
    resize: 'none',
    minHeight: '24px',
    maxHeight: '120px',
    padding: '8px 12px',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
  };

  const buttonGroupStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  };

  const attachmentMenuStyle = {
    position: 'absolute',
    bottom: '60px',
    left: '8px',
    background: 'rgba(0, 0, 0, 0.9)',
    backdropFilter: 'blur(20px)',
    borderRadius: '12px',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    minWidth: '160px',
    zIndex: 50,
  };

  const attachmentButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    background: 'none',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.8)',
    cursor: 'pointer',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  };

  const emojiPickerStyle = {
    position: 'absolute',
    bottom: '60px',
    right: '8px',
    zIndex: 50,
  };

  if (!activeChat) {
    return (
      <GlassCard style={containerStyle}>
        <div style={{
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '16px',
          fontWeight: '500',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
        }}>
          Select a chat to start messaging
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard style={containerStyle}>
      {/* File preview */}
      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            style={filePreviewStyle}
          >
            <div style={fileCardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                    {selectedFile.type.startsWith('image/') ? (
                      <FiImage color="white" size={20} />
                    ) : (
                      <FiPaperclip color="white" size={20} />
                    )}
                  </div>
                  <div>
                    <p style={{
                      color: 'white',
                      fontWeight: '500',
                      fontSize: '14px',
                      margin: 0,
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                    }}>
                      {selectedFile.name}
                    </p>
                    <p style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '12px',
                      margin: 0,
                    }}>
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={removeSelectedFile}
                  style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(248, 113, 113, 0.3)',
                    borderRadius: '8px',
                    padding: '6px',
                    color: '#fca5a5',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiX size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emoji picker */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            style={emojiPickerStyle}
          >
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              theme="dark"
              emojiStyle="native"
              width={300}
              height={400}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attachment menu */}
      <AnimatePresence>
        {showAttachments && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            style={attachmentMenuStyle}
          >
            <motion.button
              style={attachmentButtonStyle}
              onClick={() => handleFileSelect('image')}
              whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            >
              <FiImage size={16} />
              <span>Photo</span>
            </motion.button>
            <motion.button
              style={attachmentButtonStyle}
              onClick={() => handleFileSelect('document')}
              whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            >
              <FiPaperclip size={16} />
              <span>Document</span>
            </motion.button>
            <motion.button
              style={attachmentButtonStyle}
              onClick={() => handleFileSelect('all')}
              whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            >
              <FiMic size={16} />
              <span>Audio</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message input */}
      <form onSubmit={handleSubmit}>
        <div
          {...getRootProps()}
          style={inputContainerStyle}
        >
          <input {...getInputProps()} />
          
          {isDragActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '16px',
                color: '#60a5fa',
                fontSize: '16px',
                fontWeight: '600',
                zIndex: 10,
              }}
            >
              Drop your file here
            </motion.div>
          )}
          
          <div style={inputWrapperStyle}>
            <motion.button
              type="button"
              onClick={() => setShowAttachments(!showAttachments)}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              whileHover={{ 
                scale: 1.1,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white'
              }}
              whileTap={{ scale: 0.95 }}
            >
              <FiPlus size={18} />
            </motion.button>

            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={isDragActive ? 'Drop file here...' : 'Type a message...'}
              style={{
                ...textareaStyle,
                '::placeholder': {
                  color: 'rgba(255, 255, 255, 0.5)',
                }
              }}
              rows={1}
            />

            <div style={buttonGroupStyle}>
              <motion.button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.7)',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
                whileHover={{ 
                  scale: 1.1,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white'
                }}
                whileTap={{ scale: 0.95 }}
              >
                <FiSmile size={18} />
              </motion.button>

              <motion.button
                type="submit"
                disabled={(!message.trim() && !selectedFile) || isUploading}
                style={{
                  background: (message.trim() || selectedFile) && !isUploading
                    ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                    : 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: 'white',
                  cursor: (message.trim() || selectedFile) && !isUploading ? 'pointer' : 'not-allowed',
                  padding: '10px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  opacity: (!message.trim() && !selectedFile) || isUploading ? 0.5 : 1,
                  boxShadow: (message.trim() || selectedFile) && !isUploading
                    ? '0 4px 15px rgba(59, 130, 246, 0.3)'
                    : 'none',
                }}
                whileHover={(message.trim() || selectedFile) && !isUploading ? { 
                  scale: 1.05,
                  boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)'
                } : {}}
                whileTap={(message.trim() || selectedFile) && !isUploading ? { scale: 0.95 } : {}}
              >
                {isUploading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{
                      width: '18px',
                      height: '18px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                    }}
                  />
                ) : (
                  <FiSend size={18} />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </form>
    </GlassCard>
  );
};

export default MessageInput;