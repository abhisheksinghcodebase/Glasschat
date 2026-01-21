const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');

// Store active users and their socket connections
const activeUsers = new Map();

// Socket authentication middleware
const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-passwordHash');
    
    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }

    socket.userId = user._id.toString();
    socket.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication error: Invalid token'));
  }
};

// Handle socket connections
const handleConnection = (io) => {
  return async (socket) => {
    console.log(`User ${socket.user.username} connected: ${socket.id}`);

    // Add user to active users
    activeUsers.set(socket.userId, {
      socketId: socket.id,
      user: socket.user
    });

    // Update user online status
    await User.findByIdAndUpdate(socket.userId, {
      isOnline: true,
      lastSeen: new Date()
    });

    // Broadcast user online status
    socket.broadcast.emit('user_online', {
      userId: socket.userId,
      username: socket.user.username
    });

    // Join user to their personal room
    socket.join(socket.userId);

    // Handle joining chat rooms
    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.user.username} joined room: ${roomId}`);
    });

    // Handle leaving chat rooms
    socket.on('leave_room', (roomId) => {
      socket.leave(roomId);
      console.log(`User ${socket.user.username} left room: ${roomId}`);
    });

    // Handle sending messages
    socket.on('send_message', async (data) => {
      try {
        const { receiverId, roomId, content, messageType = 'text', fileUrl, fileName } = data;

        // Validate message data
        if (!content && !fileUrl) {
          socket.emit('error', { message: 'Message content or file is required' });
          return;
        }

        if (!receiverId && !roomId) {
          socket.emit('error', { message: 'Receiver or room is required' });
          return;
        }

        // Create message
        const messageData = {
          sender: socket.userId,
          content,
          messageType,
          fileUrl,
          fileName
        };

        if (receiverId) {
          messageData.receiver = receiverId;
        } else {
          messageData.room = roomId;
        }

        const message = new Message(messageData);
        await message.save();

        // Populate sender info
        await message.populate('sender', 'username avatar');
        if (receiverId) {
          await message.populate('receiver', 'username avatar');
        }

        // Emit message to appropriate recipients
        if (receiverId) {
          // Private message
          socket.to(receiverId).emit('receive_message', message);
          socket.emit('message_sent', message);
        } else {
          // Room message
          socket.to(roomId).emit('receive_message', message);
          socket.emit('message_sent', message);
        }

        console.log(`Message sent from ${socket.user.username} to ${receiverId || roomId}`);
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing', (data) => {
      const { receiverId, roomId } = data;
      
      if (receiverId) {
        socket.to(receiverId).emit('user_typing', {
          userId: socket.userId,
          username: socket.user.username
        });
      } else if (roomId) {
        socket.to(roomId).emit('user_typing', {
          userId: socket.userId,
          username: socket.user.username
        });
      }
    });

    socket.on('stop_typing', (data) => {
      const { receiverId, roomId } = data;
      
      if (receiverId) {
        socket.to(receiverId).emit('user_stop_typing', {
          userId: socket.userId
        });
      } else if (roomId) {
        socket.to(roomId).emit('user_stop_typing', {
          userId: socket.userId
        });
      }
    });

    // Handle message read receipts
    socket.on('message_read', async (data) => {
      try {
        const { messageId } = data;
        
        const message = await Message.findById(messageId);
        if (message && message.receiver.toString() === socket.userId) {
          message.isRead = true;
          message.readAt = new Date();
          await message.save();

          // Notify sender about read receipt
          socket.to(message.sender.toString()).emit('message_read_receipt', {
            messageId,
            readAt: message.readAt
          });
        }
      } catch (error) {
        console.error('Message read error:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      console.log(`User ${socket.user.username} disconnected: ${socket.id}`);

      // Remove user from active users
      activeUsers.delete(socket.userId);

      // Update user offline status
      await User.findByIdAndUpdate(socket.userId, {
        isOnline: false,
        lastSeen: new Date()
      });

      // Broadcast user offline status
      socket.broadcast.emit('user_offline', {
        userId: socket.userId,
        username: socket.user.username
      });
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  };
};

module.exports = {
  authenticateSocket,
  handleConnection,
  activeUsers
};