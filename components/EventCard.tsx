import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Trophy, Users, CheckCircle, Zap, Target, Flame, ChevronRight, Crown, Medal, Star } from 'lucide-react';
import clsx from 'clsx';

const getDifficultyBadge = (difficulty) => {
    const styles = {
        Elite: "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border-red-500/30",
        Pro: "bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30",
        Amateur: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30"
    };
    const icons = { Elite: Crown, Pro: Medal, Amateur: Star };
    const Icon = icons[difficulty] || Star;
    
    return (
        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border backdrop-blur-sm ${styles[difficulty]}`}>
            <Icon className="w-3 h-3" />
            <span className="text-xs font-bold">{difficulty}</span>
        </div>
    );
};

const EventCard = ({ event, isRegistered, isProcessing, handleRegistration, session }) => {
    const cardVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
    };

    return (
        <motion.div
            variants={cardVariants}
            className="group relative"
        >
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/30 to-red-500/30 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            
            <div className="relative bg-gradient-to-br from-slate-900/95 to-black/95 border-2 border-slate-700 group-hover:border-amber-500/50 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/20 backdrop-blur-sm">
                <div className="relative h-64 overflow-hidden">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    
                    {isRegistered && (
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 backdrop-blur-sm rounded-full px-4 py-2 border border-green-400 shadow-lg animate-pulse">
                            <div className="flex items-center gap-2 text-white font-bold text-sm">
                                <CheckCircle className="w-4 h-4" />
                                <span>Warrior Enlisted</span>
                            </div>
                        </div>
                    )}

                    <div className="absolute bottom-4 left-4 bg-gradient-to-r from-amber-500/30 to-orange-500/30 backdrop-blur-md rounded-xl px-6 py-3 border border-amber-500/50">
                        <div className="flex items-center gap-2">
                            <Trophy className="w-6 h-6 text-amber-300" />
                            <span className="text-amber-300 font-bold text-xl">{event.prizePool}</span>
                        </div>
                    </div>

                    <div className="absolute top-4 left-4">
                        {getDifficultyBadge(event.difficulty)}
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30 rounded-full px-4 py-1 text-sm font-bold backdrop-blur-sm flex items-center gap-2">
                                <Zap className="w-4 h-4" /> {event.category}
                            </div>
                            <div className="bg-slate-800/50 text-slate-300 border border-slate-600 rounded-full px-4 py-1 text-sm font-semibold backdrop-blur-sm flex items-center gap-2">
                                <Users className="w-4 h-4" /> {event.registrations?.length || 0} Warriors
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-white group-hover:text-amber-400 transition-colors duration-300 flex items-center gap-3">
                            <Target className="w-8 h-8 text-amber-500 group-hover:rotate-12 transition-transform duration-300" />
                            {event.title}
                        </h3>
                        <p className="text-slate-300 text-lg leading-relaxed">{event.description}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {[
                            { icon: MapPin, label: "Battleground", value: event.venue },
                            { icon: Calendar, label: "Date of Glory", value: event.date },
                            { icon: Clock, label: "Time of Victory", value: event.time }
                        ].map((detail, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 bg-slate-800/30 rounded-xl backdrop-blur-sm border border-slate-700 group-hover:border-slate-600 transition-colors duration-300">
                                <detail.icon className="w-6 h-6 text-amber-500 flex-shrink-0" />
                                <div>
                                    <div className="text-slate-400 text-sm font-medium">{detail.label}</div>
                                    <div className="text-slate-200 font-semibold text-lg">{detail.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                        <button
                            onClick={() => {
                                if (!isRegistered) handleRegistration(event._id, false)
                                else console.log("Navigate to dashboard");
                            }}
                            disabled={isProcessing || !session}
                            className={clsx(
                                'group relative w-full font-bold py-4 px-6 text-lg rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl flex items-center justify-center gap-3',
                                {
                                    'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white hover:shadow-green-500/30': isRegistered,
                                    'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white hover:shadow-amber-500/30': !isRegistered,
                                    'opacity-50 cursor-not-allowed': isProcessing || !session
                                }
                            )}
                        >
                            {isProcessing ? (
                                <><div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div> Processing...</>
                            ) : !session ? (
                                <><Target className="w-5 h-5" /> Login to Enter Arena</>
                            ) : isRegistered ? (
                                <><Trophy className="w-5 h-5 group-hover:animate-bounce" /> Enter War Room <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                            ) : (
                                <><Flame className="w-5 h-5 group-hover:animate-pulse" /> Join the Battle <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>

                        {isRegistered && session && (
                            <button
                                onClick={() => handleRegistration(event._id, true)}
                                disabled={isProcessing}
                                className="w-full py-3 px-6 text-red-400 border-2 border-red-500/50 rounded-xl hover:bg-red-500/10 hover:border-red-500 transition-all duration-300 font-semibold backdrop-blur-sm"
                            >
                                {isProcessing ? "Processing..." : "Abandon Arena"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default EventCard;