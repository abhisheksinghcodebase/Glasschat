const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return !this.room;
    }
  },
  room: {
    type: String,
    required: function() {
      return !this.receiver;
    }
  },
  content: {
    type: String,
    required: function() {
      return this.messageType === 'text';
    },
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  fileUrl: {
    type: String,
    required: function() {
      return this.messageType === 'file' || this.messageType === 'image';
    }
  },
  fileName: {
    type: String
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file'],
    default: 'text'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });
messageSchema.index({ room: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);