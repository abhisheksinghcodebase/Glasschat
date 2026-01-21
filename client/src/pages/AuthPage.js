import { useState } from 'react';
import { motion } from 'framer-motion';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    position: 'relative',
    overflow: 'hidden',
  };

  const overlayStyle = {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(2px)',
    WebkitBackdropFilter: 'blur(2px)',
  };

  const glassLayerStyle = {
    position: 'absolute',
    inset: 0,
  };

  const floatingElementStyle = (size, left, top) => ({
    position: 'absolute',
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    top: `${top}%`,
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    backdropFilter: 'blur(2px)',
    WebkitBackdropFilter: 'blur(2px)',
  });

  const brandStyle = {
    position: 'absolute',
    bottom: '32px',
    left: '50%',
    transform: 'translateX(-50%)',
    textAlign: 'center',
  };

  const floatingElements = Array.from({ length: 8 }, (_, i) => {
    const size = Math.random() * 20 + 10;
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    
    return (
      <motion.div
        key={i}
        style={floatingElementStyle(size, left, top)}
        animate={{
          y: [0, -30, 0],
          x: [0, Math.random() * 20 - 10, 0],
          opacity: [0.2, 0.8, 0.2],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 4 + Math.random() * 3,
          repeat: Infinity,
          delay: Math.random() * 3,
          ease: "easeInOut"
        }}
      />
    );
  });

  return (
    <div style={containerStyle}>
      {/* Floating background elements */}
      {floatingElements}

      {/* Glassmorphism overlay */}
      <div style={overlayStyle} />

      {/* Additional glass layers for depth */}
      <div style={glassLayerStyle}>
        <div style={{
          position: 'absolute',
          top: '25%',
          left: '25%',
          width: '384px',
          height: '384px',
          background: 'rgba(59, 130, 246, 0.1)',
          borderRadius: '50%',
          filter: 'blur(48px)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '25%',
          right: '25%',
          width: '384px',
          height: '384px',
          background: 'rgba(139, 92, 246, 0.1)',
          borderRadius: '50%',
          filter: 'blur(48px)',
        }} />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '384px',
          height: '384px',
          background: 'rgba(236, 72, 153, 0.1)',
          borderRadius: '50%',
          filter: 'blur(48px)',
        }} />
      </div>

      {/* Auth form container */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '448px' }}>
        <motion.div
          key={isLogin ? 'login' : 'register'}
          initial={{ opacity: 0, x: isLogin ? -50 : 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: isLogin ? 50 : -50 }}
          transition={{ duration: 0.3 }}
        >
          {isLogin ? (
            <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </motion.div>
      </div>

      {/* Brand watermark */}
      <motion.div
        style={brandStyle}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '4px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          }}>
            GlassChat
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '14px',
          }}>
            Real-time messaging with style
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;