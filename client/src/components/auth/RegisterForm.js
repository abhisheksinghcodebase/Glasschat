import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheck, FiAlertCircle, FiArrowRight, FiShield } from 'react-icons/fi';
import GlassCard from '../common/GlassCard';
import GlassInput from '../common/GlassInput';
import GlassButton from '../common/GlassButton';
import { useAuth } from '../../context/AuthContext';

const RegisterForm = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [fieldFocus, setFieldFocus] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);

  const { register, loading } = useAuth();

  // Calculate password strength
  useEffect(() => {
    const password = formData.password;
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(strength);
  }, [formData.password]);

  // Validate form in real-time
  useEffect(() => {
    const usernameValid = formData.username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(formData.username);
    const emailValid = /\S+@\S+\.\S+/.test(formData.email);
    const passwordValid = formData.password.length >= 6;
    const confirmPasswordValid = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;
    
    setIsFormValid(usernameValid && emailValid && passwordValid && confirmPasswordValid);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFocus = (field) => {
    setFieldFocus(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setFieldFocus(prev => ({ ...prev, [field]: false }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const result = await register(formData.username, formData.email, formData.password);
    
    if (!result.success) {
      setErrors({ general: result.error });
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return '#ef4444';
    if (passwordStrength <= 2) return '#f59e0b';
    if (passwordStrength <= 3) return '#eab308';
    if (passwordStrength <= 4) return '#22c55e';
    return '#10b981';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength <= 2) return 'Fair';
    if (passwordStrength <= 3) return 'Good';
    if (passwordStrength <= 4) return 'Strong';
    return 'Very Strong';
  };

  // Enhanced styles
  const containerStyle = {
    width: '100%',
    maxWidth: '440px',
    position: 'relative',
  };

  const cardStyle = {
    padding: '40px 32px',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(30px)',
    WebkitBackdropFilter: 'blur(30px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    boxShadow: `
      0 20px 40px rgba(0, 0, 0, 0.1),
      0 0 0 1px rgba(255, 255, 255, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
    position: 'relative',
    overflow: 'hidden',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '40px',
    position: 'relative',
  };

  const titleStyle = {
    fontSize: '32px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '8px',
    letterSpacing: '-0.02em',
    lineHeight: '1.2',
  };

  const subtitleStyle = {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '16px',
    fontWeight: '400',
    margin: 0,
    lineHeight: '1.5',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  };

  const errorStyle = {
    padding: '16px',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(248, 113, 113, 0.2)',
    borderRadius: '12px',
    color: '#fca5a5',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backdropFilter: 'blur(10px)',
  };

  const inputGroupStyle = {
    position: 'relative',
  };

  const inputWrapperStyle = (field) => ({
    position: 'relative',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: fieldFocus[field] ? 'translateY(-2px)' : 'translateY(0)',
  });

  const passwordToggleStyle = {
    position: 'absolute',
    right: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'rgba(255, 255, 255, 0.6)',
    transition: 'all 0.3s ease',
    padding: '8px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const passwordStrengthStyle = {
    marginTop: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const strengthBarStyle = {
    flex: 1,
    height: '4px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '2px',
    overflow: 'hidden',
  };

  const strengthFillStyle = {
    height: '100%',
    background: `linear-gradient(90deg, ${getPasswordStrengthColor()}, ${getPasswordStrengthColor()}aa)`,
    width: `${(passwordStrength / 5) * 100}%`,
    transition: 'all 0.3s ease',
    borderRadius: '2px',
  };

  const strengthTextStyle = {
    fontSize: '12px',
    color: getPasswordStrengthColor(),
    fontWeight: '600',
    minWidth: '80px',
    textAlign: 'right',
  };

  const submitButtonStyle = {
    width: '100%',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '600',
    background: isFormValid 
      ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
      : 'rgba(255, 255, 255, 0.1)',
    border: isFormValid 
      ? '1px solid rgba(59, 130, 246, 0.3)'
      : '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    color: 'white',
    cursor: isFormValid ? 'pointer' : 'not-allowed',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',
    boxShadow: isFormValid 
      ? '0 8px 32px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)'
      : '0 4px 16px rgba(0, 0, 0, 0.1)',
  };

  const footerStyle = {
    marginTop: '32px',
    textAlign: 'center',
    position: 'relative',
  };

  const dividerStyle = {
    display: 'flex',
    alignItems: 'center',
    margin: '24px 0',
    gap: '16px',
  };

  const dividerLineStyle = {
    flex: 1,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
  };

  const dividerTextStyle = {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '14px',
    fontWeight: '500',
  };

  const footerTextStyle = {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '15px',
    margin: 0,
    fontWeight: '400',
  };

  const linkButtonStyle = {
    color: '#60a5fa',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '15px',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    padding: '4px 8px',
    borderRadius: '6px',
    position: 'relative',
  };

  // Security features indicator
  const securityFeaturesStyle = {
    marginTop: '16px',
    padding: '12px',
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: 'rgba(16, 185, 129, 0.9)',
  };

  return (
    <div style={containerStyle}>
      {/* Floating particles */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -25, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            width: '3px',
            height: '3px',
            background: 'rgba(255, 255, 255, 0.4)',
            borderRadius: '50%',
            left: `${15 + i * 25}%`,
            top: `${5 + i * 15}%`,
            zIndex: 0,
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.6,
          ease: [0.4, 0, 0.2, 1]
        }}
      >
        <GlassCard style={cardStyle}>
          {/* Gradient overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
          }} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div style={headerStyle}>
              <motion.h1 
                style={titleStyle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Create Account
              </motion.h1>
              <motion.p 
                style={subtitleStyle}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Join GlassChat and start connecting
              </motion.p>
            </div>

            <form onSubmit={handleSubmit} style={formStyle}>
              <AnimatePresence>
                {errors.general && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    style={errorStyle}
                  >
                    <FiAlertCircle size={16} />
                    {errors.general}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                style={inputWrapperStyle('username')}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <div style={inputGroupStyle}>
                  <GlassInput
                    label="Username"
                    type="text"
                    name="username"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleChange}
                    onFocus={() => handleFocus('username')}
                    onBlur={() => handleBlur('username')}
                    error={errors.username}
                    icon={FiUser}
                  />
                  {formData.username && formData.username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(formData.username) && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      style={{
                        position: 'absolute',
                        right: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#10b981',
                        zIndex: 10,
                      }}
                    >
                      <FiCheck size={16} />
                    </motion.div>
                  )}
                </div>
              </motion.div>

              <motion.div
                style={inputWrapperStyle('email')}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div style={inputGroupStyle}>
                  <GlassInput
                    label="Email Address"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => handleFocus('email')}
                    onBlur={() => handleBlur('email')}
                    error={errors.email}
                    icon={FiMail}
                  />
                  {formData.email && /\S+@\S+\.\S+/.test(formData.email) && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      style={{
                        position: 'absolute',
                        right: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#10b981',
                        zIndex: 10,
                      }}
                    >
                      <FiCheck size={16} />
                    </motion.div>
                  )}
                </div>
              </motion.div>

              <motion.div
                style={inputWrapperStyle('password')}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <div style={inputGroupStyle}>
                  <GlassInput
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => handleFocus('password')}
                    onBlur={() => handleBlur('password')}
                    error={errors.password}
                    icon={FiLock}
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={passwordToggleStyle}
                    whileHover={{ 
                      scale: 1.1,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white'
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </motion.button>
                  
                  {formData.password && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      style={passwordStrengthStyle}
                    >
                      <div style={strengthBarStyle}>
                        <motion.div
                          style={strengthFillStyle}
                          initial={{ width: 0 }}
                          animate={{ width: `${(passwordStrength / 5) * 100}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <span style={strengthTextStyle}>
                        {getPasswordStrengthText()}
                      </span>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              <motion.div
                style={inputWrapperStyle('confirmPassword')}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <div style={inputGroupStyle}>
                  <GlassInput
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => handleFocus('confirmPassword')}
                    onBlur={() => handleBlur('confirmPassword')}
                    error={errors.confirmPassword}
                    icon={FiLock}
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={passwordToggleStyle}
                    whileHover={{ 
                      scale: 1.1,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white'
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </motion.button>
                  
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      style={{
                        position: 'absolute',
                        right: '50px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#10b981',
                        zIndex: 10,
                      }}
                    >
                      <FiCheck size={16} />
                    </motion.div>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <motion.button
                  type="submit"
                  disabled={!isFormValid || loading}
                  style={submitButtonStyle}
                  whileHover={isFormValid ? { 
                    scale: 1.02,
                    boxShadow: '0 12px 40px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2)'
                  } : {}}
                  whileTap={isFormValid ? { scale: 0.98 } : {}}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <span style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '8px' 
                  }}>
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        style={{
                          width: '20px',
                          height: '20px',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          borderTop: '2px solid white',
                          borderRadius: '50%',
                        }}
                      />
                    ) : (
                      <>
                        Create Account
                        <motion.div
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <FiArrowRight size={18} />
                        </motion.div>
                      </>
                    )}
                  </span>
                </motion.button>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  style={securityFeaturesStyle}
                >
                  <FiShield size={16} />
                  <span>Your data is encrypted and secure</span>
                </motion.div>
              </motion.div>
            </form>

            <div style={dividerStyle}>
              <div style={dividerLineStyle} />
              <span style={dividerTextStyle}>or</span>
              <div style={dividerLineStyle} />
            </div>

            <motion.div 
              style={footerStyle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            >
              <p style={footerTextStyle}>
                Already have an account?{' '}
                <motion.button
                  onClick={onSwitchToLogin}
                  style={linkButtonStyle}
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: 'rgba(96, 165, 250, 0.1)',
                    color: '#93c5fd'
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign in
                </motion.button>
              </p>
            </motion.div>
          </motion.div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default RegisterForm;