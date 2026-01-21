import { motion } from 'framer-motion';

const GlassCard = ({ 
  children, 
  className = '', 
  variant = 'default',
  animate = true,
  onClick,
  style = {},
  ...props 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'dark':
        return {
          background: 'rgba(0, 0, 0, 0.15)',
          backdropFilter: 'blur(25px)',
          WebkitBackdropFilter: 'blur(25px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        };
      case 'button':
        return {
          background: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '16px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: onClick ? 'pointer' : 'default',
          position: 'relative',
          overflow: 'hidden',
        };
      default:
        return {
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(25px)',
          WebkitBackdropFilter: 'blur(25px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          position: 'relative',
        };
    }
  };

  const motionProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  } : {};

  const Component = animate ? motion.div : 'div';
  const combinedStyle = { ...getVariantStyles(), ...style };

  return (
    <Component
      className={className}
      style={combinedStyle}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
};

export default GlassCard;