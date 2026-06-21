import { Link, useNavigate } from 'react-router-dom';
import { Home, User, Menu, X, Heart, GitCompare } from 'lucide-react';
import { useState } from 'react';
import { useUserStore } from '../../store/useUserStore';
import { usePropertyStore } from '../../store/usePropertyStore';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useUserStore();
  const { favorites, compareList } = usePropertyStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Home className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">EstateWork</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition">
              Home
            </Link>
            <Link to="/properties" className="text-gray-700 hover:text-primary-600 transition">
              Properties
            </Link>
            <Link to="/agents" className="text-gray-700 hover:text-primary-600 transition">
              Agents
            </Link>
            {user && (
              <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 transition">
                Dashboard
              </Link>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/favorites"
              className="relative p-2 text-gray-700 hover:text-primary-600 transition"
            >
              <Heart className="h-5 w-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            <Link
              to="/compare"
              className="relative p-2 text-gray-700 hover:text-primary-600 transition"
            >
              <GitCompare className="h-5 w-5" />
              {compareList.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {compareList.length}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition"
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-gray-700 hover:text-primary-600 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-sm text-gray-700 hover:text-primary-600 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-primary-600 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/properties"
                className="text-gray-700 hover:text-primary-600 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Properties
              </Link>
              <Link
                to="/agents"
                className="text-gray-700 hover:text-primary-600 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Agents
              </Link>
              {user && (
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-primary-600 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              <div className="flex items-center space-x-4 pt-4 border-t">
                <Link
                  to="/favorites"
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition"
                >
                  <Heart className="h-5 w-5" />
                  <span>Favorites ({favorites.length})</span>
                </Link>
                <Link
                  to="/compare"
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition"
                >
                  <GitCompare className="h-5 w-5" />
                  <span>Compare ({compareList.length})</span>
                </Link>
              </div>
              {!user && (
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  <button
                    onClick={() => {
                      navigate('/login');
                      setIsMenuOpen(false);
                    }}
                    className="px-4 py-2 text-sm text-gray-700 hover:text-primary-600 transition text-left"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      navigate('/register');
                      setIsMenuOpen(false);
                    }}
                    className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-left"
                  >
                    Sign Up
                  </button>
                </div>
              )}
              {user && (
                <button
                  onClick={async () => {
                    await handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="px-4 py-2 text-sm text-gray-700 hover:text-primary-600 transition text-left"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
