import React, { useEffect, useState } from "react";
import About from "./About/About";
import SportsClubComponent from "./About/SportsClubComponent";
import { LocationSection } from "./LocationSection/LocationSection";
import Promotions from "../../Component/Promotions/Promotions";

const images = [
  {
    src: "https://images.unsplash.com/flagged/photo-1576972405668-2d020a01cbfa?q=80&w=1174&auto=format&fit=crop",
    alt: "Club",
  },
  {
    src: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1170&auto=format&fit=crop",
    alt: "Courts",
  },
  {
    src: "https://plus.unsplash.com/premium_photo-1685366454253-cb705836c5a8?q=80&w=1170&auto=format&fit=crop",
    alt: "Activities",
  },
];

export const Home = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Handle scroll to section on page load if hash is present
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100); // Small delay to ensure components are rendered
    }
  }, []);

  return (
  <div>
    <div className="w-full py-2 px-2 flex items-center justify-center">
      <div className="relative w-full max-w-7xl h-[500px] overflow-hidden rounded-2xl shadow-lg">
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              current === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover rounded-2xl"
            />
            <div className="absolute inset-0  bg-opacity-40 flex flex-col items-center justify-center text-white px-4 text-center rounded-2xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-xl">
                Explore Our {img.alt}
              </h1>
              <p className="text-lg md:text-xl max-w-2xl mb-6 drop-shadow-lg">
                Join our premium sports club to access top-class{" "}
                {img.alt.toLowerCase()} and activities for all members.
              </p>
              <button className="btn px-6 bg-[#162E50] text-white hover:bg-[#1c3a66] border-none rounded-md">
                Get Started
              </button>
            </div>
          </div>
        ))}

        {/* Dots */}
        <div className="absolute bottom-4 w-full flex justify-center space-x-2 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                current === index ? "bg-white" : "bg-gray-400"
              }`}
            ></button>
          ))}
        </div>
      </div>
    </div>
    <SportsClubComponent></SportsClubComponent>
    <section id="location" className="scroll-mt-20">
      <LocationSection></LocationSection>
    </section>
    <section id="promotions" className="scroll-mt-20">
      <Promotions></Promotions>
    </section>
    <section id="about" className="scroll-mt-20">
      <About></About>
    </section>

  </div>

  );
};
