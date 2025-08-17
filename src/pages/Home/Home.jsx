import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, Calendar, Trophy, Star, Heart, ArrowRight, Phone, Mail, MapPin,
  ChevronLeft, ChevronRight, Play, Clock, Award, Target
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import Swal from 'sweetalert2';
import { useAuth } from "../../Component/hooks/AuthContext";
import { useTheme } from "../../Component/Context/ThemeContext";

// Import actual components
import About from "./About/About";
import SportsClubComponent from "./About/SportsClubComponent";
import { LocationSection } from "./LocationSection/LocationSection";
import Promotions from "../../Component/Promotions/Promotions";

// High-quality images with same aspect ratio (16:9)
const images = [
  {
    src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1920&h=1080&auto=format&fit=crop&ixlib=rb-4.0.3",
    alt: "Premium Sports Club",
    title: "Premium Sports Experience",
    subtitle: "World-Class Facilities",
    description: "Join our world-class sports club with state-of-the-art facilities designed for champions",
    buttonText: "Start Your Journey",
    accent: "Elite Training"
  },
  {
    src: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=1920&h=1080&auto=format&fit=crop&ixlib=rb-4.0.3",
    alt: "Professional Courts",
    title: "Professional Grade Courts", 
    subtitle: "Championship Ready",
    description: "Experience top-quality courts designed for optimal performance and competitive excellence",
    buttonText: "Book Your Court",
    accent: "Pro Level"
  },
  {
    src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1920&h=1080&auto=format&fit=crop&ixlib=rb-4.0.3",
    alt: "Community Activities",
    title: "Vibrant Community",
    subtitle: "Connect & Compete",
    description: "Connect with fellow athletes and build lasting friendships in our inclusive community",
    buttonText: "Join Community",
    accent: "Social Hub"
  },
];

