import React, { useState } from 'react';
import backgroundImage from '../assets/Deduru Oya.jpg';
import logoImage from '../assets/freepik_br_570104c6-d98a-4035-a430-35ecf67600ef.png';
import { Link } from 'react-router-dom';

const CreateAccountPage = () => {
  const [Name, setName] = useState('');
  const [email, setemail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Name, email, username, password }),
      });
      const data = await response.json();
      if (data.success) {
        setSuccess('Registration successful! You can now login.');
        setName('');
        setemail('');
        setUsername('');
        setPassword('');
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Left side - Bridge Image */}
      <div className="hidden md:block md:w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
      </div>
      
      {/* Right side - Create Account Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Logo and Department Name */}
          <div className="flex items-center mb-8">
            <img src={logoImage} alt="Irrigation Department Logo" className="w-16 h-16" />
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-800">Divisional Irrigation Engineers' Office, Wariyapola</h1>
            </div>
          </div>
          
          {/* Create Account Form */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-center mb-8">Create an Account</h3>

            {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
            {success && <div className="mb-4 text-green-500 text-center">{success}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Enter the Name</label>
                <input 
                  type="text" 
                  placeholder="Name" 
                  className="w-full px-4 py-2 border rounded-md bg-green-50 border-green-100 focus:outline-none focus:ring focus:border-green-300"
                  value={Name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Enter the Email</label>
                <input 
                  type="text" 
                  placeholder="Email" 
                  className="w-full px-4 py-2 border rounded-md bg-green-50 border-green-100 focus:outline-none focus:ring focus:border-green-300"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Enter the User Name</label>
                <input 
                  type="text" 
                  placeholder="User Name" 
                  className="w-full px-4 py-2 border rounded-md bg-green-50 border-green-100 focus:outline-none focus:ring focus:border-green-300"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Enter the Password</label>
                <input 
                  type="password" 
                  placeholder="Password" 
                  className="w-full px-4 py-2 border rounded-md bg-green-50 border-green-100 focus:outline-none focus:ring focus:border-green-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-center mb-6">
                <button 
                  type="submit" 
                  className="px-10 py-2 text-base font-medium text-gray-800 bg-green-100 rounded-md hover:bg-green-200 focus:outline-none focus:ring"
                >
                  Create
                </button>
              </div>
            </form>
            
            <div className="text-center">
              <span className="text-gray-600">Already have an account?</span>{' '}
              <Link to="/Login" className="text-blue-500 hover:underline">Log In</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccountPage;