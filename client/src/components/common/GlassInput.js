import { useState } from 'react';
import { motion } from 'framer-motion';

const GlassInput = ({ 
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  className = '',
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const inputStyle = {
    width: '100%',
    padding: Icon ? '12px 12px 12px 44px' : '12px',
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    border: `1px solid ${error ? 'rgba(239, 68, 68, 0.6)' : 'rgba(255, 255, 255, 0.2)'}`,
    borderRadius: '12px',
    color: 'white',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    outline: 'none',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  };

  const focusStyle = {
    ...inputStyle,
    background: 'rgba(255, 255, 255, 0.12)',
    borderColor: error ? 'rgba(239, 68, 68, 0.8)' : 'rgba(59, 130, 246, 0.5)',
    boxShadow: error 
      ? '0 0 0 2px rgba(239, 68, 68, 0.3), 0 8px 25px rgba(0, 0, 0, 0.15)'
      : '0 0 0 2px rgba(59, 130, 246, 0.3), 0 8px 25px rgba(0, 0, 0, 0.15)',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: '8px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  };

  const iconStyle = {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'rgba(255, 255, 255, 0.6)',
    pointerEvents: 'none',
  };

  const errorStyle = {
    marginTop: '8px',
    fontSize: '14px',
    color: 'rgba(248, 113, 113, 1)',
  };

  return (
    <div style={{ position: 'relative' }} className={className}>
      {label && (
        <label style={labelStyle}>
          {label}
        </label>
      )}
      
      <div style={{ position: 'relative' }}>
        {Icon && (
          <div style={iconStyle}>
            <Icon size={20} />
          </div>
        )}
        
        <motion.input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={isFocused ? focusStyle : inputStyle}
          animate={{
            scale: isFocused ? 1.01 : 1,
          }}
          transition={{ duration: 0.2 }}
          {...props}
        />
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={errorStyle}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default GlassInput;