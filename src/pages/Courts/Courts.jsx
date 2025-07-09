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
  const [viewFormat, setViewFormat] = useState('card'); // 'card' or 'table'
  const [currentPage, setCurrentPage] = useState(1);

  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = UseaxiousSecure();

  // Pagination settings
  const cardPageSize = 6;
  const tablePageSize = 10;
  const pageSize = viewFormat === 'card' ? cardPageSize : tablePageSize;

  // Calculate pagination
  const totalPages = Math.ceil(courts.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentCourts = courts.slice(startIndex, endIndex);

  useEffect(() => {
    axiosSecure.get("/courts").then((res) => {
      setCourts(res.data);
      setLoading(false);
    });
  }, [axiosSecure]);

  // Reset to page 1 when view format changes
  useEffect(() => {
    setCurrentPage(1);
  }, [viewFormat]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewFormatChange = (format) => {
    setViewFormat(format);
  };

  if (loading) return <Loading />;

  return (
    <div className="py-10 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-10 text-[#162E50]">
        Available Courts
      </h2>

      {/* View Format Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 rounded-lg p-1 flex">
          <button
            onClick={() => handleViewFormatChange('card')}
            className={`px-4 py-2 rounded-md transition-colors ${
              viewFormat === 'card'
                ? 'bg-[#162E50] text-white'
                : 'text-gray-600 hover:text-[#162E50]'
            }`}
          >
            Card View
          </button>
          <button
            onClick={() => handleViewFormatChange('table')}
            className={`px-4 py-2 rounded-md transition-colors ${
              viewFormat === 'table'
                ? 'bg-[#162E50] text-white'
                : 'text-gray-600 hover:text-[#162E50]'
            }`}
          >
            Table View
          </button>
        </div>
      </div>

      {/* Data Display Info */}
      <div className="text-center mb-6">
        <p className="text-gray-600">
          Showing {startIndex + 1} to {Math.min(endIndex, courts.length)} of {courts.length} courts
        </p>
      </div>

      {/* Card View */}
      {viewFormat === 'card' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCourts.map((court) => (
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
      )}

      {/* Table View */}
      {viewFormat === 'table' && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-[#162E50] text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Court Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Available Slots
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentCourts.map((court) => (
                <tr key={court._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img src={court.image} alt={court.type} className="h-16 w-16 object-cover rounded" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{court.type} Court</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Tk{court.price} per session</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{court.slots.join(", ")}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() =>
                        user ? setSelectedCourt(court) : navigate("/login")
                      }
                      className="btn bg-[#162E50] text-white px-4 py-2 rounded hover:bg-[#1c3a66]"
                    >
                      Book Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded-md ${
                currentPage === 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#162E50] text-white hover:bg-[#1c3a66]'
              }`}
            >
              Previous
            </button>

            {/* Page Numbers */}
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded-md ${
                    currentPage === page
                      ? 'bg-[#162E50] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 rounded-md ${
                currentPage === totalPages
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#162E50] text-white hover:bg-[#1c3a66]'
              }`}
            >
              Next
            </button>
          </nav>
        </div>
      )}

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
