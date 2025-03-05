import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Staff/StaffLogin1.css';
import sideImage from '../assets/images/DPS.jpeg';
import { logincontext } from '../App';

function StaffLogin() {
  const [Login, setLogin] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin({
      ...Login,
      [name]: value
    });
  };

  const navigate = useNavigate();
  const [[isAuthenticated, setIsAuthenticated], [token, setToken]] = useContext(logincontext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginUrl = 'http://127.0.0.1:8000/staffportal/staff-login/';
    const credentials = {
      username: Login.username,
      password: Login.password,
    };

    try {
      const response = await axios.post(loginUrl, credentials);
      console.log('Login Response:', response.data); // Log response to verify token
      if (response.status === 200) {
        const token = response.data['token'];
        localStorage.setItem('authToken', token); // Store token in localStorage
        setToken(token);
        setIsAuthenticated(true);
        console.log('Token:', token); // Print the token to console
        navigate('/homepage');
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Login Error:', error);
      setIsAuthenticated(false);
    }
  };

  const create = () => {
    navigate('/staffreg');
  };

  return (
    <div className="container1">
      <div>
        <div className="left-side1">
          <img src={sideImage} alt="Illustration" className="side-image1"/>
        </div>
      </div>
      <div className="right-side1">
        <form className="sign-in-form1" onSubmit={handleSubmit}>
          <h2 className='head'>Sign In</h2>
          <div className="form-group1">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              onChange={handleChange}
              placeholder="Enter username"
              required
            />
          </div>
          <div className="form-group1">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>
          <div className="form-group1">
            <button type="submit" className="sign-in-button1">Sign In</button>
          </div>
          <div className='forgot_password1'>
            <a href="/forgot-password" className="forgot_password1">Forgot Password?</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StaffLogin;
