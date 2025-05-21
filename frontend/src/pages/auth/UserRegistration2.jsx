import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import for navigation

const UserRegistration = ({ token }) => {
  const navigate = useNavigate(); // Initialize navigation hook
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    password: '',
    password2: ''
  });

  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const { first_name, last_name, password, password2 } = formData;

    if (!first_name || !last_name || !password || !password2) {
      setMessage('All fields are required');
      return;
    }

    if (password !== password2) {
      setMessage('Passwords do not match');
      return;
    }
    
    setLoading(true);

    try {
      const response = await axios.post(
        `http://192.168.100.6:3000/api/authapi/register/${token}/`,
        {
          token,
          first_name,
          last_name,
          password,
          password2
        }
      );
      setMessage('Registration successful! Redirecting to login...');
      setSuccess(true);
      
      // Wait a moment before redirecting to login page
      setTimeout(() => {
        navigate('/'); // Navigate to login page
      }, 1500);
    } catch (error) {
      const errMsg = error?.response?.data?.detail ||
                     error?.response?.data?.password2?.[0] ||
                     error?.response?.data?.password?.[0] ||
                     error?.response?.data?.non_field_errors?.[0] ||
                     error?.response?.data?.token?.[0] ||
                     'Registration failed';
      setMessage(errMsg);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  // Common styles
  const colors = {
    primary: '#4a6cf7',
    background: '#ffffff',
    text: '#333333',
    lightGray: '#f5f5f5',
    border: '#e0e0e0',
    error: '#f44336',
    success: '#4caf50',
    focusShadow: '0 0 0 2px rgba(74, 108, 247, 0.25)'
  };

  const styles = {
    container: {
      maxWidth: '450px',
      margin: '40px auto',
      padding: '30px',
      backgroundColor: colors.background,
      borderRadius: '12px',
      boxShadow: 'none',
      fontFamily: '"Segoe UI", Roboto, -apple-system, BlinkMacSystemFont, sans-serif',
    },
    header: {
      textAlign: 'center',
      marginBottom: '24px',
    },
    title: {
      fontSize: '28px',
      fontWeight: '600',
      color: colors.text,
      margin: '0 0 8px 0',
    },
    subtitle: {
      fontSize: '14px',
      color: '#666',
      margin: '0',
      fontWeight: 'normal',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    fieldGroup: {
      display: 'flex',
      gap: '12px',
    },
    inputContainer: {
      position: 'relative',
      flex: '1',
    },
    label: {
      display: 'block',
      marginBottom: '6px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#555',
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      fontSize: '15px',
      borderRadius: '8px',
      border: `1px solid ${colors.border}`,
      backgroundColor: colors.lightGray,
      transition: 'all 0.2s ease',
      boxSizing: 'border-box',
      outline: 'none',
    },
    passwordContainer: {
      position: 'relative',
    },
    passwordInput: {
      width: '100%',
      padding: '12px 16px',
      paddingRight: '40px',
      fontSize: '15px',
      borderRadius: '8px',
      border: `1px solid ${colors.border}`,
      backgroundColor: colors.lightGray,
      transition: 'all 0.2s ease',
      boxSizing: 'border-box',
      outline: 'none',
    },
    passwordToggle: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      color: '#666',
      fontSize: '14px',
      padding: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    focusedInput: {
      borderColor: colors.primary,
      backgroundColor: colors.background,
    },
    button: {
      width: '100%',
      padding: '14px',
      marginTop: '10px',
      backgroundColor: colors.primary,
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonHover: {
      backgroundColor: '#3a5ce5',
      transform: 'translateY(-1px)',
    },
    message: {
      padding: '12px',
      marginTop: '16px',
      borderRadius: '8px',
      textAlign: 'center',
      fontSize: '14px',
    },
    successMessage: {
      backgroundColor: 'rgba(76, 175, 80, 0.1)',
      color: colors.success,
      border: `1px solid ${colors.success}`,
    },
    errorMessage: {
      backgroundColor: 'rgba(244, 67, 54, 0.1)',
      color: colors.error,
      border: `1px solid ${colors.error}`,
    },
    spinner: {
      width: '18px',
      height: '18px',
      border: '3px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '50%',
      borderTopColor: 'white',
      animation: 'spin 1s linear infinite',
      marginRight: '8px',
    }
  };

  // Inline keyframes for the spinner
  const keyframes = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;

  return (
    <div style={styles.container}>
      {/* Inject keyframes animation */}
      <style>{keyframes}</style>
      
      <div style={styles.header}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Please complete the registration form</p>
      </div>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.fieldGroup}>
          <div style={styles.inputContainer}>
            <label style={styles.label} htmlFor="first_name">First Name</label>
            <input
              id="first_name"
              style={styles.input}
              type="text"
              name="first_name"
              placeholder="John"
              value={formData.first_name}
              onChange={handleChange}
              required
            //   onFocus={(e) => e.target.style.borderColor = colors.primary}
              onFocus={(e) => {
                e.target.style.borderColor = colors.primary;
                e.target.style.backgroundColor = colors.background;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = colors.border;
                e.target.style.backgroundColor = colors.lightGray;
              }}
            />
          </div>
          
          <div style={styles.inputContainer}>
            <label style={styles.label} htmlFor="last_name">Last Name</label>
            <input
              id="last_name"
              style={styles.input}
              type="text"
              name="last_name"
              placeholder="Doe"
              value={formData.last_name}
              onChange={handleChange}
              required
              onFocus={(e) => {
                e.target.style.borderColor = colors.primary;
                e.target.style.backgroundColor = colors.background;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = colors.border;
                e.target.style.backgroundColor = colors.lightGray;
              }}
            />
          </div>
        </div>
        
        <div style={styles.inputContainer}>
          <label style={styles.label} htmlFor="password">Password</label>
          <div style={styles.passwordContainer}>
            <input
              id="password"
              style={styles.passwordInput}
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Choose a secure password"
              value={formData.password}
              onChange={handleChange}
              required
              onFocus={(e) => {
                e.target.style.borderColor = colors.primary;
                e.target.style.backgroundColor = colors.background;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = colors.border;
                e.target.style.backgroundColor = colors.lightGray;
              }}
            />
            <button 
              type="button" 
              style={styles.passwordToggle} 
              onClick={() => setShowPassword(!showPassword)}
              tabIndex="-1"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        
        <div style={styles.inputContainer}>
          <label style={styles.label} htmlFor="password2">Confirm Password</label>
          <div style={styles.passwordContainer}>
            <input
              id="password2"
              style={styles.passwordInput}
              type={showConfirmPassword ? "text" : "password"}
              name="password2"
              placeholder="Confirm your password"
              value={formData.password2}
              onChange={handleChange}
              required
              onFocus={(e) => {
                e.target.style.borderColor = colors.primary;
                e.target.style.backgroundColor = colors.background;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = colors.border;
                e.target.style.backgroundColor = colors.lightGray;
              }}
            />
            <button 
              type="button" 
              style={styles.passwordToggle} 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex="-1"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        
        <button
          type="submit"
          style={styles.button}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#3a5ce5';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = colors.primary;
            e.target.style.transform = 'none';
          }}
          disabled={loading}
        >
          {loading && <div style={styles.spinner}></div>}
          {loading ? 'Registering...' : 'Register'}
        </button>
        
        {message && (
          <div 
            style={{
              ...styles.message,
              ...(success ? styles.successMessage : styles.errorMessage)
            }}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default UserRegistration;