// 📁 src/pages/Courts.jsx
import { useEffect, useState } from "react";

import { useAuth } from "../../Component/hooks/AuthContext";
import { UseaxiousSecure } from "../../Component/hooks/UseaxiousSecure";
import CourtBookingModal from "../../Component/CourtBookingModal/CourtBookingModal";
import Loading from "../../Component/Loading/Loading";
import { useNavigate } from "react-router";

const Courts = () => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = UseaxiousSecure();

  useEffect(() => {
    axiosSecure.get("/courts").then((res) => {
      setCourts(res.data);
      setLoading(false);
    });
  }, [axiosSecure]);

  if (loading) return <Loading />;

  return (
    <div className="py-10 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-10 text-[#162E50]">
        Available Courts
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courts.map((court) => (
          <div key={court._id} className="card bg-white shadow-lg rounded-lg overflow-hidden">
            <img src={court.image} alt={court.type} className="h-56 w-full object-cover" />
            <div className="p-4 space-y-2">
              <h3 className="text-xl font-bold text-[#162E50]">{court.type} Court</h3>
              <p className="text-gray-600">Price: Tk{court.price} per session</p>
              <p className="text-gray-600">Available Slots: {court.slots.join(", ")}</p>
              <button
                onClick={() =>
                  user ? setSelectedCourt(court) : navigate("/login")
                }
                className="btn bg-[#162E50] text-white w-full mt-3 hover:bg-[#1c3a66]"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedCourt && (
        <CourtBookingModal
          court={selectedCourt}
          setSelectedCourt={setSelectedCourt}
        />
      )}
    </div>
  );
};

export default Courts;
