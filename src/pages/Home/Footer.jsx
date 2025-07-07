import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#162E50] text-white px-6 py-10 mt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Site Info */}
        <div>
          <h2 className="text-2xl font-bold mb-3">Sports Club</h2>
          <p className="text-sm">
            Your trusted platform for court booking, membership, and session management.
            Empowering single clubs with efficient tools.
          </p>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Contact Info</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-lg" />
              <span>123 Club Street, Dhaka, Bangladesh</span>
            </div>
            <div className="flex items-center gap-2">
              <FaPhoneAlt className="text-lg" />
              <span>+880 1234 567 890</span>
            </div>
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-lg" />
              <span>support@sportsclub.com</span>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Follow Us</h3>
          <div className="flex gap-5 text-2xl mt-2">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-400"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-sky-400"
            >
              <FaTwitter />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-pink-400"
            >
              <FaInstagram />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-300"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-600 pt-4 text-center text-sm">
        © {new Date().getFullYear()} Sports Club Management. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
