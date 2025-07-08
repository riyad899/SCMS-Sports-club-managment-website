import { useCoupons } from "../Context/CouponsContext";
import Loading from "../Loading/Loading";


const Promotions = () => {
  const { coupons, loading } = useCoupons();

  if (loading) return <Loading />;

  return (
    <section className="bg-[#f9fbfd] py-12 px-4 md:px-8">
      <h2 className="text-4xl font-bold text-center text-[#162E50] mb-10">Current Promotions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {coupons?.map((coupon) => (
          <div
            key={coupon._id}
            className="bg-white border border-gray-200 shadow-lg rounded-xl p-6 transition hover:scale-105 duration-300"
          >
            <h3 className="text-2xl font-bold text-[#162E50] mb-2">{coupon.code}</h3>
            <p className="text-gray-600 mb-2">
              {coupon.description}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              Type: {coupon.discountType === "percentage" ? `${coupon.value}%` : `$${coupon.value}`} off
            </p>
            <p className="text-xs text-gray-400">Expires on: {new Date(coupon.expiry).toLocaleDateString()}</p>
            {coupon.isActive ? (
              <span className="inline-block mt-4 text-green-600 font-semibold">Active</span>
            ) : (
              <span className="inline-block mt-4 text-red-500 font-semibold">Expired</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Promotions;
