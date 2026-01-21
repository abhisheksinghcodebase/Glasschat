import { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const ChatContext = createContext();

const chatReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USERS':
      return { ...state, users: action.payload, loading: false };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload, loading: false };
    case 'ADD_MESSAGE':
      // Only add message if it belongs to the current active chat
      const newMessage = action.payload;
      const { activeChat } = state;
      
      if (!activeChat) return state;
      
      const isRelevantMessage = 
        (newMessage.sender._id === activeChat.id || newMessage.receiver?._id === activeChat.id) ||
        (newMessage.sender._id === action.currentUserId && newMessage.receiver === activeChat.id) ||
        (newMessage.room === activeChat.id);
      
      if (isRelevantMessage) {
        // Check if message already exists to prevent duplicates
        const messageExists = state.messages.some(msg => msg._id === newMessage._id);
        if (!messageExists) {
          return { 
            ...state, 
            messages: [...state.messages, newMessage] 
          };
        }
      }
      return state;
    case 'SET_ACTIVE_CHAT':
      return { ...state, activeChat: action.payload, messages: [] }; // Clear messages when switching chats
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'UPDATE_MESSAGE_READ':
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg._id === action.payload.messageId
            ? { ...msg, isRead: true, readAt: action.payload.readAt }
            : msg
        )
      };
    default:
      return state;
  }
};

const initialState = {
  users: [],
  messages: [],
  activeChat: null,
  loading: false,
  error: null
};

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { socket } = useSocket();
  const { user } = useAuth();

  // Set up socket listeners
  useEffect(() => {
    if (!socket || !user) return;

    const handleReceiveMessage = (message) => {
      dispatch({ 
        type: 'ADD_MESSAGE', 
        payload: message,
        currentUserId: user.id
      });
      
      // Show notification if message is not from current user and not in active chat
      if (message.sender._id !== user.id) {
        const isFromActiveChat = state.activeChat && 
          (message.sender._id === state.activeChat.id || message.room === state.activeChat.id);
        
        if (!isFromActiveChat) {
          toast.success(`New message from ${message.sender.username}`, {
            duration: 3000,
            position: 'top-right',
          });
        }
      }
    };

    const handleMessageSent = (message) => {
      dispatch({ 
        type: 'ADD_MESSAGE', 
        payload: message,
        currentUserId: user.id
      });
    };

    const handleMessageReadReceipt = (data) => {
      dispatch({ type: 'UPDATE_MESSAGE_READ', payload: data });
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('message_sent', handleMessageSent);
    socket.on('message_read_receipt', handleMessageReadReceipt);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('message_sent', handleMessageSent);
      socket.off('message_read_receipt', handleMessageReadReceipt);
    };
  }, [socket, user, state.activeChat]);

  const fetchUsers = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.get('/api/users');
      dispatch({ type: 'SET_USERS', payload: response.data.data.users });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch users';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.get(`/api/messages/${chatId}`);
      dispatch({ type: 'SET_MESSAGES', payload: response.data.data.messages });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch messages';
      dispatch({ type: 'SET_ERROR', payload: message });
      console.error('Fetch messages error:', error);
      // Don't show toast for message fetch errors as they might be frequent
      dispatch({ type: 'SET_MESSAGES', payload: [] });
    }
  };

  const setActiveChat = (chat) => {
    dispatch({ type: 'SET_ACTIVE_CHAT', payload: chat });
    if (chat) {
      // Fetch messages for the selected chat
      fetchMessages(chat.id);
    } else {
      dispatch({ type: 'SET_MESSAGES', payload: [] });
    }
  };

  const uploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'File upload failed';
      toast.error(message);
      throw new Error(message);
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    fetchUsers,
    fetchMessages,
    setActiveChat,
    uploadFile,
    clearError
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};