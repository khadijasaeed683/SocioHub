import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './LoginPage.css';
import Navbar from '../components/Navbar';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  
  const handleLogin = async (e) => {
  e.preventDefault();
  setError('');

  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log('Login response:', data);
    if (!response.ok) {
      setError(data.message || 'Login failed');
      setEmail('');
      setPassword('');
      
    } else {
      // Call onLogin prop to set user in parent App
      onLogin(data.user);

      // Optionally save token in localStorage for future requests
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
  } catch (err) {
    console.error(err);
    setError('Server error. Try again later.');
  }
};


  return (
    <>
      <Navbar />
      <div className="login-page">
        <div className="login-container">
          <h2>Login</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleLogin}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />

            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            <button type="submit">Login</button>
            <p className="register-link" align="center">
              Don't have an account? <Link to="/register">Sign up</Link>
            </p>
          </form>

          <p className="dummy-tip">
            <strong>Test Credentials:</strong><br />
            Email: user@sociohub.com<br />
            Password: 123456
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
