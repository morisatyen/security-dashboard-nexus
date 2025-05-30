
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, AlertTriangle, ArrowLeft } from 'lucide-react';
import logo from "../images/Onlylogo.png"
const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would call your auth service here
      // For demo, just show success message
      setSuccessMessage(`Password reset instructions sent to ${email}`);
      setEmail('');
    } catch (err) {
      setError('An error occurred while processing your request');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-myers-darkBlue px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden">
          {/* Top Section (Black background with logo) */}
          <div className="bg-[#14386B] dark:bg-black text-white py-8 px-4 sm:px-10 flex flex-col items-center relative">
            <div className="w-16 h-16 bg-[#ffffff] rounded-full flex items-center justify-center mb-4">
              {/* <svg 
                className="w-10 h-10 text-myers-darkBlue"
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
                  stroke="currentColor" 
                  strokeWidth="2"
                />
                <path 
                  d="M8 12H16M12 16V8" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                />
              </svg> */}
               <img src={logo} alt="User Avatar"  />
            </div>
            <h2 className="text-2xl font-bold">Reset Password</h2>
            <p className="mt-1 text-sm text-gray-300">Enter your email to reset your password</p>
            
            {/* Wave Divider */}
            <div className="absolute -bottom-5 left-0 w-full overflow-hidden">
              {/* <svg 
                className="w-full h-5" 
                viewBox="0 0 1200 120" 
                preserveAspectRatio="none"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
              </svg> */}
            </div>
          </div>
          
          {/* Bottom Section (White background with form) */}
          <div className="bg-white dark:bg-gray-800 py-8 px-4 sm:px-10">
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-red-800 dark:text-red-300">{error}</span>
              </div>
            )}
            
            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 rounded-lg">
                <span className="text-sm text-green-800 dark:text-green-300">{successMessage}</span>
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="pl-10 py-2 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 text-gray-900 dark:text-white rounded-md shadow-sm focus:ring-myers-yellow focus:border-myers-yellow"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-myers-darkBlue bg-myers-yellow hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-myers-yellow transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-myers-darkBlue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </div>
              
              <div className="text-center">
                <Link to="/login" className="inline-flex items-center text-sm text-myers-yellow hover:underline">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
