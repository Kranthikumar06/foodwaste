import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Leaf, Eye, EyeOff, AlertCircle, Phone } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import { loginUser } from '../../api/authApi';
import { setCredentials } from '../../store/authSlice';
import './LoginPage.css';

export default function LoginPage() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await loginUser({ emailOrPhone, password });

      // Extract from ApiResponse<AuthResponse> (flattened from backend)
      const { token, role, name, email } = response.data.data;
      const user = { name, email, role };

      // Save to Redux
      dispatch(setCredentials({ user, token, role }));

      // Persist locally
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect based on role
      switch (role) {
        case 'DONOR': navigate('/donor/dashboard'); break;
        case 'VOLUNTEER': navigate('/volunteer/map'); break;
        case 'NGO': navigate('/ngo/dashboard'); break;
        case 'ADMIN': navigate('/admin/dashboard'); break;
        default: navigate('/');
      }
    } catch (err) {
      if (err.response && err.response.data) {
        const message = err.response.data.message || 'Login failed.';
        // User-friendly error messages
        if (message.includes('Bad credentials') || message.includes('Invalid')) {
          setError('Invalid email or password. Please try again.');
        } else {
          setError(message);
        }
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <Navbar />
      <div className="auth-header" style={{ paddingTop: '1rem', paddingBottom: '0.5rem' }}>
        <p className="auth-tagline" style={{ marginTop: '0' }}>Welcome back. Every rescue counts.</p>
      </div>

      <main className="auth-main">
        <div className="auth-card">
          <h2>Login to your account</h2>

          {error && (
            <div className="auth-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label" htmlFor="emailOrPhone">
                Email or Phone number
              </label>
              <div className="input-wrapper">
                <input
                  id="emailOrPhone"
                  type="text"
                  className="form-input"
                  placeholder="Enter email or phone"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <div className="input-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>

            <button
              type="submit"
              className="auth-btn btn-primary"
              disabled={isLoading || !emailOrPhone || !password}
            >
              {isLoading ? (
                <>
                  <div className="spinner" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <button type="button" className="auth-btn btn-secondary">
            <Phone size={18} />
            Login with OTP
          </button>
        </div>

        <div className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register" className="auth-footer-link">
            Join Free
          </Link>
        </div>
      </main>
    </div>
  );
}
