// 📁 src/pages/Courts.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../Component/hooks/AuthContext";
import CourtBookingModal from "../../Component/CourtBookingModal/CourtBookingModal";
import Loading from "../../Component/Loading/Loading";
import { useNavigate, useLocation } from "react-router";
import { UseaxiosPublic } from "../../Component/hooks/UseAxiosPublic";
import { ChevronDown, SortAsc, SortDesc, RotateCcw, Database } from "lucide-react";

const Courts = () => {
  const [courts, setCourts] = useState([]);
  const [filteredCourts, setFilteredCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [viewFormat, setViewFormat] = useState('card'); // 'card' or 'table'
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('name'); // 'name', 'price-asc', 'price-desc'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFromCache, setIsFromCache] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = UseaxiosPublic();

  // Cache configuration
  const CACHE_KEY = 'courts_data';
  const CACHE_TIMESTAMP_KEY = 'courts_data_timestamp';
  const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

  // Function to get cached data
  const getCachedCourts = () => {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      
      if (cachedData && cachedTimestamp) {
        const timestamp = parseInt(cachedTimestamp);
        const now = Date.now();
        
        // Check if cache is still valid (within 30 minutes)
        if (now - timestamp < CACHE_DURATION) {
          setIsFromCache(true);
          return JSON.parse(cachedData);
        }
      }
      setIsFromCache(false);
      return null;
    } catch (error) {
      console.error('Error reading from cache:', error);
      return null;
    }
  };

  // Function to set cached data
  const setCachedCourts = (data) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  };

  // Function to clear cache (optional, for manual cache clearing)
  const clearCache = () => {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TIMESTAMP_KEY);
  };

  // Pagination settings
  const cardPageSize = 6;
  const tablePageSize = 10;
  const pageSize = viewFormat === 'card' ? cardPageSize : tablePageSize;

  // Calculate pagination
  const totalPages = Math.ceil(filteredCourts.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentCourts = filteredCourts.slice(startIndex, endIndex);

  useEffect(() => {
    const fetchCourts = async () => {
      // First, try to get cached data
      const cachedCourts = getCachedCourts();
      
      if (cachedCourts) {
        // Use cached data
        console.log('Loading courts from cache');
        setCourts(cachedCourts);
        setFilteredCourts(cachedCourts);
        setLoading(false);
      } else {
        // Fetch fresh data from API
        console.log('Fetching courts from API');
        setIsFromCache(false);
        try {
          const res = await axiosSecure.get("/courts");
          const courtsData = res.data;
          
          // Update state
          setCourts(courtsData);
          setFilteredCourts(courtsData);
          
          // Cache the data
          setCachedCourts(courtsData);
          
          setLoading(false);
        } catch (error) {
          console.error('Error fetching courts:', error);
          setLoading(false);
        }
      }
    };

    fetchCourts();
  }, [axiosSecure]);

  // Sorting function
  const sortCourts = (courtsList, sortType) => {
    const sorted = [...courtsList];
    switch (sortType) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name':
      default:
        return sorted.sort((a, b) => a.type.localeCompare(b.type));
    }
  };

  // Handle sorting
  useEffect(() => {
    const sorted = sortCourts(courts, sortBy);
    setFilteredCourts(sorted);
    setCurrentPage(1); // Reset to first page when sorting
  }, [courts, sortBy]);

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

  const handleSortChange = (sortType) => {
    setSortBy(sortType);
    setIsDropdownOpen(false);
  };

  const handleRefreshData = async () => {
    setLoading(true);
    clearCache();
    
    try {
     
      const res = await axiosSecure.get("/courts");
      const courtsData = res.data;
      
      // Update state
      setCourts(courtsData);
      setFilteredCourts(courtsData);
      
      // Cache the fresh data
      setCachedCourts(courtsData);
      
      setLoading(false);
    } catch (error) {
      console.error('Error refreshing courts:', error);
      setLoading(false);
    }
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'price-asc':
        return 'Price: Low to High';
      case 'price-desc':
        return 'Price: High to Low';
      case 'name':
      default:
        return 'Name: A to Z';
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="py-10 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-10 text-[#162E50]">
        Available Courts
      </h2>

      {/* Controls Row */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        {/* View Format Toggle */}
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

        {/* Sort and Refresh Controls */}
        <div className="flex items-center gap-3">
          {/* Cache Status Indicator */}
          {isFromCache && (
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <Database className="w-4 h-4" />
              <span>Loaded from cache</span>
            </div>
          )}
          
          {/* Refresh Button */}
          <button
            onClick={handleRefreshData}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh data"
          >
            <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-[#162E50] transition-colors"
            >
              <span className="text-gray-700">Sort by: {getSortLabel()}</span>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => handleSortChange('name')}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 ${
                    sortBy === 'name' ? 'bg-[#162E50] text-white' : 'text-gray-700'
                  }`}
                >
                  <SortAsc className="w-4 h-4" />
                  Name: A to Z
                </button>
                <button
                  onClick={() => handleSortChange('price-asc')}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 ${
                    sortBy === 'price-asc' ? 'bg-[#162E50] text-white' : 'text-gray-700'
                  }`}
                >
                  <SortAsc className="w-4 h-4" />
                  Price: Low to High
                </button>
                <button
                  onClick={() => handleSortChange('price-desc')}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 ${
                    sortBy === 'price-desc' ? 'bg-[#162E50] text-white' : 'text-gray-700'
                  }`}
                >
                  <SortDesc className="w-4 h-4" />
                  Price: High to Low
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Data Display Info */}
      <div className="text-center mb-6">
        <p className="text-gray-600">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredCourts.length)} of {filteredCourts.length} courts
        </p>
      </div>

      {/* Card View */}
      {viewFormat === 'card' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCourts.map((court) => (
            <div key={court._id} className="card bg-white shadow-lg rounded-lg overflow-hidden h-full flex flex-col">
              <div className="h-48 w-full overflow-hidden">
                <img src={court.image} alt={court.type} className="h-full w-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-[#162E50] mb-2">{court.type} Court</h3>
                  <div className="space-y-2 mb-4">
                    <p className="text-lg font-semibold text-green-600">Tk{court.price} <span className="text-sm text-gray-500">per session</span></p>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Available Slots:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {court.slots.map((slot, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {slot}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (user) {
                      setSelectedCourt(court);
                    } else {
                      // Store current location to redirect back after login
                      navigate("/login", { state: { from: location } });
                    }
                  }}
                  className="btn bg-[#162E50] text-white w-full py-3 rounded-lg hover:bg-[#1c3a66] transition-colors font-medium"
                >
                  {user ? "Book Now" : "Login to Book"}
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
                    <div className="text-sm font-semibold text-green-600">Tk{court.price} per session</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {court.slots.map((slot, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full whitespace-nowrap">
                          {slot}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => {
                        if (user) {
                          setSelectedCourt(court);
                        } else {
                          // Store current location to redirect back after login
                          navigate("/login", { state: { from: location } });
                        }
                      }}
                      className="btn bg-[#162E50] text-white px-4 py-2 rounded hover:bg-[#1c3a66]"
                    >
                      {user ? "Book Now" : "Login to Book"}
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
