import React from 'react';
import { User, ShoppingBag, Search, Menu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onPageChange }) => {
  const { user, isLoggedIn, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => onPageChange('home')}
              className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <ShoppingBag className="h-8 w-8" />
              <span className="text-xl font-bold">ReWear</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for clothing..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => onPageChange('browse')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === 'browse'
                  ? 'text-emerald-600 bg-emerald-50'
                  : 'text-gray-700 hover:text-emerald-600'
              }`}
            >
              Browse
            </button>
            <button
              onClick={() => onPageChange('add-item')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === 'add-item'
                  ? 'text-emerald-600 bg-emerald-50'
                  : 'text-gray-700 hover:text-emerald-600'
              }`}
            >
              List Item
            </button>
            {user?.isAdmin && (
              <button
                onClick={() => onPageChange('admin')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 'admin'
                    ? 'text-emerald-600 bg-emerald-50'
                    : 'text-gray-700 hover:text-emerald-600'
                }`}
              >
                Admin
              </button>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                  <span className="font-medium">{user?.points} pts</span>
                </div>
                <button
                  onClick={() => onPageChange('dashboard')}
                  className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 transition-colors"
                >
                  <User className="h-6 w-6" />
                  <span className="hidden md:inline">{user?.name}</span>
                </button>
                <button
                  onClick={logout}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onPageChange('login')}
                  className="text-gray-700 hover:text-emerald-600 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => onPageChange('register')}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden">
            <Menu className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;