
import { Link, NavLink, useLocation } from 'react-router';
import { FaBars, FaChevronDown } from 'react-icons/fa';

import { Logo } from '../../Component/Logo/Logo';
import { useAuth } from '../../Component/hooks/AuthContext';
import ThemeToggle from '../../Component/ThemeToggle/ThemeToggle';
import { useTheme } from '../../Component/Context/ThemeContext';



const Navber = () => {
  const { user, logOut } = useAuth();
  const { isDark } = useTheme();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Function to handle smooth scrolling to sections
  const scrollToSection = (sectionId) => {
    // If we're not on the home page, navigate to home first
    if (location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Basic nav links for logged out users (3 routes)
  const basicNavLinks = (
    <>
      <li><NavLink to="/" className={`transition-colors ${
        isDark ? 'hover:text-blue-300' : 'hover:text-blue-600'
      }`}>Home</NavLink></li>
      <li><NavLink to="/courts" className={`transition-colors ${
        isDark ? 'hover:text-blue-300' : 'hover:text-blue-600'
      }`}>Courts</NavLink></li>
      <li><NavLink to="/events" className={`transition-colors ${
        isDark ? 'hover:text-blue-300' : 'hover:text-blue-600'
      }`}>Events</NavLink></li>
      <li><button onClick={() => scrollToSection('about')} className={`transition-colors cursor-pointer ${
        isDark ? 'hover:text-blue-300' : 'hover:text-blue-600'
      }`}>About</button></li>
    </>
  );

  // Extended nav links for logged in users (5 routes + protected routes in dropdown)
  const extendedNavLinks = (
    <>
      <li><NavLink to="/" className={`transition-colors ${
        isDark ? 'hover:text-blue-300' : 'hover:text-blue-600'
      }`}>Home</NavLink></li>
      <li><NavLink to="/courts" className={`transition-colors ${
        isDark ? 'hover:text-blue-300' : 'hover:text-blue-600'
      }`}>Courts</NavLink></li>
      <li><NavLink to="/events" className={`transition-colors ${
        isDark ? 'hover:text-blue-300' : 'hover:text-blue-600'
      }`}>Events</NavLink></li>
      <li><button onClick={() => scrollToSection('location')} className={`transition-colors cursor-pointer ${
        isDark ? 'hover:text-blue-300' : 'hover:text-blue-600'
      }`}>Location</button></li>
      <li><button onClick={() => scrollToSection('promotions')} className={`transition-colors cursor-pointer ${
        isDark ? 'hover:text-blue-300' : 'hover:text-blue-600'
      }`}>Promotions</button></li>
      <li><button onClick={() => scrollToSection('about')} className={`transition-colors cursor-pointer ${
        isDark ? 'hover:text-blue-300' : 'hover:text-blue-600'
      }`}>About</button></li>
      {/* Protected routes dropdown */}
      <li className="dropdown dropdown-hover">
        <div tabIndex={0} className={`flex items-center gap-1 cursor-pointer transition-colors ${
          isDark ? 'hover:text-blue-300' : 'hover:text-blue-600'
        }`}>
          More <FaChevronDown size={12} />
        </div>
        <ul tabIndex={0} className={`dropdown-content menu p-2 shadow rounded-box w-52 mt-1 ${
          isDark 
            ? 'bg-gray-800 text-white border border-gray-600' 
            : 'bg-white text-gray-800 border border-gray-200'
        }`}>
          <li><Link to="/dashboard" className={`transition-colors ${
            isDark 
              ? 'hover:bg-gray-700 hover:text-white' 
              : 'hover:bg-gray-100 hover:text-gray-900'
          }`}>Dashboard</Link></li>
        </ul>
      </li>
    </>
  );

  return (
    <div className={`w-full shadow-lg fixed top-0 z-50 transition-colors duration-300 ${
      isDark 
        ? 'bg-gray-900 text-white border-b border-gray-700' 
        : 'bg-white text-gray-800 border-b border-gray-200'
    }`}>
      <div className="navbar max-w-7xl mx-auto px-4 lg:px-10">
        <div className="navbar-start">
          <Link to="/" className={`text-xl font-bold flex items-center gap-2 transition-colors hover:opacity-80 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>
            <Logo></Logo>
            <span>Sports Club</span>
          </Link>
        </div>

        {/* Desktop menu */}
        <div className="navbar-center hidden lg:flex">
          <ul className={`menu menu-horizontal px-1 gap-3 font-medium ${
            isDark ? 'text-white' : 'text-gray-700'
          }`}>
            {user ? extendedNavLinks : basicNavLinks}
          </ul>
        </div>

        <div className="navbar-end flex items-center gap-2">
          {/* Theme Toggle Button */}
          <ThemeToggle />
          
          {/* Desktop buttons for logged out users */}
          <div className="hidden lg:flex">
            {user ? (
              <div className="dropdown dropdown-end">
                <div tabIndex={0} className={`btn btn-ghost btn-circle avatar transition-colors ${
                  isDark 
                    ? 'hover:bg-gray-700' 
                    : 'hover:bg-gray-100'
                }`}>
                  <div className={`w-10 rounded-full ring-2 ring-offset-2 ${
                    isDark 
                      ? 'ring-gray-400 ring-offset-gray-900' 
                      : 'ring-gray-300 ring-offset-white'
                  }`}>
                    <img src={user.photoURL || 'https://i.ibb.co/4pDNDk1/avatar.png'} alt="Profile" />
                  </div>
                </div>
                <ul tabIndex={0} className={`mt-3 z-[99] p-2 shadow menu menu-sm dropdown-content rounded-box w-52 ${
                  isDark 
                    ? 'bg-gray-800 text-white border border-gray-600' 
                    : 'bg-white text-gray-800 border border-gray-200'
                }`}>
                  <li><span className={`text-sm px-3 py-2 font-semibold ${
                    isDark ? 'text-white' : 'text-gray-800'
                  }`}>{user.displayName || user.email}</span></li>
                  <li><Link to="/dashboard" className={`transition-colors ${
                    isDark 
                      ? 'hover:bg-gray-700 hover:text-white' 
                      : 'hover:bg-gray-100 hover:text-gray-900'
                  }`}>Dashboard</Link></li>
                  <li><button onClick={handleLogout} className="hover:bg-red-500 hover:text-white transition-colors">Logout</button></li>
                </ul>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className={`btn btn-outline btn-sm rounded-md transition-colors ${
                  isDark 
                    ? 'text-white border-white hover:bg-white hover:text-gray-900' 
                    : 'text-gray-800 border-gray-800 hover:bg-gray-800 hover:text-white'
                }`}>Login</Link>
                <Link to="/register" className={`btn btn-sm rounded-md transition-colors ${
                  isDark 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}>Register</Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle - positioned on right */}
          <div className="lg:hidden">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className={`btn btn-ghost transition-colors ${
                isDark 
                  ? 'text-white hover:bg-gray-700' 
                  : 'text-gray-800 hover:bg-gray-100'
              }`}>
                <FaBars size={20} />
              </label>
              <ul tabIndex={0} className={`menu menu-sm dropdown-content mt-3 z-[99] p-2 shadow rounded-box w-52 ${
                isDark 
                  ? 'bg-gray-800 text-white border border-gray-600' 
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}>
                {/* Navigation Links */}
                {user ? extendedNavLinks : basicNavLinks}
                
                {/* Divider */}
                <div className={`divider my-1 ${
                  isDark ? 'border-gray-600' : 'border-gray-300'
                }`}></div>
                
                {/* Auth buttons for mobile */}
                {user ? (
                  <>
                    <li><span className={`text-sm px-3 py-2 font-semibold ${
                      isDark ? 'text-white' : 'text-gray-800'
                    }`}>{user.displayName || user.email}</span></li>
                    <li><Link to="/dashboard" className={`transition-colors ${
                      isDark 
                        ? 'hover:bg-gray-700 hover:text-white' 
                        : 'hover:bg-gray-100 hover:text-gray-900'
                    }`}>Dashboard</Link></li>
                    <li><button onClick={handleLogout} className="hover:bg-red-500 hover:text-white transition-colors">Logout</button></li>
                  </>
                ) : (
                  <>
                    <li><Link to="/login" className={`transition-colors ${
                      isDark 
                        ? 'hover:bg-gray-700 hover:text-white' 
                        : 'hover:bg-gray-100 hover:text-gray-900'
                    }`}>Login</Link></li>
                    <li><Link to="/register" className={`transition-colors ${
                      isDark 
                        ? 'hover:bg-gray-700 hover:text-white' 
                        : 'hover:bg-gray-100 hover:text-gray-900'
                    }`}>Register</Link></li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navber;
