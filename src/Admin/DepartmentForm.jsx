import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DepartmentForm.css';  // Import your CSS file

const DepartmentForm = () => {
  const [departmentName, setDepartmentName] = useState('');
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch departments when the component mounts
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:8000/staffportal/departments/');
        setDepartments(response.data);
      } catch (err) {
        setError('Failed to fetch departments.');
      }
    };

    fetchDepartments();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/staffportal/createdepartment/', { Departmentname: departmentName });
      setDepartments([...departments, { Departmentname: departmentName }]); // Add new department to list
      setSuccess('Department created successfully.');
      setError('');
      setDepartmentName('');
    } catch (err) {
      setError('Failed to create department. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="department-form">
      <h1>Create Department</h1>
      <form onSubmit={handleSubmit}>
        <div className="department-form-group">
          <label htmlFor="departmentName">Department Name:</label>
          <input
            type="text"
            id="departmentName"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="department-form-submit-button">Create Department</button>
      </form>
      {success && <p className="success-message">{success}</p>}
      {error && <p className="error-message">{error}</p>}
      <div className="department-list">
        <h2>Departments</h2>
        <ul>
          {departments.length > 0 ? (
            departments.map((dept, index) => (
              <li key={index}>{dept.Departmentname}</li>
            ))
          ) : (
            <li>No departments found</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DepartmentForm;
