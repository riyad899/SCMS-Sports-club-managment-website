import { useCoupons } from "../Context/CouponsContext";
import Loading from "../Loading/Loading";
import { useNavigate } from "react-router";
import Swal from 'sweetalert2';
import { useAuth } from "../hooks/AuthContext";
import { useTheme } from "../Context/ThemeContext";


const Promotions = () => {
  const { coupons, loading } = useCoupons();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleClaimCoupon = (coupon) => {
    // Check if user is logged in
    if (!user) {
      Swal.fire({
        title: 'Login Required',
        text: 'You need to be logged in to claim coupons. Please login first.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Go to Login',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#162E50',
        cancelButtonColor: '#6c757d'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
      return;
    }

    Swal.fire({
      title: 'Claim Coupon',
      html: `
        <div style="text-align: center;">
          <h3 style="color: #162E50; margin-bottom: 10px;">${coupon.code}</h3>
          <p style="margin-bottom: 15px;">${coupon.description}</p>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <strong>Discount: ${coupon.discountType === "percentage" ? `${coupon.value}%` : `$${coupon.value}`} off</strong>
          </div>
          <p style="font-size: 14px; color: #666;">
            Expires: ${new Date(coupon.expiry).toLocaleDateString()}
          </p>
        </div>
      `,
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Use Coupon',
      cancelButtonText: 'Save for Later',
      confirmButtonColor: '#162E50',
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed) {
        // Navigate to registration page with coupon
        navigate('/register', { state: { couponCode: coupon.code } });
      }
    });
  };

  if (loading) return <Loading />;

  return (
    <section className={`py-12 px-4 md:px-8 transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-[#f9fbfd]'
    }`}>
      <h2 className={`text-4xl font-bold text-center mb-10 transition-colors duration-300 ${
        isDark ? 'text-white' : 'text-[#162E50]'
      }`}>Current Promotions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {coupons?.map((coupon) => (
          <div
            key={coupon._id}
            className={`border shadow-lg rounded-xl p-6 transition-all hover:scale-105 duration-300 ${
              isDark 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}
          >
            <h3 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
              isDark ? 'text-blue-400' : 'text-[#162E50]'
            }`}>{coupon.code}</h3>
            <p className={`mb-2 transition-colors duration-300 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {coupon.description}
            </p>
            <p className={`text-sm mb-2 transition-colors duration-300 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Type: {coupon.discountType === "percentage" ? `${coupon.value}%` : `$${coupon.value}`} off
            </p>
            <p className={`text-xs transition-colors duration-300 ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}>Expires on: {new Date(coupon.expiry).toLocaleDateString()}</p>
            <div className="mt-4 flex items-center justify-between">
              {coupon.isActive ? (
                <>
                  <span className="text-green-600 font-semibold">Active</span>
                  <button 
                    onClick={() => handleClaimCoupon(coupon)}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors duration-300 ${
                      isDark 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-[#162E50] text-white hover:bg-[#1c3a66]'
                    }`}
                  >
                    Claim Now
                  </button>
                </>
              ) : (
                <span className="text-red-500 font-semibold">Expired</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Promotions;
