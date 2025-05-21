import React, { useState } from 'react';
import logoImage from '../assets/freepik_br_570104c6-d98a-4035-a430-35ecf67600ef.png';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateAccountPage = () => {
  const [Name, setName] = useState('');
  const [email, setemail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    if (!Name.trim()) {
      toast.error('Please enter your name');
      return false;
    }
    if (!email.trim()) {
      toast.error('Please enter your email');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (!username.trim()) {
      toast.error('Please enter a username');
      return false;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Name, email, username, password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Registration successful!');
        // Store user data in localStorage or context
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect after 1 second
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        toast.error(data.message || 'Registration failed. Please try again.');
      }
    } catch {
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex h-screen w-full">
      <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      {/* Left Panel - Sign In Form */}
      <div className="flex w-full flex-col justify-between p-15 md:w-2/5">
        {/* Logo */}
        <div className="mb-5">
          <div className="flex items-center">
            <img src={logoImage} alt="Department Logo" className="mr-3 h-20 w-20" />
            <span className="text-2xl font-medium text-gray-700">Irrigation DeptStore</span>
          </div>
        </div>
        
        {/* Sign In Form */}
        <div className="mb-auto w-full max-w-md">
          <h1 className="mb-4 text-5xl font-bold text-gray-900">Sign Up</h1>
          
          <form className="mt-10" onSubmit={handleSubmit}>
            <div className="mb-6">
              <input
                type="text"
                placeholder="Enter Your Name"
                className="w-full rounded-full bg-gray-100 py-4 px-6 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={Name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <input
                type="email"
                placeholder="Enter Your Email"
                className="w-full rounded-full bg-gray-100 py-4 px-6 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={email}
                onChange={(e) => setemail(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Enter the User Name"
                className="w-full rounded-full bg-gray-100 py-4 px-6 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div className="mb-6 relative">
              <input
                type="password"
                placeholder="Enter the Password"
                className="w-full rounded-full bg-gray-100 py-4 px-6 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <button
              type="submit"
              className="mt-4 w-full rounded-full bg-green-500 py-4 px-6 font-medium text-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
      
      {/* Right Panel - Existing User Section */}
      <div className="hidden md:block md:w-3/5">
        <div className="relative h-full w-full bg-gradient-to-br from-green-400 to-green-800">
          {/* Background shapes */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute left-1/4 top-1/4 h-64 w-64 rotate-45 rounded-3xl bg-white"></div>
            <div className="absolute right-1/4 bottom-1/4 h-48 w-48 rounded-full bg-white"></div>
          </div>
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-12 text-white">
            <p className="mb-10 text-center text-xl">
              Welcome to the Irrigation DeptStore!<br />
            </p>
            <h2 className="mb-6 text-5xl font-bold">Already Have an Account?</h2>
            <button 
              onClick={() => navigate('/login')}
              className="rounded-full bg-white px-12 py-4 font-medium text-teal-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccountPage;