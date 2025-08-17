import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Clock, Calendar, MapPin, Users, Trophy, Target, ArrowLeft, Check, X } from "lucide-react";
import { Link } from "react-router";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AllEvents = () => {
  // Extended events data with countdown dates
  const allEvents = [
    {
      id: 1,
      title: "Tennis Tournament",
      date: "2025-08-25T10:00:00Z", // Using future date for countdown
      endDate: "2025-08-25T18:00:00Z",
      image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=400&h=300&auto=format&fit=crop",
      description: "Annual tennis championship with prizes for winners in all categories. Join us for an exciting day of competitive tennis.",
      category: "Tournament",
      location: "Main Tennis Courts",
      maxParticipants: 32,
      currentParticipants: 18,
      prize: "$2,000",
      requirements: "Intermediate to Advanced Level"
    },
    {
      id: 2,
      title: "Fitness Challenge",
      date: "2025-08-30T06:00:00Z",
      endDate: "2025-09-30T20:00:00Z",
      image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=400&h=300&auto=format&fit=crop",
      description: "30-day fitness challenge to help you achieve your health goals. Track your progress and compete with others.",
      category: "Fitness",
      location: "Main Gym",
      maxParticipants: 100,
      currentParticipants: 67,
      prize: "Fitness Package Worth $500",
      requirements: "All Fitness Levels Welcome"
    },
    {
      id: 3,
      title: "Swimming Lessons",
      date: "2025-09-05T09:00:00Z",
      endDate: "2025-09-05T11:00:00Z",
      image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=400&h=300&auto=format&fit=crop",
      description: "Beginner swimming lessons for adults and children. Professional instructors will guide you through basic techniques.",
      category: "Lessons",
      location: "Olympic Pool",
      maxParticipants: 20,
      currentParticipants: 12,
      prize: "Certificate of Completion",
      requirements: "Beginner Level"
    },
    {
      id: 4,
      title: "Basketball Championship",
      date: "2025-09-10T14:00:00Z",
      endDate: "2025-09-10T19:00:00Z",
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=400&h=300&auto=format&fit=crop",
      description: "Inter-club basketball championship featuring teams from various sports clubs. Show your team spirit!",
      category: "Tournament",
      location: "Basketball Court A & B",
      maxParticipants: 80,
      currentParticipants: 64,
      prize: "$1,500 Team Prize",
      requirements: "Team Registration Required"
    },
    {
      id: 5,
      title: "Yoga Workshop",
      date: "2025-09-15T07:00:00Z",
      endDate: "2025-09-15T09:00:00Z",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=400&h=300&auto=format&fit=crop",
      description: "Morning yoga workshop focusing on mindfulness and flexibility. Perfect start to your day.",
      category: "Wellness",
      location: "Meditation Room",
      maxParticipants: 25,
      currentParticipants: 8,
      prize: "Yoga Mat & Accessories",
      requirements: "All Levels Welcome"
    },
    {
      id: 6,
      title: "Badminton Tournament",
      date: "2025-09-20T16:00:00Z",
      endDate: "2025-09-20T21:00:00Z",
      image: "https://gameonfamily.com/cdn/shop/articles/Depositphotos_9388060_original.jpg?v=1739840875&width=1100",
      description: "Singles and doubles badminton tournament. Fast-paced action and exciting matches guaranteed.",
      category: "Tournament",
      location: "Badminton Courts",
      maxParticipants: 40,
      currentParticipants: 28,
      prize: "$800 Winner Prize",
      requirements: "Intermediate Level"
    }
  ];

  // Local storage keys
  const REGISTERED_EVENTS_KEY = 'sportsclub_registered_events';
  const NEWSLETTER_SUBSCRIPTION_KEY = 'sportsclub_newsletter_subscription';

  // Load data from localStorage
  const loadRegisteredEvents = () => {
    try {
      const saved = localStorage.getItem(REGISTERED_EVENTS_KEY);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (error) {
      console.error('Error loading registered events from localStorage:', error);
      return new Set();
    }
  };

  const loadNewsletterSubscription = () => {
    try {
      const saved = localStorage.getItem(NEWSLETTER_SUBSCRIPTION_KEY);
      return saved ? JSON.parse(saved) : false;
    } catch (error) {
      console.error('Error loading newsletter subscription from localStorage:', error);
      return false;
    }
  };

  // Save data to localStorage
  const saveRegisteredEvents = (events) => {
    try {
      localStorage.setItem(REGISTERED_EVENTS_KEY, JSON.stringify([...events]));
    } catch (error) {
      console.error('Error saving registered events to localStorage:', error);
    }
  };

  const saveNewsletterSubscription = (isSubscribed) => {
    try {
      localStorage.setItem(NEWSLETTER_SUBSCRIPTION_KEY, JSON.stringify(isSubscribed));
    } catch (error) {
      console.error('Error saving newsletter subscription to localStorage:', error);
    }
  };

  const [currentTime, setCurrentTime] = useState(new Date());
  const [registeredEvents, setRegisteredEvents] = useState(() => loadRegisteredEvents());
  const [subscribedToNewsletter, setSubscribedToNewsletter] = useState(() => loadNewsletterSubscription());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Optional: Function to clear all stored data (for development/testing)
  const clearAllStoredData = () => {
    try {
      localStorage.removeItem(REGISTERED_EVENTS_KEY);
      localStorage.removeItem(NEWSLETTER_SUBSCRIPTION_KEY);
      setRegisteredEvents(new Set());
      setSubscribedToNewsletter(false);
      toast.info("All stored data cleared!");
    } catch (error) {
      console.error('Error clearing stored data:', error);
    }
  };

  // Debug: Uncomment to add a clear button during development
  // window.clearSportsClubData = clearAllStoredData;

  // Function to handle event registration
  const handleEventRegistration = (eventId, eventTitle) => {
    if (registeredEvents.has(eventId)) {
      // Unregister
      setRegisteredEvents(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        saveRegisteredEvents(newSet); // Save to localStorage
        return newSet;
      });
      toast.info(`Successfully unregistered from "${eventTitle}"`);
    } else {
      // Register
      setRegisteredEvents(prev => {
        const newSet = new Set([...prev, eventId]);
        saveRegisteredEvents(newSet); // Save to localStorage
        return newSet;
      });
      toast.success(`Successfully registered for "${eventTitle}"!`);
    }
  };

  // Function to handle newsletter subscription
  const handleNewsletterSubscription = () => {
    if (subscribedToNewsletter) {
      setSubscribedToNewsletter(false);
      saveNewsletterSubscription(false); // Save to localStorage
      toast.info("Successfully unsubscribed from newsletter");
    } else {
      setSubscribedToNewsletter(true);
      saveNewsletterSubscription(true); // Save to localStorage
      toast.success("Successfully subscribed to newsletter!");
    }
  };

  const calculateTimeLeft = (eventDate) => {
    const difference = new Date(eventDate) - currentTime;
    
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        expired: false
      };
    }
    return { expired: true };
  };

  const calculateEventProgress = (startDate, endDate) => {
    const now = currentTime;
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return { status: 'upcoming', progress: 0 };
    if (now > end) return { status: 'completed', progress: 100 };
    
    const total = end - start;
    const elapsed = now - start;
    const progress = (elapsed / total) * 100;
    
    return { status: 'ongoing', progress: Math.min(100, Math.max(0, progress)) };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  const CountdownTimer = ({ eventDate, eventTitle }) => {
    const timeLeft = calculateTimeLeft(eventDate);
    
    if (timeLeft.expired) {
      return (
        <div className="text-center py-4">
          <span className="text-red-500 font-semibold">Event Started/Ended</span>
        </div>
      );
    }

    return (
      <div className="bg-gradient-to-r from-[#162E50] to-[#1c3a66] text-white p-4 rounded-lg">
        <h4 className="text-sm font-semibold mb-2 text-center">Event Starts In:</h4>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-white/20 rounded-lg p-2">
            <div className="text-xl font-bold">{timeLeft.days}</div>
            <div className="text-xs">Days</div>
          </div>
          <div className="bg-white/20 rounded-lg p-2">
            <div className="text-xl font-bold">{timeLeft.hours}</div>
            <div className="text-xs">Hours</div>
          </div>
          <div className="bg-white/20 rounded-lg p-2">
            <div className="text-xl font-bold">{timeLeft.minutes}</div>
            <div className="text-xs">Minutes</div>
          </div>
          <div className="bg-white/20 rounded-lg p-2">
            <div className="text-xl font-bold">{timeLeft.seconds}</div>
            <div className="text-xs">Seconds</div>
          </div>
        </div>
      </div>
    );
  };

  const EventProgressBar = ({ startDate, endDate }) => {
    const { status, progress } = calculateEventProgress(startDate, endDate);
    
    const getStatusColor = () => {
      switch (status) {
        case 'upcoming': return 'bg-blue-500';
        case 'ongoing': return 'bg-green-500';
        case 'completed': return 'bg-gray-500';
        default: return 'bg-blue-500';
      }
    };

    const getStatusText = () => {
      switch (status) {
        case 'upcoming': return 'Upcoming';
        case 'ongoing': return 'Live Now';
        case 'completed': return 'Completed';
        default: return 'Unknown';
      }
    };

    return (
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">Event Status:</span>
          <span className={`text-sm font-semibold px-2 py-1 rounded-full text-white ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
        {status === 'ongoing' && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${getStatusColor()}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Header */}
      <motion.div 
        className="bg-gradient-to-r from-[#162E50] to-[#1c3a66] text-white py-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">All Events</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Discover and join exciting events at our sports club. From tournaments to workshops, 
            there's something for everyone!
          </p>
        </div>
      </motion.div>

      {/* Events Grid */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {allEvents.map((event) => (
            <motion.div
              key={event.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#162E50] text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {event.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 text-[#162E50] px-3 py-1 rounded-full text-sm font-semibold">
                    {event.currentParticipants}/{event.maxParticipants} Registered
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#162E50] mb-3">{event.title}</h3>
                <p className="text-gray-600 mb-4">{event.description}</p>

                {/* Event Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm">{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Users className="w-5 h-5" />
                    <span className="text-sm">{event.requirements}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Trophy className="w-5 h-5" />
                    <span className="text-sm">{event.prize}</span>
                  </div>
                </div>

                {/* Countdown Timer */}
                <CountdownTimer eventDate={event.date} eventTitle={event.title} />

                {/* Event Progress */}
                <EventProgressBar startDate={event.date} endDate={event.endDate} />

                {/* Registration Button */}
                <motion.button
                  onClick={() => handleEventRegistration(event.id, event.title)}
                  disabled={calculateEventProgress(event.date, event.endDate).status === 'completed'}
                  className={`w-full mt-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                    calculateEventProgress(event.date, event.endDate).status === 'completed'
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : registeredEvents.has(event.id)
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-[#162E50] text-white hover:bg-[#1c3a66]'
                  }`}
                  whileHover={{ scale: calculateEventProgress(event.date, event.endDate).status !== 'completed' ? 1.02 : 1 }}
                  whileTap={{ scale: calculateEventProgress(event.date, event.endDate).status !== 'completed' ? 0.98 : 1 }}
                >
                  {calculateEventProgress(event.date, event.endDate).status === 'completed' ? (
                    <>
                      <X className="w-5 h-5" />
                      Event Completed
                    </>
                  ) : registeredEvents.has(event.id) ? (
                    <>
                      <Check className="w-5 h-5" />
                      Registered - Click to Unregister
                    </>
                  ) : (
                    <>
                      <Users className="w-5 h-5" />
                      Register Now
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.section 
        className="bg-[#162E50] text-white py-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Don't Miss Out!</h2>
          <p className="text-xl text-white/90 mb-8">
            Join our community and never miss an exciting event. Subscribe to our newsletter 
            for updates on new events and exclusive member benefits.
          </p>
          <motion.button
            onClick={handleNewsletterSubscription}
            className={`px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
              subscribedToNewsletter
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-white text-[#162E50] hover:bg-gray-100'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {subscribedToNewsletter ? (
              <>
                <Check className="w-5 h-5" />
                Subscribed - Click to Unsubscribe
              </>
            ) : (
              <>
                <Target className="w-5 h-5" />
                Subscribe for Updates
              </>
            )}
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
};

export default AllEvents;
