import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userLoggedIn } from '../features/authSlice';
import { useNavigate } from 'react-router-dom'; 
import { login } from '../api/authApi';
import './LoginPage.css';
import Navbar from '../components/Navbar';

const LoginPage = () => {
  const dispatch = useDispatch(); // initialize dispatch
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
  e.preventDefault();
  setError('');

  try {
    const data = await login(email, password);
    console.log('Login response:', data);

    dispatch(userLoggedIn(data.user));
    navigate('/dashboard');
  } catch (err) {
    console.error(err);
    setError(err.message);
    setEmail('');
    setPassword('');
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
        </div>
      </div>
    </>
  );
};

export default LoginPage;
