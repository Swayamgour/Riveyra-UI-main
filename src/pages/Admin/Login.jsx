// components/Login.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../redux/api'; // Assuming you have a login mutation

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Uncomment if you have RTK Query mutation ready
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    try {
      // Example API call - replace with your actual login endpoint
      const response = await login({ email, password }).unwrap();

      console.log()

      // Mock successful login - remove this and use actual API
      if (response?.success) {
        // Store token or user data
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('token', response?.token);
        navigate('/admin/dashboard');
      } else {
        setError('Invalid email or password');
      }

      // Actual implementation would be:
      // if (response?.token) {
      //   localStorage.setItem('token', response.token);
      //   navigate('/admin/dashboard');
      // }
    } catch (err) {
      setError(err?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 10% 20%, rgba(21, 25, 40, 1) 0%, rgba(10, 12, 24, 1) 90%)',
        padding: '20px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card"
        style={{
          maxWidth: 440,
          width: '100%',
          padding: '40px 32px',
          borderRadius: 28,
        }}
      >
        {/* Logo / Brand */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: 56,
              height: 56,
              background: 'linear-gradient(135deg, #60a5fa, #c084fc)',
              borderRadius: 18,
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
            }}
          >
            ✨
          </div>
          <h1
            style={{
              fontSize: 28,
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              marginBottom: 8,
              background: 'linear-gradient(135deg, #fff, #a0aec0)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            Sign in to manage your dashboard
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 12,
              padding: '12px 16px',
              marginBottom: 24,
              fontSize: 13,
              color: '#f87171',
              textAlign: 'center',
            }}
          >
            {error}
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: 'block',
                fontSize: 13,
                fontFamily: 'var(--font-mono)',
                letterSpacing: 1,
                color: 'var(--text-muted)',
                marginBottom: 8,
              }}
            >
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              autoComplete="email"
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 14,
                color: '#fff',
                fontSize: 15,
                outline: 'none',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#60a5fa';
                e.target.style.boxShadow = '0 0 0 2px rgba(96, 165, 250, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ marginBottom: 28 }}>
            <label
              style={{
                display: 'block',
                fontSize: 13,
                fontFamily: 'var(--font-mono)',
                letterSpacing: 1,
                color: 'var(--text-muted)',
                marginBottom: 8,
              }}
            >
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 14,
                color: '#fff',
                fontSize: 15,
                outline: 'none',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#c084fc';
                e.target.style.boxShadow = '0 0 0 2px rgba(192, 132, 252, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #60a5fa, #c084fc)',
              border: 'none',
              borderRadius: 14,
              color: '#fff',
              fontSize: 16,
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              transition: 'all 0.2s',
              marginBottom: 20,
            }}
          >
            {isLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span className="spinner" style={{
                  width: 18,
                  height: 18,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.8s linear infinite',
                }} />
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </motion.button>

          {/* Demo credentials hint (remove in production) */}
          {/* <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
            <span>Demo: admin@example.com / password</span>
          </div> */}
        </form>
      </motion.div>

      {/* Add spinner animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}