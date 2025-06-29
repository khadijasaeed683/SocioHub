import React, { useState } from 'react';
import './LoginPage.css';
import Navbar from '../components/Navbar';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const dummyUser = {
    email: 'user@sociohub.com',
    password: '123456',
    name: 'Khadija Saeed',
    _id: 'user123'
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === dummyUser.email && password === dummyUser.password) {
      onLogin(dummyUser);
    } else {
      setError('Invalid credentials');
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
