import React, { useState } from 'react'
import { MapPin, Search } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

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

  const filteredLocations = locations.filter((loc) =>
    loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loc.address.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
     <section className="py-16 bg-gray-50 relative">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-[#162E50] mb-10">
          Our Club Locations Across Bangladesh
        </h2>

        {/* Search Input */}
        <div className="mb-8 max-w-xl mx-auto relative">
          <Search className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#162E50]"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredLocations.map((loc, index) => (
            <div
              key={index}
              onClick={() => setSelectedLocation(loc)}
              className="bg-white cursor-pointer p-6 rounded-xl shadow-md hover:shadow-xl transition border border-gray-100 hover:border-[#162E50]"
            >
              <div className="flex items-center gap-3 mb-2 text-[#162E50] font-semibold text-lg">
                <MapPin className="w-5 h-5" />
                {loc.name}
              </div>
              <p className="text-gray-600 text-sm">{loc.address}</p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <h3 className="text-4xl font-bold text-center text-[#162E50] mb-10">
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
