
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from "../images/myerslogo.webp"
const Splash: React.FC = () => {
  const [redirect, setRedirect] = useState(false);
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setRedirect(true);
    }, 3000); // 2.5 seconds delay
    
    return () => clearTimeout(timer);
  }, []);
  
  if (redirect) {
    return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
  }
  
  return (
    <div className="fixed inset-0 bg-myers-darkBlue dark:bg-myers-darkBlue flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <div className="w-40 h-20 mb-2 relative">
          <div className="absolute inset-0  opacity-75 animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            {/* <svg 
              className="w-16 h-16 text-myers-darkBlue"
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
            <img src={logo} alt="User Avatar" className="h-20 w-40" />
          </div>
        </div>
        {/* <h1 className="text-myers-yellow text-3xl font-bold mb-4 animate-fade-in">Myers Security</h1> */}
        <div className="w-48 h-1 bg-myers-yellow rounded-full overflow-hidden">
          <div className="h-full bg-white animate-[pulse_1.5s_ease-in-out_infinite]"></div>
        </div>
        <p className="text-white text-lg mt-4 animate-fade-in opacity-50">Admin Dashboard</p>
      </div>
    </div>
  );
};

export default Splash;
