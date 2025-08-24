"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Calendar, Search, CheckCircle, Trophy, Users, Target, Award, Flame, Clock, MapPin, Star, Zap, BarChart } from 'lucide-react';

// --- MOCK DATA (No changes) ---
const mockEvents = [
  {
    _id: "1",
    title: "Gridiron Championship",
    description: "The ultimate showdown on the field. Teams clash in an epic battle for supremacy. Only the strongest survive.",
    venue: "National Stadium",
    date: "March 15, 2025",
    time: "2:00 PM - 6:00 PM",
    prizePool: "₹50,000",
    image: "https://images.unsplash.com/photo-1512498462319-95011b156a29?w=800&h=600&fit=crop&q=80",
    registrations: new Array(24).fill(null),
    category: "Team Sports",
    difficulty: "Elite",
    colors: { primary: "#f97316", secondary: "#ea580c", text: "#ffffff", shadow: "rgba(249, 115, 22, 0.5)" }
  },
  {
    _id: "2", 
    title: "Hoops Havoc",
    description: "Fast-paced action under the lights. Dribble, shoot, score your way to glory in this high-energy tournament.",
    venue: "Indoor Arena",
    date: "March 18, 2025", 
    time: "10:00 AM - 4:00 PM",
    prizePool: "₹35,000",
    image: "https://images.unsplash.com/photo-1577412643320-40a1b52737a2?w=800&h=600&fit=crop&q=80",
    registrations: new Array(16).fill(null),
    category: "Team Sports",
    difficulty: "Pro",
    colors: { primary: "#38bdf8", secondary: "#0ea5e9", text: "#ffffff", shadow: "rgba(56, 189, 248, 0.5)" }
  },
  {
    _id: "3",
    title: "Athletic Apex",
    description: "Run like the wind, jump like a champion. Individual glory awaits in this ultimate test of athletic prowess.",
    venue: "Olympic Track",
    date: "March 20, 2025",
    time: "8:00 AM - 5:00 PM", 
    prizePool: "₹40,000",
    image: "https://images.unsplash.com/photo-1598420784224-e6556b6e40b3?w=800&h=600&fit=crop&q=80",
    registrations: new Array(45).fill(null),
    category: "Individual",
    difficulty: "Elite",
    colors: { primary: "#fbbf24", secondary: "#f59e0b", text: "#0c0a09", shadow: "rgba(251, 191, 36, 0.5)" }
  },
  {
    _id: "4",
    title: "Cricket Clash",
    description: "22 yards of pure excitement. Bat, bowl, field your way to cricket immortality in this tournament of champions.",
    venue: "Goliath Ground",
    date: "March 22, 2025",
    time: "9:00 AM - 6:00 PM",
    prizePool: "₹60,000",
    image: "https://images.unsplash.com/photo-1597733230819-741c8e193790?w=800&h=600&fit=crop&q=80", 
    registrations: new Array(32).fill(null),
    category: "Team Sports",
    difficulty: "Elite",
    colors: { primary: "#10b981", secondary: "#059669", text: "#ffffff", shadow: "rgba(16, 185, 129, 0.5)" }
  },
  {
    _id: "5",
    title: "Aqua Velocity",
    description: "Dive into victory. Make waves in the pool and emerge as the aquatic champion in this thrilling water battle.",
    venue: "Aquatic Center",
    date: "March 25, 2025",
    time: "6:00 AM - 12:00 PM",
    prizePool: "₹30,000",
    image: "https://images.unsplash.com/photo-1612821235272-2200fb0197b8?w=800&h=600&fit=crop&q=80",
    registrations: new Array(20).fill(null),
    category: "Individual",
    difficulty: "Pro",
    colors: { primary: "#06b6d4", secondary: "#0891b2", text: "#ffffff", shadow: "rgba(6, 182, 212, 0.5)" }
  },
  {
    _id: "6",
    title: "Tennis Titans",
    description: "Serve, volley, win. The court awaits your mastery in this prestigious tennis tournament of champions.",
    venue: "Center Court",
    date: "March 28, 2025",
    time: "9:00 AM - 6:00 PM",
    prizePool: "₹25,000",
    image: "https://images.unsplash.com/photo-1554062234-3d03c451b65b?w=800&h=600&fit=crop&q=80",
    registrations: new Array(12).fill(null),
    category: "Individual",
    difficulty: "Pro",
    colors: { primary: "#ec4899", secondary: "#d946ef", text: "#ffffff", shadow: "rgba(236, 72, 153, 0.5)" }
  }
];


