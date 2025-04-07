
import React, { useState } from 'react';
import { Menu, Bell, Sun, Moon, Settings, LogOut, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getInitials } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  toggleSidebar: () => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  toggleSidebar, 
  toggleTheme,
  isDarkMode 
}) => {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
  };

  const handleEditProfile = () => {
    setProfileOpen(false);
    navigate('/edit-profile');
  };
  
  const handleSettings = () => {
    setProfileOpen(false);
    navigate('/settings');
  };

  return (
    <header className="h-16 px-4 flex items-center justify-between bg-white dark:bg-myers-darkBlue border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 transition-colors duration-300">
      {/* Left Side */}
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mr-4"
        >
          <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
      
      {/* Right Side */}
      <div className="flex items-center space-x-2">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5 text-myers-yellow" />
          ) : (
            <Moon className="h-5 w-5 text-gray-600" />
          )}
        </button>
        
        {/* <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
          <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white dark:border-myers-darkBlue"></span>
        </button> */}
        
        <div className="relative">
          <button 
            onClick={toggleProfile}
            className="flex items-center space-x-2 p-1 rounded-full transition-colors focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-myers-yellow text-myers-darkBlue flex items-center justify-center text-sm font-medium">
              {user ? getInitials(user.name) : 'U'}
            </div>
          </button>
          
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 py-1 z-40">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-800">
                <p className="text-sm font-medium dark:text-white">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                <div className="mt-1 text-xs text-white bg-gray-600 dark:bg-gray-700 rounded-full px-2 py-0.5 inline-block">
                  {user?.role}
                </div>
              </div>
              
              <button 
                onClick={handleEditProfile}
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left"
              >
                <Settings className="w-4 h-4 mr-2" /> 
                Update Profile
              </button>
              
              <button 
                onClick={handleSettings}
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left"
              >
                <Settings className="w-4 h-4 mr-2" /> 
                System Settings
              </button>
              
              <button 
                onClick={logout}
                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left"
              >
                <LogOut className="w-4 h-4 mr-2" /> 
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
