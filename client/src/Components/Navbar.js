import React, { useState } from 'react';
import { FaSearch, FaBars, FaTimes, FaPlus, FaUsers } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { PiUserCircleGearFill } from "react-icons/pi";

const Navbar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    navigate(`/search?${urlParams.toString()}`);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-lime-400 shadow-lg sticky top-0 z-50 text-white">
      <div className="container mx-auto px-24 py-3">
        {/* Top Row - Logo, Search, Mobile Menu Button */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="font-bold text-lg sm:text-xl whitespace-nowrap">
              <span className="text-blue-600">SMART</span>
              <span className="text-gray-800">RENTAL</span>
            </h1>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <form 
            onSubmit={handleSubmit} 
            className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 mx-4 flex-1 max-w-md"
          >
            <input
              type="text"
              placeholder="Search properties..."
              className="bg-transparent outline-none w-full text-sm text-gray-700 placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="text-gray-500 hover:text-blue-600 transition-colors">
              <FaSearch />
            </button>
          </form>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>

          {/* Desktop Navigation Items */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-blue-600 text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-blue-600 text-sm font-medium transition-colors"
            >
              About
            </Link>
            
            {/* Owner-specific link */}
            {currentUser?.role === 'owner' && (
              <Link
                to="/create-property"
                className="flex items-center text-gray-700 hover:text-blue-600 text-sm font-medium transition-colors"
              >
                <FaPlus className="mr-1" /> Create
              </Link>
            )}
            
            {/* Admin-specific link */}
            {currentUser?.role === 'admin' && (
              <Link
                to="/admin/users"
                className="flex items-center text-gray-700 hover:text-blue-600 text-sm font-medium transition-colors"
              >
                <FaUsers className="mr-1" /> Users
              </Link>
            )}
            
            {currentUser ? (
              <Link to="/profile" className="flex items-center">
                <PiUserCircleGearFill className="text-2xl text-gray-700 hover:text-blue-600 transition-colors" />
              </Link>
            ) : (
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap"
              >
                Register
              </Link>
            )}
          </nav>
        </div>

        {/* Mobile Search - Visible only on mobile */}
        <form 
          onSubmit={handleSubmit} 
          className="mt-3 md:hidden flex items-center bg-gray-100 rounded-lg px-3 py-2 w-full"
        >
          <input
            type="text"
            placeholder="Search properties..."
            className="bg-transparent outline-none w-full text-sm text-gray-700 placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="text-gray-500 hover:text-blue-600 transition-colors">
            <FaSearch />
          </button>
        </form>

        {/* Mobile Menu - Slides down when open */}
        {isMenuOpen && (
          <nav className="md:hidden mt-3 pb-2 border-t border-gray-200">
            <div className="flex flex-col space-y-3 pt-3">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                onClick={toggleMenu}
              >
                About
              </Link>
              
              {/* Owner-specific mobile link */}
              {currentUser?.role === 'owner' && (
                <Link
                  to="/create-property"
                  className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                  onClick={toggleMenu}
                >
                  <FaPlus className="mr-2" /> Create Property
                </Link>
              )}
              
              {/* Admin-specific mobile link */}
              {currentUser?.role === 'admin' && (
                <Link
                  to="/admin/users"
                  className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                  onClick={toggleMenu}
                >
                  <FaUsers className="mr-2" /> User List
                </Link>
              )}
              
              {currentUser ? (
                <Link 
                  to="/profile" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2 flex items-center"
                  onClick={toggleMenu}
                >
                  <PiUserCircleGearFill className="text-2xl mr-2" />
                  Profile
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium text-center"
                  onClick={toggleMenu}
                >
                  Register
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;