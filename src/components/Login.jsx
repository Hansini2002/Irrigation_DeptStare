import React from 'react';
import logoImage from '../assets/freepik_br_570104c6-d98a-4035-a430-35ecf67600ef.png';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  {/*const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.success) {
        alert('Login successful!');
        // Redirect to dashboard or another page
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };*/}

  return (
    <div className="flex h-screen w-full">
      {/* Left Panel - Login Form */}
      <div className="flex w-full flex-col justify-between p-30 md:w-3/5 ">
        {/* Logo */}
        <div className="mb-10">
          <div className="flex items-center">
            <img src={logoImage} alt="Department Logo" className="mr-3 h-20 w-20" />
            <span className="text-2xl font-medium text-gray-700">Irrigation DeptStore</span>
          </div>
        </div>
        
        {/* Login Form */}
        <div className="mb-auto w-full max-w-md">
          <h1 className="mb-4 text-5xl font-bold text-gray-900">Login to Your Account</h1>
          
          <form className="mt-10" /*onSubmit={handleSubmit}*/>
            <div className="mb-6">
              <input
                type="username"
                placeholder="Enter the User Name"
                className="w-full rounded-full bg-gray-100 py-4 px-6 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            
            <div className="mb-6 relative">
              <input
                type="password"
                placeholder="Enter the Password"
                className="w-full rounded-full bg-gray-100 py-4 px-6 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button 
                type="button" 
                className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                  />
                </svg>
              </button>
            </div>
            
            <button
              type="submit"
              className="mt-4 w-full rounded-full bg-teal-500 py-4 px-6 font-medium text-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
      
      {/* Right Panel - New User Section */}
      <div className="hidden md:block md:w-2/5">
        <div className="relative h-full w-full bg-gradient-to-br from-teal-400 to-teal-600">
          {/* Close button */}
          <button className="absolute right-6 top-6 text-white">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
          
          {/* Background shapes - simplified */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute left-1/4 top-1/4 h-64 w-64 rotate-45 rounded-3xl bg-white"></div>
            <div className="absolute right-1/4 bottom-1/4 h-48 w-48 rounded-full bg-white"></div>
          </div>
          
          {/* New User Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-12 text-white">
          <p className="mb-10 text-center text-xl">
              Welcome to the Irrigation DeptStore!<br />
            </p>
            <h2 className="mb-6 text-5xl font-bold">New Here?</h2>
            <button className="rounded-full bg-white px-12 py-4 font-medium text-teal-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;