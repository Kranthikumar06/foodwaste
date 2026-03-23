import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Leaf, Utensils, HeartHandshake, Users, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import { registerUser } from '../../api/authApi';
import { setCredentials } from '../../store/authSlice';
import './RegisterPage.css';
import './LoginPage.css'; // Reuse common auth styles 

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const initRole = searchParams.get('role');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    role: initRole ? initRole.toUpperCase() : '',
    // Step 2 Basic
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    city: '',
    language: 'ENGLISH',
    // Step 3 Specific
    organisationName: '',
    fssai: '',
    transportType: 'BICYCLE',
    availability: [],
    ngoRegistrationNumber: '',
    serviceZones: '',
    address: '',
    allowLocation: false,
    termsAccepted: false,
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (initRole) {
      setFormData(prev => ({ ...prev, role: initRole.toUpperCase() }));
    }
  }, [initRole]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDayChange = (day) => {
    setFormData(prev => {
      const current = prev.availability;
      if (current.includes(day)) {
        return { ...prev, availability: current.filter(d => d !== day) };
      }
      return { ...prev, availability: [...current, day] };
    });
  };

  const validateStep = (currentStep) => {
    setError('');
    if (currentStep === 1) {
      if (!formData.role) {
        setError('Please select a role to continue.');
        return false;
      }
    }
    if (currentStep === 2) {
      if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.city) {
        setError('Please fill all required fields.');
        return false;
      }
      if (formData.phone.length !== 10) {
        setError('Phone number must be exactly 10 digits.');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters.');
        return false;
      }
    }
    if (currentStep === 3) {
      if (!formData.termsAccepted) {
        setError('You must accept the Terms & Conditions.');
        return false;
      }
      if (formData.role === 'VOLUNTEER' && formData.availability.length === 0) {
        setError('Please select at least one available day.');
        return false;
      }
      if (formData.role === 'NGO' && (!formData.ngoRegistrationNumber || !formData.serviceZones || !formData.address)) {
        setError('Please fill all required NGO details.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
      setError('');
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setError('');
    setIsLoading(true);

    try {
      const resp = await registerUser(formData);

      // Extract from ApiResponse<AuthResponse> (flattened from backend)
      const { token, role, name, email } = resp.data.data;
      const user = { name, email, role };

      dispatch(setCredentials({ user, token, role }));

      // Persist locally
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      switch (role) {
        case 'DONOR': navigate('/donor/dashboard'); break;
        case 'VOLUNTEER': navigate('/volunteer/map'); break;
        case 'NGO': navigate('/ngo/dashboard'); break;
        default: navigate('/');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page-container auth-page-container">
      <Navbar />
      <div className="auth-header" style={{ paddingTop: '1rem', paddingBottom: '0.5rem' }}>
        <p className="auth-tagline" style={{ marginTop: '0' }}>Welcome. Together we can end hunger.</p>
      </div>

      <main className="register-main">
        <div className="step-indicator">
          <div className="step-text">Step {step} of 3</div>
          <div className="progress-bar-container">
            <div className={`progress-segment ${step >= 1 ? 'active' : ''}`} />
            <div className={`progress-segment ${step >= 2 ? 'active' : ''}`} />
            <div className={`progress-segment ${step >= 3 ? 'active' : ''}`} />
          </div>
        </div>

        <div className="register-card">
          {error && (
            <div className="auth-error" style={{ marginBottom: '1.5rem' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2>How do you want to help?</h2>
              <div className="role-grid">
                <div
                  className={`role-select-card ${formData.role === 'DONOR' ? 'selected' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, role: 'DONOR' }))}
                >
                  <div className="role-icon"><Utensils size={44} strokeWidth={1.5} className="role-svg-icon" /></div>
                  <div className="role-title">Food Donor</div>
                  <div className="role-desc">Restaurants, caterers, canteens</div>
                </div>

                <div
                  className={`role-select-card ${formData.role === 'VOLUNTEER' ? 'selected' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, role: 'VOLUNTEER' }))}
                >
                  <div className="role-icon"><HeartHandshake size={44} strokeWidth={1.5} className="role-svg-icon" /></div>
                  <div className="role-title">Volunteer</div>
                  <div className="role-desc">Anyone with a bike or car</div>
                </div>

                <div
                  className={`role-select-card ${formData.role === 'NGO' ? 'selected' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, role: 'NGO' }))}
                >
                  <div className="role-icon"><Users size={44} strokeWidth={1.5} className="role-svg-icon" /></div>
                  <div className="role-title">NGO / Kitchen</div>
                  <div className="role-desc">Community kitchens, shelters</div>
                </div>
              </div>

              <div className="form-actions" style={{ justifyContent: 'center' }}>
                <button
                  type="button"
                  className="auth-btn btn-next"
                  style={{ maxWidth: '300px' }}
                  onClick={handleNext}
                  disabled={!formData.role}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2>Basic details</h2>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">Full Name</label>
                  <input type="text" name="name" className="form-input" placeholder="Enter your full name"
                    value={formData.name} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" name="email" className="form-input" placeholder="name@example.com"
                    value={formData.email} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input type="tel" name="phone" className="form-input" placeholder="10-digit number"
                    maxLength="10" value={formData.phone} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="input-wrapper">
                    <input type={showPass ? 'text' : 'password'} name="password" className="form-input"
                      placeholder="At least 6 chars" value={formData.password} onChange={handleChange} />
                    <button type="button" className="password-toggle" onClick={() => setShowPass(!showPass)}>
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <div className="input-wrapper">
                    <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" className="form-input"
                      placeholder="Confirm password" value={formData.confirmPassword} onChange={handleChange} />
                    <button type="button" className="password-toggle" onClick={() => setShowConfirm(!showConfirm)}>
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">City</label>
                  <input type="text" name="city" className="form-input" placeholder="E.g., Hyderabad"
                    value={formData.city} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label className="form-label">Language Preference</label>
                  <select name="language" className="form-input" value={formData.language} onChange={handleChange}>
                    <option value="ENGLISH">English</option>
                    <option value="HINDI">Hindi</option>
                    <option value="TELUGU">Telugu</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="auth-btn btn-back" onClick={handleBack}>Back</button>
                <button type="button" className="auth-btn btn-next" onClick={handleNext}>Next Step</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit}>
              <h2>Final Details ({formData.role})</h2>

              <div className="form-grid full">
                {formData.role === 'DONOR' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Organisation name (optional)</label>
                      <input type="text" name="organisationName" className="form-input" placeholder="Restaurant, caterer, or company name"
                        value={formData.organisationName} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">FSSAI license number (optional)</label>
                      <input type="text" name="fssai" className="form-input" placeholder="14-digit FSSAI number"
                        value={formData.fssai} onChange={handleChange} />
                    </div>
                  </>
                )}

                {formData.role === 'VOLUNTEER' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Transport Type</label>
                      <select name="transportType" className="form-input" value={formData.transportType} onChange={handleChange}>
                        <option value="BICYCLE">Bicycle (10kg)</option>
                        <option value="BIKE_WITH_BOX">Bike with box (20kg)</option>
                        <option value="CAR">Car (50kg)</option>
                        <option value="VAN">Van (150kg)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Availability Days (Select at least one)</label>
                      <div className="checkbox-group">
                        {DAYS.map(day => (
                          <label key={day} className="checkbox-label">
                            <input type="checkbox" checked={formData.availability.includes(day)} onChange={() => handleDayChange(day)} />
                            {day}
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {formData.role === 'NGO' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">NGO registration number</label>
                      <input type="text" name="ngoRegistrationNumber" className="form-input" placeholder="Official Reg ID"
                        value={formData.ngoRegistrationNumber} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Service zones / areas covered</label>
                      <input type="text" name="serviceZones" className="form-input" placeholder="E.g., Madhapur, Jubilee Hills"
                        value={formData.serviceZones} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Address</label>
                      <input type="text" name="address" className="form-input" placeholder="Full address"
                        value={formData.address} onChange={handleChange} />
                    </div>
                  </>
                )}

                <div className="toggle-group" style={{ marginTop: '1rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>Allow Location Access</label>
                  <label className="checkbox-label">
                    <input type="checkbox" name="allowLocation" checked={formData.allowLocation} onChange={handleChange} />
                    <span>Used for matching nearby food sources</span>
                  </label>
                </div>

                <label className="checkbox-label" style={{ marginTop: '0.5rem' }}>
                  <input type="checkbox" name="termsAccepted" checked={formData.termsAccepted} onChange={handleChange} />
                  <span>Terms & conditions checkbox</span>
                </label>

              </div>

              <div className="form-actions">
                <button type="button" className="auth-btn btn-back" disabled={isLoading} onClick={handleBack}>Back</button>
                <button type="submit" className="auth-btn btn-next" disabled={isLoading || !formData.termsAccepted}>
                  {isLoading ? <><div className="spinner" /> Registering...</> : 'Register'}
                </button>
              </div>
            </form>
          )}

          {step === 1 && (
            <div className="auth-footer">
              Already have an account?{' '}
              <Link to="/login" className="auth-footer-link">Log in</Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