function GridPatternBackground() {
  return (
    <div className="absolute inset-0 h-full w-full bg-slate-950">
      <div 
        className="absolute inset-0 h-full w-full" 
        style={{
          backgroundImage: 'linear-gradient(to right, #1f2937 1px, transparent 1px), linear-gradient(to bottom, #1f2937 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.2
        }}
      />
      <div 
        className="absolute inset-0 h-full w-full bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950"
      />
    </div>
  );
}


// --- REFINED EventCard Component with better Dragging and Dispersal ---
interface EventCardProps {
  event: any;
  index: number;
  removeCard: (id: string, direction: 'left' | 'right') => void;
  totalCards: number;
  isRegistered: boolean;
  isProcessing: boolean;
  handleRegistration: (id: string, isRegistered: boolean) => void;
  session: any;
}

function EventCard({ event, index, removeCard, totalCards, isRegistered, isProcessing, handleRegistration, session }: EventCardProps) {
  // --- NEW: More pronounced dispersal effect ---
  const zIndex = totalCards - index;
  // Stack cards upwards slightly and apply a stronger fan-out rotation
  const yOffset = index * -8;
  const scale = 1 - index * 0.05;
  const rotation = index * (index % 2 === 0 ? 4 : -4);

  // --- NEW: Hooks for physical drag rotation effect ---
  const x = useMotionValue(0);
  const cardRotate = useTransform(x, [-250, 250], [-25, 25]);
  const opacity = useTransform(x, [-250, 0, 250], [0.5, 1, 0.5]);
  
  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "Elite": return <Flame className="w-4 h-4" />;
      case "Pro": return <Star className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      // --- NEW: Use motion values for dynamic styling ---
      style={{
        zIndex,
        x: index === 0 ? x : 0,
        rotate: index === 0 ? cardRotate : rotation,
        opacity: index === 0 ? opacity : 1,
      }}
      initial={{ opacity: 0, y: 100, scale: 0.8 }}
      animate={{
        opacity: 1,
        y: yOffset,
        scale,
        rotate: rotation
      }}
      exit={{
        opacity: 0,
        x: x.get() > 0 ? 400 : -400, // Exit in the direction of the swipe
        y: 20,
        rotate: x.get() > 0 ? 30 : -30,
        transition: { duration: 0.3, ease: "easeIn" },
      }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      // --- NEW: Add a hover effect for the top card ---
      whileHover={index === 0 ? { y: yOffset - 10, scale: 1.02 } : {}}
      className="absolute left-0 top-0 h-full w-full cursor-grab overflow-hidden rounded-2xl active:cursor-grabbing"
      // --- UPDATED: More explicit drag props and logic ---
      drag={index === 0 ? "x" : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragSnapToOrigin={true}
      onDragEnd={(_, info) => {
        if (index === 0 && Math.abs(info.offset.x) > 150) {
          removeCard(event._id, info.offset.x > 0 ? 'right' : 'left');
        }
      }}
    >
      <div
        className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900"
      >
        {/* Background Image with stronger overlay */}
        <div className="absolute inset-0">
          <img
            src={event.image}
            alt={event.title}
            className="h-full w-full object-cover"
            style={{ filter: 'brightness(0.5) contrast(1.1)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />
          <div 
             className="absolute inset-0"
             style={{ background: `radial-gradient(circle at 50% 50%, transparent 40%, ${event.colors.primary} 150%)`, opacity: 0.15 }}
          />
        </div>

        {/* Content (No changes) */}
        <div className="relative z-10 flex h-full flex-col p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border`}
              style={{ borderColor: event.colors.primary, color: event.colors.primary, backgroundColor: `${event.colors.primary}1A`}}
            >
              {getDifficultyIcon(event.difficulty)}
              <span>{event.difficulty}</span>
            </div>
             <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">{event.category}</div>
          </div>
          
          <div className="flex-grow">
            <h2 className="text-3xl lg:text-4xl font-black mb-2 uppercase tracking-tight" style={{textShadow: '0 2px 10px rgba(0,0,0,0.5)'}}>
              {event.title}
            </h2>
            <p className="text-base text-slate-300 leading-snug line-clamp-2">
              {event.description}
            </p>
          </div>

          <hr className="my-4 border-slate-700" />

          <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-sm">{event.date}</span>
            </div>
             <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-sm">{event.venue}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-sm">{event.time}</span>
            </div>
             <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-sm">{event.registrations.length} Warriors</span>
            </div>
          </div>
          
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="text-sm font-medium text-slate-400">Prize Pool</div>
              <div className="text-3xl font-bold" style={{ color: event.colors.primary }}>
                {event.prizePool}
              </div>
            </div>
          </div>
          
          {session?.user && (
            <motion.button
              onClick={() => handleRegistration(event._id, isRegistered)}
              disabled={isProcessing}
              className={`w-full py-3.5 px-6 rounded-lg font-bold text-base uppercase tracking-wider transition-all duration-300 transform-gpu focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                isRegistered
                  ? 'bg-red-600/20 border-2 border-red-600 text-red-400 hover:bg-red-600 hover:text-white'
                  : 'text-black bg-gradient-to-r hover:shadow-lg hover:-translate-y-0.5'
              } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={!isRegistered ? {
                backgroundColor: event.colors.primary,
                boxShadow: `0 4px 20px ${event.colors.shadow}`,
                textShadow: '0 1px 2px rgba(0,0,0,0.1)',
              } : {}}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : isRegistered ? (
                "Withdraw"
              ) : (
                "Join Battle"
              )}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// --- UPDATED Card Stack Container ---
function EventCardStack({ events, userRegistrations, handleRegistration, session, registering }: any) {
  const [cards, setCards] = useState(events);

  useEffect(() => {
    setCards(events);
  }, [events]);

  const removeCard = (id: string) => {
    setCards((prev: any[]) => {
      // Find the card to be removed
      const dismissedCard = prev.find((c) => c._id === id);
      if (!dismissedCard) return prev;
      
      // Filter it out from the current array and add it to the end
      const remainingCards = prev.filter((card) => card._id !== id);
      return [...remainingCards, dismissedCard];
    });
  };
  
  if (cards.length === 0) {
    return (
      <div className="flex h-[600px] w-full items-center justify-center">
        <div className="text-center">
          <BarChart className="w-24 h-24 text-slate-700 mx-auto mb-4" />
          <h3 className="text-3xl font-bold text-slate-400 mb-2">No Events Found</h3>
          <p className="text-lg text-slate-500">Adjust your filters or check back later for new battles.</p>
        </div>
      </div>
    );
  }

  return (
    // --- NEW: Added perspective for a better 3D rotation effect ---
    <div className="relative h-[680px] w-full max-w-md mx-auto" style={{ perspective: "1000px" }}>
      <AnimatePresence>
        {cards.slice(0, 4).map((event: any, index: number) => (
          <EventCard
            key={event._id} // Using event._id as key ensures stability
            event={event}
            index={index}
            removeCard={removeCard}
            totalCards={Math.min(cards.length, 4)}
            isRegistered={userRegistrations.includes(event._id)}
            isProcessing={registering === event._id}
            handleRegistration={handleRegistration}
            session={session}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}


// --- Main Page Component (No changes) ---
function EventsPage() {
    const [events] = useState(mockEvents);
    const [filteredEvents, setFilteredEvents] = useState(mockEvents);
    const [userRegistrations, setUserRegistrations] = useState(['1', '3']);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterBy, setFilterBy] = useState("all");
    const [registering, setRegistering] = useState<string | null>(null);
    const [message, setMessage] = useState<{type: string; text: string} | null>(null);

    const session = { user: { name: "John Doe" } }; // Mock session

    useEffect(() => {
        let filtered = events.filter(
            (event) =>
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.venue.toLowerCase().includes(searchTerm.toLowerCase()),
        );

        if (filterBy === "registered") {
            filtered = filtered.filter((event) => userRegistrations.includes(event._id));
        } else if (filterBy === "available") {
            filtered = filtered.filter((event) => !userRegistrations.includes(event._id));
        }

        setFilteredEvents(filtered);
    }, [events, searchTerm, filterBy, userRegistrations]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);
    
    const handleRegistration = (eventId: string, isRegistered: boolean) => {
        setRegistering(eventId);
        setMessage(null);
        setTimeout(() => {
            if (isRegistered) {
                setUserRegistrations(prev => prev.filter(id => id !== eventId));
                setMessage({ type: "success", text: "Successfully withdrawn from the event." });
            } else {
                setUserRegistrations(prev => [...prev, eventId]);
                setMessage({ type: "success", text: "Registration confirmed. Prepare for battle!" });
            }
            setRegistering(null);
        }, 1000);
    };

    return (
        <>
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Teko:wght@700&family=Inter:wght@400;600;700&display=swap');
                .font-teko { font-family: 'Teko', sans-serif; }
                .font-inter { font-family: 'Inter', sans-serif; }
            `}</style>
            <div className="min-h-screen bg-slate-950 text-white overflow-hidden font-inter">
                <GridPatternBackground />
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    
                    <div className="text-center mb-12">
                        <motion.h1 
                            initial={{ opacity: 0, y: -30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            className="text-6xl sm:text-7xl lg:text-8xl font-teko font-bold uppercase tracking-tighter text-slate-100"
                        >
                            THE <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">ARENA</span> OF <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">CHAMPIONS</span>
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="text-lg text-slate-400 max-w-3xl mx-auto mt-2"
                        >
                            Forge your legacy. Compete against the best. Seize victory.
                        </motion.p>
                    </div>

                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12"
                    >
                        {[
                            { icon: Trophy, label: "Total Prize", value: "₹1.85L", color: "amber" },
                            { icon: Users, label: "Warriors", value: "500+", color: "sky" },
                            { icon: Target, label: "Events", value: "12", color: "emerald" },
                            { icon: Award, label: "Days", value: "5", color: "fuchsia" }
                        ].map((stat, index) => (
                            <motion.div 
                                key={index} 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 + index * 0.1 }}
                                className={`group relative bg-slate-900/80 backdrop-blur-sm rounded-lg p-4 border border-slate-800 hover:border-${stat.color}-500 transition-colors duration-300`}
                            >
                                <stat.icon className={`w-7 h-7 text-${stat.color}-400 mb-2`} />
                                <div className={`text-2xl font-bold text-white mb-0.5`}>{stat.value}</div>
                                <div className="text-slate-400 text-xs uppercase tracking-wider">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>

                    <AnimatePresence>
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className={`mb-8 p-4 rounded-lg backdrop-blur-sm border ${
                                    message.type === "success" 
                                    ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400" 
                                    : "bg-red-500/10 border-red-500/50 text-red-400"
                                }`}
                            >
                                <div className="flex items-center gap-2 font-semibold">
                                    <CheckCircle className="w-5 h-5" />
                                    {message.text}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="bg-slate-900/50 backdrop-blur-lg rounded-xl p-4 border border-slate-800 mb-12"
                    >
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative group w-full sm:flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Search events or venues..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-800/60 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all duration-300"
                                />
                            </div>
                            <select
                                value={filterBy}
                                onChange={(e) => setFilterBy(e.target.value)}
                                className="w-full sm:w-auto px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-lg text-slate-200 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all duration-300"
                            >
                                <option value="all">All Events</option>
                                <option value="available">Available</option>
                                <option value="registered">Registered</option>
                            </select>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                    >
                        <EventCardStack
                            events={filteredEvents}
                            userRegistrations={userRegistrations}
                            handleRegistration={handleRegistration}
                            session={session}
                            registering={registering}
                        />
                    </motion.div>
                </div>
            </div>
        </>
    );
}

export default EventsPage;