export const Home = () => {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark } = useTheme();

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

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
      }, 100);
    }
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index) => {
    setCurrent(index);
  };

  // Featured sports data
  const featuredSports = [
    {
      title: "Tennis",
      image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=400&h=300&auto=format&fit=crop",
      description: "Professional tennis courts with expert coaching available for all skill levels.",
      features: ["6 Courts Available", "Professional Coaching", "Tournament Ready"],
      details: {
        price: "$25/hour",
        availability: "6 AM - 10 PM",
        equipment: "Rackets and balls available for rent",
        coaching: "Professional coaches available for private and group lessons"
      }
    },
    {
      title: "Basketball",
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=400&h=300&auto=format&fit=crop",
      description: "Full-size basketball courts perfect for both casual games and competitive play.",
      features: ["Indoor Courts", "League Games", "Youth Programs"],
      details: {
        price: "$20/hour",
        availability: "24/7 Access",
        equipment: "Basketballs and shoes available for rent",
        coaching: "Youth and adult basketball programs available"
      }
    },
    {
      title: "Swimming",
      image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=400&h=300&auto=format&fit=crop",
      description: "Olympic-sized swimming pool with lanes for both training and recreation.",
      features: ["Olympic Size Pool", "Swimming Lessons", "Aqua Fitness"],
      details: {
        price: "$15/session",
        availability: "5 AM - 11 PM",
        equipment: "Goggles and swim caps available",
        coaching: "Certified swimming instructors and lifeguards on duty"
      }
    },
    {
      title: "Fitness Center",
      image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=400&h=300&auto=format&fit=crop",
      description: "State-of-the-art gym equipment with personal training services available.",
      features: ["Modern Equipment", "Personal Training", "Group Classes"],
      details: {
        price: "$30/month",
        availability: "24/7 Access",
        equipment: "Latest cardio and strength training equipment",
        coaching: "Certified personal trainers and group fitness instructors"
      }
    }
  ];

  // State for modal
  const [selectedSport, setSelectedSport] = useState(null);

  // Function to handle learn more click
  const handleLearnMore = (sport) => {
    setSelectedSport(sport);
  };

  // Function to close modal
  const closeModal = () => {
    setSelectedSport(null);
  };

  // Navigation functions
  const handleStartJourney = () => {
    navigate('/register');
  };

  const handleBookCourt = () => {
    navigate('/courts');
  };

  const handleJoinCommunity = () => {
    navigate('/register');
  };

  const handleWatchTour = () => {
    // Scroll to about section
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBookNow = (sport) => {
    navigate('/courts');
  };

  const handleContactForInfo = () => {
    // Scroll to contact section
    const contactSection = document.querySelector('.contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If no contact section, show SweetAlert with contact info
      Swal.fire({
        title: 'Contact Information',
        html: `
          <div style="text-align: left;">
            <p><strong>📧 Email:</strong> support@sportsclub.com</p>
            <p><strong>📞 Phone:</strong> +880 1234 567 890</p>
            <p><strong>📍 Location:</strong> Dhaka, Bangladesh</p>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'Got it!',
        confirmButtonColor: '#162E50'
      });
    }
  };

  const handleChoosePlan = (plan) => {
    // Check if user is logged in
    if (!user) {
      Swal.fire({
        title: 'Login Required',
        text: 'You need to be logged in to choose a membership plan. Please login first.',
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

    navigate('/payment', { state: { selectedPlan: plan } });
  };

  const handleRegisterEvent = (event) => {
    if (!user) {
      // Show alert and redirect to login if user is not logged in
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to register for events',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Login Now',
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
    navigate('/events');
  };

  const handleSubscribeNewsletter = (email) => {
    if (email) {
      Swal.fire({
        title: 'Successfully Subscribed!',
        text: `Thank you for subscribing! You will receive updates at ${email}`,
        icon: 'success',
        confirmButtonText: 'Awesome!',
        confirmButtonColor: '#162E50',
        timer: 3000,
        timerProgressBar: true
      });
      // Here you would typically send the email to your backend
    } else {
      Swal.fire({
        title: 'Email Required',
        text: 'Please enter a valid email address to subscribe',
        icon: 'warning',
        confirmButtonText: 'Okay',
        confirmButtonColor: '#162E50'
      });
    }
  };

  const handleContactUs = () => {
    Swal.fire({
      title: 'Contact Information',
      html: `
        <div style="text-align: left; font-size: 16px;">
          <div style="margin-bottom: 15px;">
            <strong>📞 Phone:</strong><br>
            <span style="color: #162E50;">+880 1234 567 890</span>
          </div>
          <div style="margin-bottom: 15px;">
            <strong>📧 Email:</strong><br>
            <span style="color: #162E50;">support@sportsclub.com</span>
          </div>
          <div style="margin-bottom: 15px;">
            <strong>📍 Address:</strong><br>
            <span style="color: #162E50;">Dhaka, Bangladesh</span>
          </div>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Call Now',
      showCancelButton: true,
      cancelButtonText: 'Close',
      confirmButtonColor: '#162E50',
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = 'tel:+8801234567890';
      }
    });
  };

  // Membership plans data
  const membershipPlans = [
    {
      title: "Basic",
      price: "$49",
      period: "/month",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400&h=300&auto=format&fit=crop",
      description: "Perfect for casual players who want access to basic facilities.",
      features: ["Court Access", "Basic Equipment", "Locker Room"]
    },
    {
      title: "Premium",
      price: "$99",
      period: "/month",
      image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=400&h=300&auto=format&fit=crop",
      description: "Enhanced membership with additional perks and priority booking.",
      features: ["Priority Booking", "Guest Passes", "Equipment Rental", "Group Classes"]
    },
    {
      title: "Elite",
      price: "$149",
      period: "/month",
      image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=400&h=300&auto=format&fit=crop",
      description: "Ultimate membership with all premium features and personal training.",
      features: ["All Premium Features", "Personal Training", "Nutrition Consultation", "VIP Lounge"]
    }
  ];

  // Upcoming events data
  const upcomingEvents = [
    {
      title: "Tennis Tournament",
      date: "August 25, 2025",
      image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=400&h=300&auto=format&fit=crop",
      description: "Annual tennis championship with prizes for winners in all categories.",
      category: "Tournament"
    },
    {
      title: "Fitness Challenge",
      date: "August 30, 2025", 
      image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=400&h=300&auto=format&fit=crop",
      description: "30-day fitness challenge to help you achieve your health goals.",
      category: "Fitness"
    },
    {
      title: "Swimming Lessons",
      date: "September 5, 2025",
      image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=400&h=300&auto=format&fit=crop",
      description: "Beginner swimming lessons for adults and children.",
      category: "Lessons"
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Premium Member",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=200&h=200&auto=format&fit=crop",
      description: "The facilities here are absolutely amazing! The staff is friendly and the courts are always in perfect condition.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Elite Member", 
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop",
      description: "Best sports club in the city. The personal training sessions have helped me achieve my fitness goals.",
      rating: 5
    },
    {
      name: "Emily Davis",
      role: "Basic Member",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop", 
      description: "Great value for money. Love the group classes and the community atmosphere here.",
      rating: 5
    }
  ];

  // Statistics data
  const statistics = [
    { icon: Users, label: "Active Members", value: "2,500+" },
    { icon: Calendar, label: "Years of Service", value: "12+" },
    { icon: Trophy, label: "Championships Won", value: "150+" },
    { icon: Star, label: "5-Star Reviews", value: "500+" }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div>
      {/* 1. Enhanced Hero Section with Slider */}
      <section className="relative w-full h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Image with Parallax Effect */}
            <motion.div
              className="absolute inset-0 w-full h-full"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 8, ease: "easeOut" }}
            >
              <img
                src={images[current].src}
                alt={images[current].alt}
                className="w-full h-full object-cover"
              />
              
              {/* Dynamic Overlay with Gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
              />
              
              {/* Animated Geometric Shapes */}
              <motion.div
                className="absolute top-20 right-20 w-32 h-32 border-2 border-white/20 rounded-full"
                initial={{ rotate: 0, scale: 0 }}
                animate={{ rotate: 360, scale: 1 }}
                transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
              />
              <motion.div
                className="absolute bottom-32 right-32 w-16 h-16 bg-white/10 backdrop-blur-sm"
                initial={{ rotate: 45, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 1.5, delay: 0.7 }}
              />
            </motion.div>

            {/* Content Container */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-8 w-full">
                <div className="max-w-4xl">
                  {/* Accent Badge */}
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="inline-block mb-6"
                  >
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full">
                      <span className="text-white font-medium text-sm tracking-wide">
                        {images[current].accent}
                      </span>
                    </div>
                  </motion.div>

                  {/* Subtitle */}
                  <motion.p
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-xl md:text-2xl text-white/90 font-light mb-4 tracking-wide"
                  >
                    {images[current].subtitle}
                  </motion.p>

                  {/* Main Title */}
                  <motion.h1
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
                  >
                    <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                      {images[current].title}
                    </span>
                  </motion.h1>

                  {/* Description */}
                  <motion.p
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="text-lg md:text-xl text-white/80 max-w-2xl mb-10 leading-relaxed"
                  >
                    {images[current].description}
                  </motion.p>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    {/* Primary CTA */}
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (current === 0) handleStartJourney();
                        else if (current === 1) handleBookCourt();
                        else handleJoinCommunity();
                      }}
                      className="group bg-white text-black px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:bg-white/90 flex items-center justify-center gap-3"
                    >
                      {images[current].buttonText}
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </motion.button>

                    {/* Secondary CTA */}
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleWatchTour}
                      className="group bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:bg-white hover:text-black flex items-center justify-center gap-3"
                    >
                      <Play className="w-5 h-5" />
                      Watch Tour
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="absolute inset-x-0 bottom-8 z-30">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex items-center justify-between">
              {/* Progress Dots */}
              <div className="flex space-x-4">
                {images.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className="relative group"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      current === index 
                        ? "bg-white scale-125" 
                        : "bg-white/40 hover:bg-white/60"
                    }`} />
                    {/* Progress Ring */}
                    {current === index && (
                      <motion.div
                        className="absolute inset-0 w-3 h-3 rounded-full border-2 border-white"
                        initial={{ scale: 1, opacity: 0 }}
                        animate={{ scale: 2, opacity: 1 }}
                        transition={{ duration: 6, ease: "linear" }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Navigation Arrows */}
              <div className="flex space-x-4">
                <motion.button
                  onClick={prevSlide}
                  whileHover={{ scale: 1.1, x: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-3 rounded-full transition-all hover:bg-white/20"
                >
                  <ChevronLeft className="w-6 h-6" />
                </motion.button>
                
                <motion.button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-3 rounded-full transition-all hover:bg-white/20"
                >
                  <Play className={`w-6 h-6 transition-transform ${!isAutoPlaying ? 'rotate-0' : 'pause-icon'}`} />
                </motion.button>
                
                <motion.button
                  onClick={nextSlide}
                  whileHover={{ scale: 1.1, x: 2 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-3 rounded-full transition-all hover:bg-white/20"
                >
                  <ChevronRight className="w-6 h-6" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Counter */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute top-8 right-8 z-30"
        >
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full">
            <span className="text-white font-medium">
              {String(current + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
            </span>
          </div>
        </motion.div>
      </section>

      {/* 2. Enhanced Stats Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative -mt-20 z-20 pb-16"
      >
        <div className="max-w-7xl mt-[100px] mx-auto px-8">
          <motion.div
            className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200/50 p-8"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {statistics.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.8 }}
                    className="bg-gradient-to-br from-[#162E50] to-[#1c3a66] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl"
                  >
                    <stat.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <motion.h3
                    className="text-3xl font-bold text-[#162E50] mb-2"
                    initial={{ scale: 0.5 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                    viewport={{ once: true }}
                  >
                    {stat.value}
                  </motion.h3>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* 3. Featured Sports Section */}
      <motion.section
        className="py-16 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            variants={itemVariants}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#162E50] mb-4">
              Featured Sports
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Discover our wide range of sports facilities designed for athletes of all levels
            </p>
          </motion.div>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
          >
            {featuredSports.map((sport, index) => (
              <motion.div 
                key={index} 
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <img 
                  src={sport.image} 
                  alt={sport.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#162E50] mb-3">{sport.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{sport.description}</p>
                  <ul className="space-y-1 mb-4">
                    {sport.features.map((feature, idx) => (
                      <li key={idx} className="text-xs text-gray-500">• {feature}</li>
                    ))}
                  </ul>
                  <motion.button 
                    className="btn btn-outline border-[#162E50] text-[#162E50] hover:bg-[#162E50] hover:text-white w-full rounded-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleLearnMore(sport)}
                  >
                    Learn More
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* 4. SportsClubComponent */}
      <SportsClubComponent />

      {/* 5. Membership Plans Section */}
      <motion.section
        className={`py-16 transition-colors duration-300 ${
          isDark ? 'bg-gray-800' : 'bg-gray-50'
        }`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            variants={itemVariants}
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-[#162E50]'
            }`}>
              Membership Plans
            </h2>
            <p className={`text-lg max-w-3xl mx-auto transition-colors duration-300 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Choose the perfect membership plan that fits your lifestyle and goals
            </p>
          </motion.div>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {membershipPlans.map((plan, index) => (
              <motion.div 
                key={index} 
                className={`rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 ${
                  isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white'
                }`}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <img 
                  src={plan.image} 
                  alt={plan.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-8 text-center">
                  <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${
                    isDark ? 'text-white' : 'text-[#162E50]'
                  }`}>{plan.title}</h3>
                  <div className={`text-4xl font-bold mb-1 transition-colors duration-300 ${
                    isDark ? 'text-blue-400' : 'text-[#162E50]'
                  }`}>
                    {plan.price}<span className={`text-lg ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>{plan.period}</span>
                  </div>
                  <p className={`mb-6 text-sm transition-colors duration-300 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>{plan.description}</p>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className={`text-sm transition-colors duration-300 ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}>✓ {feature}</li>
                    ))}
                  </ul>
                  <motion.button 
                    className={`btn border-none w-full rounded-md transition-colors duration-300 ${
                      isDark 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-[#162E50] text-white hover:bg-[#1c3a66]'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleChoosePlan(plan)}
                  >
                    Choose Plan
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* 6. Upcoming Events Section */}
      <motion.section
        className={`py-16 transition-colors duration-300 ${
          isDark ? 'bg-gray-900' : 'bg-white'
        }`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            variants={itemVariants}
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-[#162E50]'
            }`}>
              Upcoming Events
            </h2>
            <p className={`text-lg max-w-3xl mx-auto transition-colors duration-300 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Join our exciting events and connect with fellow sports enthusiasts
            </p>
          </motion.div>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {upcomingEvents.map((event, index) => (
              <motion.div 
                key={index} 
                className={`rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 ${
                  isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white'
                }`}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs transition-colors duration-300 ${
                      isDark ? 'bg-blue-600 text-white' : 'bg-[#162E50] text-white'
                    }`}>{event.category}</span>
                    <span className={`text-sm flex items-center gap-1 transition-colors duration-300 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <Clock className="w-4 h-4" />
                      {event.date}
                    </span>
                  </div>
                  <h3 className={`text-xl font-semibold mb-3 transition-colors duration-300 ${
                    isDark ? 'text-white' : 'text-[#162E50]'
                  }`}>{event.title}</h3>
                  <p className={`mb-4 text-sm transition-colors duration-300 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>{event.description}</p>
                  <motion.button 
                    className={`btn w-full rounded-md transition-colors duration-300 ${
                      isDark 
                        ? 'btn-outline border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white' 
                        : 'btn-outline border-[#162E50] text-[#162E50] hover:bg-[#162E50] hover:text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRegisterEvent(event)}
                  >
                    Register Now
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            className="text-center mt-12"
            variants={itemVariants}
          >
            <motion.button
              className="btn bg-[#162E50] text-white hover:bg-[#1c3a66] border-none"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (!user) {
                  // Show alert and redirect to login if user is not logged in
                  Swal.fire({
                    title: 'Login Required',
                    text: 'Please login to view all events',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Login Now',
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
                navigate('/events');
              }}
            >
              View All Events
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* 7. Promotions Section */}
      <section id="promotions" className="scroll-mt-20">
        <Promotions />
      </section>

      {/* 8. Location Section */}
      <section id="location" className="scroll-mt-20">
        <LocationSection />
      </section>

      {/* 9. Testimonials Section */}
      <motion.section
        className={`py-16 transition-colors duration-300 ${
          isDark ? 'bg-gray-800' : 'bg-gray-50'
        }`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            variants={itemVariants}
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-[#162E50]'
            }`}>
              What Our Members Say
            </h2>
            <p className={`text-lg max-w-3xl mx-auto transition-colors duration-300 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Read testimonials from our satisfied members who love their experience
            </p>
          </motion.div>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index} 
                className={`rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 ${
                  isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white'
                }`}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                      isDark ? 'text-white' : 'text-[#162E50]'
                    }`}>{testimonial.name}</h3>
                    <p className={`text-sm transition-colors duration-300 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className={`text-sm italic transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>"{testimonial.description}"</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* 10. Newsletter Section */}
      <motion.section
        className="py-16 bg-[#162E50]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Stay Updated
            </motion.h2>
            <motion.p
              className="text-xl text-gray-200 mb-8"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Subscribe to our newsletter and get the latest updates on events, promotions, and club news
            </motion.p>
            <motion.div
              className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <input 
                type="email" 
                placeholder="Enter your email"
                id="newsletter-email"
                className="flex-1 px-6 py-3 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white border border-gray-200"
              />
              <motion.button 
                className="btn bg-white text-[#162E50] hover:bg-gray-100 border-none px-8 py-3 rounded-full font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const email = document.getElementById('newsletter-email').value.trim();
                  if (email && email.includes('@')) {
                    handleSubscribeNewsletter(email);
                    document.getElementById('newsletter-email').value = '';
                  } else {
                    handleSubscribeNewsletter('');
                  }
                }}
              >
                Subscribe
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* 11. Contact CTA Section */}
      <motion.section
        className="py-16 bg-white contact-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="bg-gradient-to-r from-[#162E50] to-[#1c3a66] rounded-2xl p-12 text-center text-white"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ready to Join Our Community?
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Contact us today to learn more about membership options and schedule a tour of our facilities
            </p>
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <motion.div 
                className="flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
              >
                <Phone className="w-6 h-6" />
                <span className="text-lg">+880 1234 567 890</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
              >
                <Mail className="w-6 h-6" />
                <span className="text-lg">support@sportsclub.com</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
              >
                <MapPin className="w-6 h-6" />
                <span className="text-lg">Dhaka, Bangladesh</span>
              </motion.div>
            </div>
            <motion.button 
              className="btn bg-white text-[#162E50] hover:bg-gray-100 border-none px-8 py-4 rounded-full font-semibold text-lg mt-8"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleContactUs}
            >
              Contact Us Now
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* 12. About Section */}
      <section id="about" className="scroll-mt-20">
        <About />
      </section>

      {/* 13. SportsClubComponent */}
 

      {/* Sports Detail Modal */}
      <AnimatePresence>
        {selectedSport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                onClick={closeModal}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>

              {/* Modal Content */}
              <div className="pr-8">
                <img
                  src={selectedSport.image}
                  alt={selectedSport.title}
                  className="w-full h-64 object-cover rounded-xl mb-6"
                />
                
                <h2 className="text-4xl md:text-5xl font-bold text-[#162E50] mb-4">
                  {selectedSport.title}
                </h2>
                
                <p className="text-gray-600 mb-6 text-lg">
                  {selectedSport.description}
                </p>

                {/* Features */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-[#162E50] mb-3">Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {selectedSport.features.map((feature, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-3 text-center">
                        <span className="text-sm font-medium text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-[#162E50] mb-4">Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-[#162E50] mb-2">Pricing</h4>
                      <p className="text-gray-700">{selectedSport.details.price}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold text-[#162E50] mb-2">Availability</h4>
                      <p className="text-gray-700">{selectedSport.details.availability}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <h4 className="font-semibold text-[#162E50] mb-2">Equipment</h4>
                      <p className="text-gray-700">{selectedSport.details.equipment}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h4 className="font-semibold text-[#162E50] mb-2">Coaching</h4>
                      <p className="text-gray-700">{selectedSport.details.coaching}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleBookNow(selectedSport)}
                    className="flex-1 bg-[#162E50] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1c3a66] transition-colors"
                  >
                    Book Now
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleContactForInfo}
                    className="flex-1 border-2 border-[#162E50] text-[#162E50] px-6 py-3 rounded-lg font-semibold hover:bg-[#162E50] hover:text-white transition-colors"
                  >
                    Contact for Info
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .pause-icon {
          transform: scale(0.8);
        }
      `}</style>
    </div>
  );
};

export default Home;