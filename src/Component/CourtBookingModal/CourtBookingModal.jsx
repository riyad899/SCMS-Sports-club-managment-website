
import { useState } from "react";
import Swal from "sweetalert2";
import { UseaxiosPublic } from "../hooks/UseAxiosPublic";
import { useAuth } from "../hooks/AuthContext";

const CourtBookingModal = ({ court, setSelectedCourt }) => {
  const { user } = useAuth();
  const axiosSecure = UseaxiosPublic();

  const [selectedSlots, setSelectedSlots] = useState([]);
  const [date, setDate] = useState("");

  const handleSlotChange = (slot) => {
    setSelectedSlots((prev) =>
      prev.includes(slot)
        ? prev.filter((s) => s !== slot)
        : [...prev, slot]
    );
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedSlots.length || !date) return;

    const booking = {
      userEmail: user.email,
      courtId: court._id,
      courtType: court.type,
      slots: selectedSlots,
      date,
      price: court.price * selectedSlots.length,
      status: "pending",
      payment: "not_paid",
    };

    try {
      await axiosSecure.post("/bookings", booking);
      Swal.fire({
        icon: "success",
        title: "Booking Requested!",
        text: "Awaiting admin approval.",
        confirmButtonColor: "#162E50",
      });
      setSelectedCourt(null);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Booking Failed!",
        text: err.message,
      });
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/2 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={() => setSelectedCourt(null)}
          className="absolute top-2 right-4 text-2xl text-gray-500"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-[#162E50]">Book {court.type} Court</h2>

        <form onSubmit={handleBooking} className="space-y-4">
          <input className="input input-bordered w-full" value={user.email} readOnly />
          <input className="input input-bordered w-full" value={court.type} readOnly />
          <input
            type="date"
            className="input input-bordered w-full"
            required
            onChange={(e) => setDate(e.target.value)}
          />

          <div className="space-y-2">
            <p className="font-medium text-gray-700">Select Slots:</p>
            <div className="grid grid-cols-2 gap-2">
              {court.slots.map((slot) => (
                <label key={slot} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={slot}
                    checked={selectedSlots.includes(slot)}
                    onChange={() => handleSlotChange(slot)}
                  />
                  {slot}
                </label>
              ))}
            </div>
          </div>

          <p>
            Total Price: <span className="font-bold">Tk{court.price * selectedSlots.length}</span>
          </p>

          <button
            type="submit"
            className="btn w-full bg-[#162E50] text-white hover:bg-[#1c3a66]"
          >
            Submit Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default CourtBookingModal;
