# 🚀 GlassChat Deployment Guide

## Quick Start (Local Development)

1. **Install all dependencies:**
   ```bash
   npm run install-deps
   ```

2. **Set up environment variables:**
   ```bash
   cp server/.env.example server/.env
   ```
   Edit `server/.env` with your values:
   ```
   MONGODB_URI=mongodb://localhost:27017/glasschat
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5000
   NODE_ENV=development
   ```

3. **Start the application:**
   ```bash
   npm run dev
   ```

   Access the app at: http://localhost:3000

## 🌐 Production Deployment

### Option 1: Deploy to Render (Recommended)

#### Backend Deployment:
1. Push your code to GitHub
2. Go to [Render.com](https://render.com) and create a new Web Service
3. Connect your GitHub repository
4. Set the following:
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `cd server && npm start`
   - **Environment Variables:**
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/glasschat
     JWT_SECRET=your-production-jwt-secret
     NODE_ENV=production
     PORT=5000
     ```

#### Frontend Deployment:
1. Create a new Static Site on Render
2. Set the following:
   - **Build Command:** `cd client && npm install && npm run build`
   - **Publish Directory:** `client/build`
   - **Environment Variables:**
     ```
     REACT_APP_API_URL=https://your-backend-url.onrender.com
     ```

### Option 2: Deploy to Vercel + Railway

#### Backend (Railway):
1. Go to [Railway.app](https://railway.app)
2. Deploy from GitHub
3. Add environment variables in Railway dashboard
4. Set start command: `cd server && npm start`

#### Frontend (Vercel):
1. Go to [Vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set build settings:
   - **Framework Preset:** Create React App
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

### Option 3: VPS Deployment

#### Using PM2 for Process Management:
```bash
# Install PM2 globally
npm install -g pm2

# Start the backend
cd server
pm2 start index.js --name "glasschat-server"

# Build and serve frontend
cd ../client
npm run build
pm2 serve build 3000 --name "glasschat-client"

# Save PM2 configuration
pm2 save
pm2 startup
```

#### Nginx Configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Socket.IO
    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🗄️ Database Setup

### MongoDB Atlas (Recommended):
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP addresses (or use 0.0.0.0/0 for all IPs)
5. Get your connection string and add it to your environment variables

### Local MongoDB:
```bash
# Install MongoDB
# Windows: Download from mongodb.com
# macOS: brew install mongodb-community
# Ubuntu: sudo apt install mongodb

# Start MongoDB service
# Windows: Start MongoDB service from Services
# macOS/Linux: sudo systemctl start mongod
```

## 🔧 Environment Variables

### Server (.env):
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/glasschat

# Authentication
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long

# Server
PORT=5000
NODE_ENV=production

# File Upload (Optional)
MAX_FILE_SIZE=10485760
UPLOAD_PATH=uploads/
```

### Client (Environment Variables):
```env
REACT_APP_API_URL=https://your-backend-url.com
```

## 🔒 Security Checklist

- ✅ Use strong JWT secrets (32+ characters)
- ✅ Enable CORS only for your domain
- ✅ Use HTTPS in production
- ✅ Set secure MongoDB connection
- ✅ Validate all user inputs
- ✅ Use environment variables for secrets
- ✅ Enable rate limiting (optional)

## 📊 Performance Optimization

### Frontend:
- ✅ Code splitting with React.lazy()
- ✅ Image optimization
- ✅ Bundle analysis with webpack-bundle-analyzer
- ✅ Service worker for caching

### Backend:
- ✅ Database indexing
- ✅ Connection pooling
- ✅ Compression middleware
- ✅ Caching with Redis (optional)

## 🐛 Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Update CORS origin in server/index.js
   - Check REACT_APP_API_URL in client

2. **Socket.IO Connection Issues:**
   - Verify WebSocket support on hosting platform
   - Check firewall settings

3. **Database Connection:**
   - Verify MongoDB URI format
   - Check network access in MongoDB Atlas

4. **Build Errors:**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility

### Logs:
```bash
# Check PM2 logs
pm2 logs

# Check server logs
cd server && npm run dev

# Check client logs
cd client && npm start
```

## 🎉 Success!

Your GlassChat application is now deployed and ready for users! 

**Features Available:**
- ✅ Real-time messaging
- ✅ User authentication
- ✅ File sharing
- ✅ Mobile-responsive design
- ✅ Glassmorphism UI
- ✅ WhatsApp-like experience

**Next Steps:**
- Add custom domain
- Set up SSL certificate
- Configure monitoring
- Add analytics
- Scale as needed

Happy chatting! 🚀