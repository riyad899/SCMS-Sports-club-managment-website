
import { Link, NavLink } from 'react-router';
import { FaBars } from 'react-icons/fa';
import { AuthProvider, useAuth } from '../../hooks/AuthContext';
import { Logo } from '../../Logo/Logo';



const Navber = () => {
  const { user, logOut } = useAuth();
  console.log(user)

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navLinks = (
    <>
      <li><NavLink to="/">Home</NavLink></li>
      <li><NavLink to="/courts">Courts</NavLink></li>
      <li><NavLink to="/about">About</NavLink></li>
      <li><NavLink to="/location">Location</NavLink></li>
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
