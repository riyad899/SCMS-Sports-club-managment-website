import React from 'react';
import {
  ShoppingCart,
  RefreshCw,
  ChevronLeft,
  Wifi,
  Battery,
  Signal
} from 'lucide-react';

const SportsClubComponent = () => {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#162E50]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#162E50]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-[#162E50]/10 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-14">
          {/* Mobile App mockup */}
          <div className="flex-1 flex justify-center lg:justify-start">
            <div className="relative">
              <div className="bg-black rounded-[2.5rem] p-2 shadow-2xl hover:scale-105 transition-transform duration-300">
                <div className="bg-gray-900 rounded-[2rem] overflow-hidden w-80 h-[600px] relative">
                  {/* Status Bar */}
                  <div className="bg-black px-6 py-2 flex justify-between items-center text-white text-sm">
                    <span className="font-medium">15:24</span>
                    <div className="flex items-center gap-1">
                      <Signal className="w-4 h-4" />
                      <Wifi className="w-4 h-4" />
                      <Battery className="w-4 h-4" />
                    </div>
                  </div>

                  {/* App Header */}
                  <div className="bg-[#1c3a66] px-6 py-4 flex items-center justify-between">
                    <ChevronLeft className="w-6 h-6 text-white" />
                    <h1 className="text-white font-semibold text-lg">SCMS</h1>
                    <div className="flex gap-3">
                      <ShoppingCart className="w-6 h-6 text-white" />
                      <RefreshCw className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* App Content */}
                  <div className="bg-white flex-1 p-6">
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-bold text-gray-800">Tennis Session</h2>
                        <span className="text-red-500 text-xl cursor-pointer">🗑️</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>2 slots</span>
                        <span className="text-[#162E50]">24% filled</span>
                        <span className="text-[#162E50]"># 162</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <span className="text-gray-600 text-sm">Next Event</span>
                      <div className="text-[#162E50] font-medium text-sm mt-1">5v5 Tournament</div>
                    </div>

                    <div className="space-y-4">
                      {[
                        { name: 'John Smith', role: 'Trainer', avatar: '👨‍🏫' },
                        { name: 'Sarah Johnson', role: 'Member', avatar: '👩‍💼' },
                        { name: 'Mike Wilson', role: 'Coach', avatar: '🏋️‍♂️' }
                      ].map((user, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#162E50] to-blue-600 flex items-center justify-center text-white text-xl">
                              {user.avatar}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">{user.name}</h3>
                              <p className="text-sm text-gray-600">{user.role}</p>
                            </div>
                          </div>
                          <button className="btn btn-sm bg-[#162E50] text-white border-none hover:bg-[#1c3a66]">
                            Connect
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content section */}
          <div className="flex-1 text-gray-800 space-y-6">
            <div className="space-y-4">
              <p className="text-[#162E50] text-sm font-medium tracking-wide uppercase">
                Discover the Power of Our Club
              </p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
                Train with the <span className="text-[#162E50]">Best</span><br />
                Experience Top-tier <span className="text-orange-500">Facilities</span>
              </h1>
            </div>

            <div className="space-y-4 text-gray-600 text-lg">
              <p>
                We offer world-class courts, elite coaching, and a vibrant community that empowers you to reach your peak potential.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Join Now</span> and transform your passion into performance.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button className="btn btn-primary bg-[#162E50] border-none text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-[#1c3a66] transition-all duration-300">
                Sign Up Now
              </button>
              <button className="btn btn-outline border-[#162E50] text-[#162E50] hover:bg-[#162E50] hover:text-white px-8 py-3 rounded-full font-semibold text-lg">
                Explore Programs
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating accents */}
      <div className="absolute bottom-10 left-10 hidden lg:block">
        <div className="w-6 h-6 bg-orange-400 rounded-full animate-pulse"></div>
      </div>
      <div className="absolute top-1/4 right-20 hidden lg:block">
        <div className="w-4 h-4 bg-[#162E50] rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

export default SportsClubComponent;
