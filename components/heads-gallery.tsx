"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Code, Users, DollarSign, Megaphone, Trophy, Star } from "lucide-react"
import { cn } from "@/lib/utils" // Assumes you have a utility for conditional classes
import ColorThief from "colorthief"

// --- 1. TYPE DEFINITIONS ---
interface TeamMember {
  id: number
  name: string
  imageUrl: string
  role: string
  icon: string
  colors: {
    primary: string
    secondary: string
    text: string
    shadow: string
  }
}

interface TeamData {
  [key: string]: TeamMember[]
}

// --- 2. TEAM DATA STRUCTURE ---
const initialTeamsData: TeamData = {
  "Convener": [
    { id: 39, name: "Jeet Kapoor", imageUrl: "/images/E42918DB-585C-4F31-9ED1-73ADFFF97A06 - Jeet Kapoor IIT Mandi.jpeg", role: "Convener", icon: "crown", colors: { primary: "#1a1a1a", secondary: "#333333", text: "#ffffff", shadow: "rgba(0, 0, 0, 0.5)" } }
  ],
  "Secretary": [
    { id: 38, name: "Divyanshu Raj", imageUrl: "/images/1755419777955~3 - Divyanshu Raj.jpg", role: "Organizing Secretary", icon: "trophy", colors: { primary: "#1a1a1a", secondary: "#333333", text: "#ffffff", shadow: "rgba(0, 0, 0, 0.5)" } }
  ],
   
  "Mentor Team": [
    { id: 14, name: "Gourav Chaudhary", imageUrl: "/images/IMG_20250314_202117_902 - Gourav Chaudhary.webp", role: "Mentor", icon: "users", colors: { primary: "#1a1a1a", secondary: "#333333", text: "#ffffff", shadow: "rgba(0, 0, 0, 0.5)" } },
    { id: 15, name: "Yugant Kanojiya", imageUrl: "/images/IMG-20250718-WA0007 - Yugant Kanojiya IIT Mandi.jpg", role: "Mentor", icon: "users", colors: { primary: "#1a1a1a", secondary: "#333333", text: "#ffffff", shadow: "rgba(0, 0, 0, 0.5)" } },
    { id: 20, name: "Mannepalli Samhitha", imageUrl: "/images/IMG-20250728-WA0016~2 - Mannepalli Samhitha IIT Mandi.jpg", role: "Member", icon: "clipboard", colors: { primary: "#1a1a1a", secondary: "#333333", text: "#ffffff", shadow: "rgba(0, 0, 0, 0.5)" } },
    
  ],
  "Finance Head": [
    { id: 8, name: "Arani Ghosh", imageUrl: "/images/IMG-20241102-WA0001 - Arani Ghosh.jpg", role: "Member", icon: "coffee", colors: { primary: "#1a1a1a", secondary: "#333333", text: "#ffffff", shadow: "rgba(0, 0, 0, 0.5)" } },
  ],
  
  "Hospitality Team": [
    { id: 12, name: "Vansh Goel", imageUrl: "/images/IMG-20250812-WA0004 - VANSH GOEL.jpg", role: "Member", icon: "coffee", colors: { primary: "#1a1a1a", secondary: "#333333", text: "#ffffff", shadow: "rgba(0, 0, 0, 0.5)" } },
    { id: 9, name: "Vani Dhiman", imageUrl: "/images/Vani_B23505 - Vani Dhiman.jpg", role: "Member", icon: "coffee", colors: { primary: "#1a1a1a", secondary: "#333333", text: "#ffffff", shadow: "rgba(0, 0, 0, 0.5)" } },
    { id: 10, name: "Arpit Mishra", imageUrl: "/images/IMG_20250811_175835 - ARPIT MISHRA.jpg", role: "Member", icon: "coffee", colors: { primary: "#1a1a1a", secondary: "#333333", text: "#ffffff", shadow: "rgba(0, 0, 0, 0.5)" } },
    { id: 11, name: "Krsnapriya Vats", imageUrl: "/images/Screenshot_2025-08-12-21-51-53-69_965bbf4d18d205f782c6b8409c5773a4 - KRSNAPRIYA VATS.jpg", role: "Member", icon: "coffee", colors: { primary: "#1a1a1a", secondary: "#333333", text: "#ffffff", shadow: "rgba(0, 0, 0, 0.5)" } },
    { id: 13, name: "Rohan Aggarwal", imageUrl: "/images/IMG_1373 - ROHAN AGGARWAL.jpeg", role: "Member", icon: "coffee", colors: { primary: "#1a1a1a", secondary: "#333333", text: "#ffffff", shadow: "rgba(0, 0, 0, 0.5)" } }
  ],
  "Photography and Videography": [
    { id: 1, name: "Aaditya", imageUrl: "/images/IMG_20250727_002637 - AADITYA ,.jpg", role: "Member", icon: "settings", colors: { primary: "#1a1a1a", secondary: "#333333", text: "#ffffff", shadow: "rgba(0, 0, 0, 0.5)" } },
    { id: 2, name: "Yash Sharma", imageUrl: "/images/IMG_3068(2) - Yash Sharma.heic", role: "Member", icon: "settings", colors: { primary: "#1a1a1a", secondary: "#333333", text: "#ffffff", shadow: "rgba(0, 0, 0, 0.5)" } },
    { id: 3, name: "Pari", imageUrl: "/images/Snapchat-1185299107 - PARI ,.jpg", role: "Member", icon: "settings", colors: { primary: "#1a1a1a", secondary: "#333333", text: "#ffffff", shadow: "rgba(0, 0, 0, 0.5)" } },
    { id: 4, name: "Navya Boddu", imageUrl: "/images/IMG_20250825_100113 - NAVYA BODDU.jpg", role: "Member", icon: "settings", colors: { primary: "#1a1a1a", secondary: "#333333", text: "#ffffff", shadow: "rgba(0, 0, 0, 0.5)" } }
  ],
  "Publicity & Media Team": [
    { id: 5, name: "Shriyaansh Gupta", imageUrl: "/images/Screenshot_2025-08-11-22-17-30-80_965bbf4d18d205f782c6b8409c5773a4 - SHRIYAANSH GUPTA.jpg", role: "Member", icon: "megaphone", colors: { primary: "#1a1a1a", secondary: "#333333", text: "#ffffff", shadow: "rgba(0, 0, 0, 0.5)" } },
    { id: 6, name: "Rudraksh Rajendra Lande", imageUrl: "/images/IMG_20250728_161824 - Rudraksh Rajendra Lande.jpg", role: "Member", icon: "megaphone", colors: { primary: "#1a1a1a", secondary: "#333333", text: "#ffffff", shadow: "rgba(0, 0, 0, 0.5)" } },
    { id: 7, name: "Vivek Choudhary", imageUrl: "/images/IMG_20250731_222228_455 - Vivek Kumar Choudhary.webp", role: "Member", icon: "megaphone", colors: { primary: "#1a1a1a", secondary: "#333333", text: "#ffffff", shadow: "rgba(0, 0, 0, 0.5)" } }
  ],
 
  "Planning & Management Team": [
    { id: 17, name: "Dhruva Rathore", imageUrl: "/images/IMG_20240605_105801_031~2 - Dhruva Rathore.jpg", role: "Member", icon: "clipboard", colors: { primary: "#1a1a1a", secondary: "#333333", text: "#ffffff", shadow: "rgba(0, 0, 0, 0.5)" } },
    { id: 18, name: "Deepesh Tripathi", imageUrl: "/images/IMG20250720173148 - DEEPESH TRIPATHI.jpg", role: "Member", icon: "clipboard", colors: { primary: "#1a1a1a", secondary: "#333333", text: "#ffffff", shadow: "rgba(0, 0, 0, 0.5)" } },
    { id: 19, name: "Mrinal Vora", imageUrl: "/images/IMG_20241001_154016_617 - Mrinal Vora.webp", role: "Member", icon: "clipboard", colors: { primary: "#1a1a1a", secondary: "#333333", text: "#ffffff", shadow: "rgba(0, 0, 0, 0.5)" } },
    ],
  "Sponsorship Team": [
    { id: 25, name: "Tanishq Srivastava", imageUrl: "/images/My pic in suit - TANISHQ SRIVASTAVA.jpeg", role: "Member", icon: "dollar-sign", colors: { primary: "#1a1a1a", secondary: "#333333", text: "#ffffff", shadow: "rgba(0, 0, 0, 0.5)" } },
    { id: 26, name: "Anand Swaroop", imageUrl: "/images/IMG-20250724-WA0026 - Anand Swaroop.jpg", role: "Member", icon: "dollar-sign", colors: { primary: "#1a1a1a", secondary: "#333333", text: "#ffffff", shadow: "rgba(0, 0, 0, 0.5)" } },
    { id: 27, name: "Ojasvi Jain", imageUrl: "/images/IMG-20250401-WA0065-1 - OJASVI JAIN.jpg", role: "Member", icon: "dollar-sign", colors: { primary: "#1a1a1a", secondary: "#333333", text: "#ffffff", shadow: "rgba(0, 0, 0, 0.5)" } },
    { id: 28, name: "Pragy Bohra", imageUrl: "/images/IMG_20250817_234642 - PRAGY BOHRA.jpg", role: "Member", icon: "dollar-sign", colors: { primary: "#1a1a1a", secondary: "#333333", text: "#ffffff", shadow: "rgba(0, 0, 0, 0.5)" } }
  ],
  "Security Team": [
    { id: 29, name: "Vidisha Thokal", imageUrl: "/images/IMG-20250811-WA0110 - THOKAL VIDISHA ATMARAM.jpg", role: "Member", icon: "shield", colors: { primary: "#1a1a1a", secondary: "#333333", text: "#ffffff", shadow: "rgba(0, 0, 0, 0.5)" } },
    { id: 30, name: "Uditya", imageUrl: "/images/IMG_5626 - UDITYA ,.jpeg", role: "Member", icon: "shield", colors: { primary: "#1a1a1a", secondary: "#333333", text: "#ffffff", shadow: "rgba(0, 0, 0, 0.5)" } },
    { id: 31, name: "Sanyam Dhiman", imageUrl: "/images/IMG-20241106-WA0017~2 - SANYAM DHIMAN.jpg", role: "Member", icon: "shield", colors: { primary: "#1a1a1a", secondary: "#333333", text: "#ffffff", shadow: "rgba(0, 0, 0, 0.5)" } },
    { id: 32, name: "Yash Verma", imageUrl: "/images/IMG-20250704-WA0130 - Yash Verma.jpg", role: "Member", icon: "shield", colors: { primary: "#1a1a1a", secondary: "#333333", text: "#ffffff", shadow: "rgba(0, 0, 0, 0.5)" } },
    { id: 33, name: "Abhishek", imageUrl: "/images/IMG_20250811_231629_868~2 - ABHISHEK ,.jpg", role: "Member", icon: "shield", colors: { primary: "#1a1a1a", secondary: "#333333", text: "#ffffff", shadow: "rgba(0, 0, 0, 0.5)" } }
  ],
  "Content Team": [
    { id: 34, name: "Samridhi Singh", imageUrl: "/images/IMG-20250811-WA0013 - SAMRIDHI SINGH.jpg", role: "Member", icon: "book", colors: { primary: "#1a1a1a", secondary: "#333333", text: "#ffffff", shadow: "rgba(0, 0, 0, 0.5)" } },
    { id: 35, name: "Aakansha", imageUrl: "/images/IMG-20240929-WA0200 - AAKANSHA ,.jpg", role: "Member", icon: "book", colors: { primary: "#1a1a1a", secondary: "#333333", text: "#ffffff", shadow: "rgba(0, 0, 0, 0.5)" } }
  ],
  "Design Team": [
    { id: 36, name: "Saanvi Mendiratta", imageUrl: "/images/IMG_3055 - SAANVI MENDIRATTA.jpeg", role: "Member", icon: "pen-tool", colors: { primary: "#1a1a1a", secondary: "#333333", text: "#ffffff", shadow: "rgba(0, 0, 0, 0.5)" } }
  ],
  "Decor Team": [
    { id: 37, name: "Mihir Yadav", imageUrl: "/images/1000035818 - MIHIR YADAV.jpg", role: "Member", icon: "sun", colors: { primary: "#1a1a1a", secondary: "#333333", text: "#ffffff", shadow: "rgba(0, 0, 0, 0.5)" } }
  ],
  
  
}


