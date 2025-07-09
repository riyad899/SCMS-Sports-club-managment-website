
import { Link, NavLink, useLocation } from 'react-router';
import { FaBars } from 'react-icons/fa';

import { Logo } from '../../Component/Logo/Logo';
import { useAuth } from '../../Component/hooks/AuthContext';



const Navber = () => {
  const { user, logOut } = useAuth();
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

  const navLinks = (
    <>
      <li><NavLink to="/">Home</NavLink></li>
      <li><NavLink to="/courts">Courts</NavLink></li>
      <li><button onClick={() => scrollToSection('location')} className="hover:text-primary cursor-pointer">Location</button></li>
      <li><button onClick={() => scrollToSection('promotions')} className="hover:text-primary cursor-pointer">Current Promotions</button></li>
      <li><button onClick={() => scrollToSection('about')} className="hover:text-primary cursor-pointer">About</button></li>

    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-md px-4 lg:px-10">
      <div className="navbar-start">
        <Link to="/" className="text-xl font-bold flex items-center gap-2">
        <Logo></Logo>
          <span>Sports Club</span>
        </Link>
      </div>

      {/* For smaller screens */}
      <div className="navbar-center lg:hidden">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <FaBars size={20} />
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[99] p-2 shadow bg-base-100 rounded-box w-52">
            {navLinks}
          </ul>
        </div>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-3 font-medium">
          {navLinks}
        </ul>
      </div>

      <div className="navbar-end">
        {user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={user.photoURL || 'https://i.ibb.co/4pDNDk1/avatar.png'} />
              </div>
            </div>
            <ul tabIndex={0} className="mt-3 z-[99] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li><span className="text-sm px-3 py-2 font-semibold">{user.displayName || user.email}</span></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
        ) : (
          <Link to="/login" className="btn btn-outline btn-sm rounded-md">Login</Link>
        )}
      </div>
    </div>
  );
};

export default Navber;
