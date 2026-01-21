# GlassChat - Real-time Chat Application

A production-ready real-time chat application built with React and Node.js, featuring a stunning glassmorphism design and modern UI/UX.

## ✨ Features

### Frontend (React)
- **Glassmorphism Design**: Beautiful water/glass transparency effects
- **Real-time Messaging**: Instant message delivery with Socket.IO
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **File Sharing**: Upload and share images, documents, and media files
- **Typing Indicators**: See when users are typing
- **Online Status**: Real-time user presence indicators
- **Emoji Support**: Built-in emoji picker
- **Smooth Animations**: Framer Motion micro-interactions
- **Modern UI Components**: Custom glass-styled components

### Backend (Node.js)
- **Secure Authentication**: JWT-based auth with bcrypt password hashing
- **Real-time Communication**: Socket.IO for instant messaging
- **File Upload**: Multer integration for secure file handling
- **MongoDB Integration**: Persistent message and user storage
- **RESTful API**: Clean, scalable API architecture
- **Input Validation**: Comprehensive data validation
- **Error Handling**: Centralized error management

## 🚀 Tech Stack

### Frontend
- React 18 with Hooks
- React Router for navigation
- Socket.IO Client for real-time communication
- Framer Motion for animations
- React Hot Toast for notifications
- React Icons for iconography
- Date-fns for date formatting
- Emoji Picker React
- React Dropzone for file uploads

### Backend
- Node.js with Express
- Socket.IO for WebSocket communication
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing
- Multer for file uploads
- Express Validator for input validation
- Helmet for security headers
- CORS for cross-origin requests

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### 1. Clone the repository
```bash
git clone <repository-url>
cd glasschat-app
```

### 2. Install dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Setup

#### Server Environment (.env)
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/glasschat
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRE=7d
NODE_ENV=development
UPLOAD_PATH=uploads/
MAX_FILE_SIZE=5242880
CLIENT_URL=http://localhost:3000
```

#### Client Environment (optional)
Create a `.env` file in the `client` directory:
```env
REACT_APP_SERVER_URL=http://localhost:5000
```

### 4. Start the application

#### Development Mode (both server and client)
```bash
# From root directory
npm run dev
```

#### Or start individually
```bash
# Start server (from server directory)
npm run dev

# Start client (from client directory)
npm start
```

## 🏗️ Project Structure

```
glasschat-app/
├── server/                 # Backend application
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── socket/            # Socket.IO handlers
│   └── index.js           # Server entry point
├── client/                # Frontend application
│   ├── public/            # Static assets
│   └── src/
│       ├── components/    # React components
│       │   ├── auth/      # Authentication components
│       │   ├── chat/      # Chat-related components
│       │   └── common/    # Reusable components
│       ├── context/       # React Context providers
│       ├── pages/         # Page components
│       └── App.js         # Main App component
└── package.json           # Root package.json
```

## 🎨 Design System

### Glassmorphism Components
- **GlassCard**: Base container with glass effect
- **GlassButton**: Interactive buttons with ripple effects
- **GlassInput**: Form inputs with glass styling
- **LoadingSpinner**: Animated loading indicators

### Color Palette
- Primary: Blue to Purple gradients
- Background: Deep indigo to pink gradients
- Glass: Semi-transparent white overlays
- Text: White with various opacity levels

## 🔐 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- File upload restrictions
- CORS configuration
- Helmet security headers
- Protected API routes

## 📱 Responsive Design

- Mobile-first approach
- Collapsible sidebar on small screens
- Touch-friendly interface
- Adaptive typography and spacing
- Optimized for tablets and desktops

## 🚀 Deployment

### Backend Deployment (Render/Railway)
1. Create a new service
2. Connect your repository
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel/Netlify)
1. Build the client: `cd client && npm run build`
2. Deploy the `build` folder
3. Configure environment variables

### Environment Variables for Production
```env
# Server
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_production_jwt_secret
CLIENT_URL=https://your-frontend-domain.com

# Client
REACT_APP_SERVER_URL=https://your-backend-domain.com
```

## 🧪 Testing

```bash
# Run server tests
cd server
npm test

# Run client tests
cd client
npm test
```

## 📄 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### User Endpoints
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID

### Message Endpoints
- `GET /api/messages/:chatId` - Get messages for chat
- `PUT /api/messages/:messageId/read` - Mark message as read

### Upload Endpoints
- `POST /api/upload` - Upload file

### Socket Events
- `connection` - User connects
- `join_room` - Join chat room
- `send_message` - Send message
- `receive_message` - Receive message
- `typing` - User typing
- `stop_typing` - User stopped typing
- `disconnect` - User disconnects

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Glassmorphism design inspiration
- Socket.IO for real-time communication
- Framer Motion for smooth animations
- React community for excellent libraries

---

Built with ❤️ using React and Node.js