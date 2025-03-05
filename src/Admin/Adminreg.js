import React, { useState } from 'react';
import axios from 'axios';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBInput,
  MDBBtn,
  MDBIcon
} from 'mdb-react-ui-kit';
import './Adminreg.css'; // Make sure this path is correct

const Adminreg = ({setView}) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Password and Confirm Password do not match.');
      return;
    }
    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }

    const adminData = {
      userrole: {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirm_Password: formData.confirmPassword
      },
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/staffportal/createadmin/', adminData, {
        headers: {
          'Content-Type': 'application/json'
        },
      });
      
      const token = response.data.token;
      console.log('Token:', token);
      localStorage.setItem('adminToken', token);
      alert('Admin registered successfully!');
    } catch (error) {
      console.error('AxiosError:', error.response ? error.response.data : error.message);
      alert('Error registering admin. Please try again.');
    }

    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  return (
    <MDBContainer fluid className="adminreg-container">
      <MDBCard className='adminreg-card'>
        <MDBCardBody className='adminreg-card-body'>
          <MDBRow>
            <MDBCol md='10' lg='6' className='adminreg-order-lg-1 adminreg-flex-column'>
              <p className="adminreg-heading">Admin Registration</p>

              <form onSubmit={handleSubmit} className="adminreg-form">
                <div className="adminreg-form-group">
                  <MDBIcon fas icon="user" className='adminreg-icon' size='lg'/>
                  <MDBInput
                    label='Username'
                    type='text'
                    name='username'
                    value={formData.username}
                    onChange={handleChange}
                    className='adminreg-input'
                  />
                </div>

                <div className="adminreg-form-group">
                  <MDBIcon fas icon="envelope" className='adminreg-icon' size='lg'/>
                  <MDBInput
                    label='Email'
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    className='adminreg-input'
                  />
                </div>

                <div className="adminreg-form-group">
                  <MDBIcon fas icon="lock" className='adminreg-icon' size='lg'/>
                  <MDBInput
                    label='Password'
                    type='password'
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    className='adminreg-input'
                  />
                </div>

                <div className="adminreg-form-group">
                  <MDBIcon fas icon="key" className='adminreg-icon' size='lg'/>
                  <MDBInput
                    label='Confirm Password'
                    type='password'
                    name='confirmPassword'
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className='adminreg-input'
                  />
                </div>


                <MDBBtn className='adminreg-button1' size='lg' type='submit'>Register</MDBBtn>
                <p className="text-center">
                  Already have an account? <a className="adminreg-link" onClick={() => setView('admin')}>Sign in</a>
                </p>
              </form>
            </MDBCol>

            <MDBCol md='10' lg='6' className='adminreg-order-lg-2 adminreg-flex'>
            <MDBCardImage src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp' fluid/>
            </MDBCol>

          </MDBRow>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default Adminreg;
