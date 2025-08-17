import React, { useState } from 'react'
import { MapPin, Search, Navigation, Phone } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router";
import Swal from 'sweetalert2';
import { useTheme } from '../../../Component/Context/ThemeContext';

// Fix for Leaflet marker icons not showing after deployment
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import markerRetina from 'leaflet/dist/images/marker-icon-2x.png';

// Delete default icon
delete L.Icon.Default.prototype._getIconUrl;

// Set up default icon
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerRetina,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const locations = [
  {
    name: "Dhaka Club",
    address: "Minto Road, Ramna, Dhaka 1000",
    lat: 23.738295,
    lng: 90.403776,
  },
  {
    name: "Chittagong Arena",
    address: "Agrabad Commercial Area, Chittagong",
    lat: 22.335129,
    lng: 91.832958,
  },
  {
    name: "Sylhet Sports Hub",
    address: "Zindabazar Main Road, Sylhet",
    lat: 24.889795,
    lng: 91.867486,
  },
  {
    name: "Rajshahi Club",
    address: "Shaheb Bazar, Rajshahi City",
    lat: 24.3636,
    lng: 88.6241,
  },
  {
    name: "Khulna Field",
    address: "KDA Avenue, Khulna",
    lat: 22.8204,
    lng: 89.5587,
  },
  {
    name: "Barisal Court",
    address: "Band Road, Barisal",
    lat: 22.701,
    lng: 90.3535,
  },
];

export const LocationSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const handleGetDirections = (location) => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;
    window.open(googleMapsUrl, '_blank');
  };

  const handleBookAtLocation = (location) => {
    navigate('/courts', { state: { selectedLocation: location.name } });
  };

  const handleCallLocation = (location) => {
    Swal.fire({
      title: `Contact ${location.name}`,
      html: `
        <div style="text-align: center;">
          <p style="margin-bottom: 15px;"><strong>📍 Address:</strong><br>${location.address}</p>
          <p style="margin-bottom: 15px;"><strong>📞 Phone:</strong><br>+880 1234 567 890</p>
          <p style="font-size: 14px; color: #666;">Would you like to call this location?</p>
        </div>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Call Now',
      cancelButtonText: 'Close',
      confirmButtonColor: '#162E50',
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = 'tel:+8801234567890';
      }
    });
  };

  const filteredLocations = locations.filter((loc) =>
    loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loc.address.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
     <section className={`py-16 relative transition-colors duration-300 ${
       isDark ? 'bg-gray-800' : 'bg-gray-50'
     }`}>
      <div className="max-w-7xl mx-auto px-8">
        <h2 className={`text-4xl font-bold text-center mb-10 transition-colors duration-300 ${
          isDark ? 'text-white' : 'text-[#162E50]'
        }`}>
          Our Club Locations Across Bangladesh
        </h2>

        {/* Search Input */}
        <div className="mb-8 max-w-xl mx-auto relative">
          <Search className={`absolute top-3 left-3 ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`} />
          <input
            type="text"
            placeholder="Search location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 transition-colors duration-300 ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-[#162E50]'
            }`}
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredLocations.map((loc, index) => (
            <div
              key={index}
              onClick={() => setSelectedLocation(loc)}
              className={`cursor-pointer p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 hover:border-blue-400 hover:bg-gray-600' 
                  : 'bg-white border-gray-100 hover:border-[#162E50]'
              }`}
            >
              <div className={`flex items-center gap-3 mb-2 font-semibold text-lg transition-colors duration-300 ${
                isDark ? 'text-blue-400' : 'text-[#162E50]'
              }`}>
                <MapPin className="w-5 h-5" />
                {loc.name}
              </div>
              <p className={`text-sm mb-4 transition-colors duration-300 ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>{loc.address}</p>
              
              {/* Action Buttons */}
              <div className="flex gap-2 flex-wrap">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGetDirections(loc);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors duration-300 ${
                    isDark 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-[#162E50] text-white hover:bg-[#1c3a66]'
                  }`}
                >
                  <Navigation className="w-4 h-4" />
                  Directions
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookAtLocation(loc);
                  }}
                  className={`px-3 py-2 border rounded-lg text-sm transition-colors duration-300 ${
                    isDark 
                      ? 'border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white' 
                      : 'border-[#162E50] text-[#162E50] hover:bg-[#162E50] hover:text-white'
                  }`}
                >
                  Book Court
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCallLocation(loc);
                  }}
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors duration-300"
                >
                  <Phone className="w-4 h-4" />
                  Call
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <h3 className={`text-4xl font-bold text-center mb-10 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-[#162E50]'
          }`}>
            Explore Us on the Map
          </h3>
          <MapContainer
            center={
              selectedLocation
                ? [selectedLocation.lat, selectedLocation.lng]
                : [23.738295, 90.403776]
            }
            zoom={7}
            scrollWheelZoom={false}
            className="w-full h-[400px] rounded-xl shadow-md z-10"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap contributors"
            />
            {filteredLocations.map((loc, index) => (
              <Marker key={index} position={[loc.lat, loc.lng]}>
                <Popup>
                  <strong>{loc.name}</strong> <br />
                  {loc.address}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </section>
  )
}