// --- 3. HELPER & SUB-COMPONENTS ---

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "code": return <Code className="h-5 w-5" />;
    case "dollar": return <DollarSign className="h-5 w-5" />;
    case "megaphone": return <Megaphone className="h-5 w-5" />;
    case "trophy": return <Trophy className="h-5 w-5" />;
    case "star": return <Star className="h-5 w-5" />;
    default: return <Users className="h-5 w-5" />;
  }
}

// Helper function to encode image URLs
const encodeImageUrl = (url: string) => {
  // Split the URL to preserve the path structure
  const parts = url.split('/');
  // Encode only the filename part (last part)
  const encodedParts = parts.map((part, index) => {
    if (index === parts.length - 1) {
      // This is the filename, encode it
      return encodeURIComponent(part);
    }
    return part;
  });
  return encodedParts.join('/');
}

interface CardProps {
  member: TeamMember;
  index: number;
  removeCard: (id: number) => void;
  totalCards: number;
}

function MemberCard({ member, index, removeCard, totalCards }: CardProps) {
  const zIndex = totalCards - index;
  const yOffset = index * 20;
  const encodedImageUrl = encodeImageUrl(member.imageUrl);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 100 }}
      animate={{
        opacity: 1,
        y: yOffset,
        scale: 1 - index * 0.05,
        rotateZ: index * (Math.random() > 0.5 ? 2 : -2),
      }}
      exit={{
        opacity: 0,
        x: Math.random() > 0.5 ? 300 : -300,
        y: 50,
        rotate: Math.random() > 0.5 ? 20 : -20,
        transition: { duration: 0.3 },
      }}
      transition={{ type: "spring", stiffness: 300, damping: 40 }}
      style={{
        zIndex,
        boxShadow: `0 ${10 + index * 5}px ${30 + index * 10}px ${member.colors.shadow}`,
        backgroundColor: member.colors.primary,
      }}
      className="absolute left-0 top-0 h-full w-full cursor-grab overflow-hidden rounded-2xl active:cursor-grabbing"
      drag={index === 0}
      dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={(_, info) => {
        if (index === 0 && (Math.abs(info.offset.x) > 150 || Math.abs(info.offset.y) > 150)) {
          removeCard(member.id);
        }
      }}
      whileDrag={{ scale: 1.05, boxShadow: `0 20px 50px ${member.colors.shadow}` }}
    >
      <motion.div
        className="relative flex h-full flex-col overflow-hidden rounded-2xl"
        style={{ color: member.colors.text }}
      >
        {/* Use img tag instead of background-image for better control */}
        <div className="flex-grow w-full h-full relative overflow-hidden">
          <img
            src={encodedImageUrl}
            alt={member.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error(`Failed to load image: ${encodedImageUrl}`);
              // Fallback to a placeholder or default image
              (e.target as HTMLImageElement).src = '/images/placeholder.png';
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-4 text-white">
          <div className="rounded-full bg-opacity-20 p-2 inline-block mb-2" style={{ backgroundColor: `${member.colors.text}20` }}>
            {getIconComponent(member.icon)}
          </div>
          <h2 className="text-3xl font-bold">{member.name}</h2>
          <h3 className="text-xl font-medium opacity-80">{member.role}</h3>
        </div>

        {index === 0 && (
          <div className="absolute top-4 left-1/2 flex -translate-x-1/2 flex-col items-center opacity-50">
            <motion.div className="h-1 w-10 rounded-full" style={{ backgroundColor: `${member.colors.text}40` }} />
             <span className="text-xs mt-1" style={{color: member.colors.text}}>Drag to dismiss</span>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function TeamCardStack({ initialMembers }: { initialMembers: TeamMember[] }) {
  const [cards, setCards] = useState<TeamMember[]>(initialMembers);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCards(initialMembers);
    setLoading(true);
    
    const extractAllColors = async () => {
      const colorThief = new ColorThief();
      const updatedMembers = await Promise.all(
        initialMembers.map(async (member) => {
          try {
            const img = new Image();
            const encodedUrl = encodeImageUrl(member.imageUrl);
            img.src = encodedUrl;
            
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = (error) => {
                console.error(`Failed to load image for color extraction: ${encodedUrl}`, error);
                reject(error);
              };
            });

            const palette = colorThief.getPalette(img, 3);
            
            const primaryColor = `rgb(${palette[0][0]}, ${palette[0][1]}, ${palette[0][2]})`;
            const shadowColor = `rgba(${palette[0][0]}, ${palette[0][1]}, ${palette[0][2]}, 0.6)`;
            const brightness = (palette[0][0] * 299 + palette[0][1] * 587 + palette[0][2] * 114) / 1000;
            const textColor = brightness < 128 ? "#ffffff" : "#000000";

            return { ...member, colors: { ...member.colors, primary: primaryColor, text: textColor, shadow: shadowColor } };
          } catch (error) {
            console.error(`Failed to load image or extract colors for: ${member.imageUrl}`, error);
            return member; // Return original member on error
          }
        })
      );
      setCards(updatedMembers);
      setLoading(false);
    };
    extractAllColors();
  }, [initialMembers]);
  
  const removeCard = (id: number) => {
    setCards((prev) => {
      const dismissedCard = prev.find(c => c.id === id);
      if (!dismissedCard) return prev;
      return [...prev.filter((card) => card.id !== id), dismissedCard];
    });
  };

  if (loading) {
    return <div className="flex h-96 w-full items-center justify-center text-muted-foreground">Loading Members...</div>;
  }
  
  return (
    <div className="relative h-[450px] w-full max-w-sm mx-auto mt-8 md:mt-0">
      <AnimatePresence>
        {cards.slice(0, 4).map((member, index) => (
          <MemberCard
            key={member.id}
            member={member}
            index={index}
            removeCard={removeCard}
            totalCards={Math.min(cards.length, 4)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// --- 4. MAIN EXPORTED COMPONENT ---
export function HeadsGallery() {
  const [selectedTeam, setSelectedTeam] = useState<string>(Object.keys(initialTeamsData)[0]);
  const teamNames = Object.keys(initialTeamsData);

  return (
    <section className="py-20 bg-background" id="our-teams">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Meet the <span className="text-primary" style={{ fontFamily: 'GreekFont' }}>Organizing Team</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            The dedicated minds working tirelessly to bring this event to life. Select a team to see its members.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <aside className="md:w-1/4 lg:w-1/5">
            <h3 className="text-xl font-semibold mb-4 text-foreground">Teams</h3>
            <div className="space-y-2">
              {teamNames.map((teamName) => (
                <button
                  key={teamName}
                  onClick={() => setSelectedTeam(teamName)}
                  className={cn(
                    "w-full text-left p-3 rounded-md transition-colors duration-200 text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                    { "bg-primary text-primary-foreground hover:bg-primary/90": selectedTeam === teamName }
                  )}
                >
                  {teamName}
                </button>
              ))}
            </div>
          </aside>

          {/* Main Content - Card Stack */}
          <main className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTeam} // This key is crucial for AnimatePresence to detect changes
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TeamCardStack initialMembers={initialTeamsData[selectedTeam]} />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </section>
  );
}