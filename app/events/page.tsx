"use client"
import React, { useState, useLayoutEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';

// You will need to have a Navbar component at this path
// import { Navbar } from "@/components/navbar";
// Placeholder Navbar component for this example
import { Navbar } from "@/components/navbar";

// ============================================================================
// 1. ENHANCED ANIMATED BACKGROUND COMPONENT WITH FIREWORKS
// ============================================================================
const SHAPE_COUNT = 25;
const SHAPE_COLORS = ['#f97316', '#38bdf8', '#ffffff', '#10b981', '#f59e0b', '#ef4444'];
const FIREWORK_COLORS = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8'];

interface FireworkParticle {
  element: HTMLDivElement;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

const AnimatedBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const fireworkParticles = useRef<FireworkParticle[]>([]);
  const animationFrame = useRef<number>();

  // Create firework explosion at click point
  const createFirework = useCallback((x: number, y: number) => {
    const container = containerRef.current;
    if (!container) return;

    const particleCount = gsap.utils.random(15, 30);
    const baseColor = gsap.utils.random(FIREWORK_COLORS);
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      const size = gsap.utils.random(4, 12);
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.position = 'absolute';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.backgroundColor = baseColor;
      particle.style.borderRadius = '50%';
      particle.style.boxShadow = `0 0 ${size * 2}px ${baseColor}`;
      particle.style.zIndex = '100';
      
      // Random shape variations
      if (Math.random() > 0.7) {
        particle.style.borderRadius = '0';
        particle.style.transform = 'rotate(45deg)';
      }
      
      container.appendChild(particle);

      const angle = (Math.PI * 2 * i) / particleCount + gsap.utils.random(-0.3, 0.3);
      const velocity = gsap.utils.random(100, 300);
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity - gsap.utils.random(50, 150); // Add upward bias
      
      const fireworkParticle: FireworkParticle = {
        element: particle,
        vx,
        vy,
        life: 1,
        maxLife: gsap.utils.random(60, 120), // frames
        color: baseColor
      };
      
      fireworkParticles.current.push(fireworkParticle);
    }

    // Add explosion flash effect
    const flash = document.createElement('div');
    flash.style.position = 'absolute';
    flash.style.left = `${x - 50}px`;
    flash.style.top = `${y - 50}px`;
    flash.style.width = '100px';
    flash.style.height = '100px';
    flash.style.backgroundColor = baseColor;
    flash.style.borderRadius = '50%';
    flash.style.opacity = '0.8';
    flash.style.filter = 'blur(20px)';
    flash.style.zIndex = '99';
    container.appendChild(flash);

    gsap.to(flash, {
      scale: 3,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        if (container.contains(flash)) {
          container.removeChild(flash);
        }
      }
    });
  }, []);

  // Animate firework particles
  const animateFireworks = useCallback(() => {
    fireworkParticles.current = fireworkParticles.current.filter(particle => {
      particle.life--;
      
      if (particle.life <= 0) {
        if (particle.element.parentNode) {
          particle.element.parentNode.removeChild(particle.element);
        }
        return false;
      }

      // Physics
      particle.vy += 0.8; // gravity
      particle.vx *= 0.99; // air resistance
      particle.vy *= 0.99;

      const currentX = parseFloat(particle.element.style.left);
      const currentY = parseFloat(particle.element.style.top);
      
      particle.element.style.left = `${currentX + particle.vx / 60}px`;
      particle.element.style.top = `${currentY + particle.vy / 60}px`;
      
      // Fade out over time
      const alpha = particle.life / particle.maxLife;
      particle.element.style.opacity = alpha.toString();
      
      // Sparkle effect
      if (Math.random() > 0.8) {
        particle.element.style.boxShadow = `0 0 ${gsap.utils.random(10, 30)}px ${particle.color}`;
      }
      
      return true;
    });

    animationFrame.current = requestAnimationFrame(animateFireworks);
  }, []);

  // Handle clicks
  const handleClick = useCallback((e: MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    createFirework(x, y);
    
    // Create secondary burst for extra effect
    setTimeout(() => {
      createFirework(
        x + gsap.utils.random(-30, 30), 
        y + gsap.utils.random(-30, 30)
      );
    }, gsap.utils.random(100, 300));
  }, [createFirework]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const shapes: HTMLDivElement[] = [];

    // Create floating background shapes
    for (let i = 0; i < SHAPE_COUNT; i++) {
      const shape = document.createElement('div');
      const size = gsap.utils.random(20, 80);
      const shapeType = gsap.utils.random(['circle', 'hexagon', 'triangle', 'star']);
      
      shape.style.width = `${size}px`;
      shape.style.height = `${size}px`;
      shape.style.position = 'absolute';
      shape.style.left = `${gsap.utils.random(0, 100)}%`;
      shape.style.top = `${gsap.utils.random(0, 100)}%`;
      shape.style.backgroundColor = gsap.utils.random(SHAPE_COLORS);
      shape.style.opacity = '0.1';
      shape.style.filter = `blur(${gsap.utils.random(1, 3)}px)`;

      // Different shape types
      switch (shapeType) {
        case 'hexagon':
          shape.style.clipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
          break;
        case 'triangle':
          shape.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
          break;
        case 'star':
          shape.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
          break;
        default:
          shape.style.borderRadius = '50%';
      }

      container.appendChild(shape);
      shapes.push(shape);
    }

    // Enhanced GSAP animations for background shapes
    shapes.forEach((shape, index) => {
      // Main movement animation
      gsap.to(shape, {
        x: gsap.utils.random(-200, 200),
        y: gsap.utils.random(-200, 200),
        rotation: gsap.utils.random(0, 360),
        scale: gsap.utils.random(0.3, 1.8),
        duration: gsap.utils.random(15, 35),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: gsap.utils.random(0, 8),
      });

      // Additional subtle animations
      gsap.to(shape, {
        opacity: gsap.utils.random(0.05, 0.2),
        duration: gsap.utils.random(3, 8),
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
        delay: gsap.utils.random(0, 5),
      });

      // Occasional color shifts
      if (Math.random() > 0.7) {
        gsap.to(shape, {
          filter: `hue-rotate(${gsap.utils.random(0, 360)}deg) blur(${gsap.utils.random(1, 4)}px)`,
          duration: gsap.utils.random(10, 20),
          repeat: -1,
          yoyo: true,
          ease: 'none',
        });
      }
    });

    // Add click listener
    container.addEventListener('click', handleClick);
    
    // Start firework animation loop
    animateFireworks();

    // Cleanup function
    return () => {
      container.removeEventListener('click', handleClick);
      container.innerHTML = '';
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      fireworkParticles.current = [];
    };
  }, [handleClick, animateFireworks]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        overflow: 'hidden',
        cursor: 'crosshair',
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 100%)',
      }}
    />
  );
};

// ============================================================================
// 2. DATA AND TYPES
// ============================================================================
const sportsData = [
  {
    name: 'Athletics',
    imageUrl: 'https://live.staticflickr.com/65535/52312199966_4be79e7e75_w.jpg',
    rules: ["No specific limit on participants per institute.","Please refer to the rulebook for individual event entry limits."],
  },
  {
    name: 'Badminton',
    imageUrl: 'https://live.staticflickr.com/65535/52345655636_fa9218d45e_n.jpg',
    rules: ["Men's Team: Max 5 players.", "Women's Team: Max 4 players."],
  },
  {
    name: 'Basketball',
    imageUrl: 'https://live.staticflickr.com/65535/52312513238_7aeba39a52_w.jpg',
    rules: ["Men's Team: Max 11 players.", "Women's Team: Max 10 players."],
  },
  {
    name: 'Chess',
    imageUrl: 'https://live.staticflickr.com/65535/52345960989_e9bca2e00d_z.jpg',
    rules: ["Team Size: Max 5 players (4 players + 1 standby)."],
  },
  {
    name: 'Cricket',
    imageUrl: 'https://live.staticflickr.com/65535/52345655506_afcbbc0b43_w.jpg',
    rules: ["Team Size: Max 16 players."],
  },
  {
    name: 'Football',
    imageUrl: 'https://live.staticflickr.com/65535/52346081405_d8c1db4e64_w.jpg',
    rules: ["Team Size: Max 16 players."],
  },
  {
    name: 'Hockey',
    imageUrl: 'https://live.staticflickr.com/65535/52312512833_16e26e1003_w.jpg',
    rules: ["Team Size: Max 15 players."],
  },
];

type Sport = { name: string; imageUrl: string; rules: string[]; };

// ============================================================================
// 3. SPORT MODAL COMPONENT
// ============================================================================
const SportModal: React.FC<{ sport: Sport | null; onClose: () => void; rulebookUrl: string }> = ({ sport, onClose, rulebookUrl }) => {
  if (!sport) return null;

  return (
    <>
      <style jsx>{`
        .modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.7); display: flex; align-items: center;
          justify-content: center; z-index: 1000; backdrop-filter: blur(5px);
          animation: fadeIn 0.3s ease;
        }
        .modal-content {
          background: #ffffff; color: #333; padding: 2rem; border-radius: 12px;
          max-width: 500px; width: 90%; position: relative;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); animation: slideIn 0.3s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn {
          from { transform: translateY(-30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .close-button {
          position: absolute; top: 15px; right: 15px; background: none; border: none;
          font-size: 2rem; cursor: pointer; color: #888; line-height: 1;
        }
        .close-button:hover { color: #333; }
        .modal-header { text-align: center; margin-bottom: 1.5rem; }
        .modal-title {
          font-family: 'Teko', sans-serif; font-size: 2.5rem; color: #111;
          text-transform: uppercase;
        }
        .modal-rules h4 {
            font-family: 'Inter', sans-serif; font-weight: 700; font-size: 1.2rem;
            color: #333; margin-bottom: 0.5rem; border-bottom: 2px solid #f97316;
            padding-bottom: 0.25rem; display: inline-block;
        }
        .modal-rules ul { list-style-type: none; padding: 0; }
        .modal-rules li {
            background-color: #f4f4f5; padding: 0.75rem; border-radius: 6px;
            margin-bottom: 0.5rem; font-family: 'Inter', sans-serif; font-size: 1rem;
        }
        .rulebook-link {
            display: inline-block; margin-top: 1.5rem; padding: 0.75rem 1.5rem;
            background-image: linear-gradient(45deg, #f97316, #fbbf24);
            color: white; text-decoration: none; font-weight: 600; border-radius: 8px;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .rulebook-link:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(249, 115, 22, 0.4);
        }
      `}</style>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="close-button" onClick={onClose}>&times;</button>
          <div className="modal-header"><h2 className="modal-title">{sport.name}</h2></div>
          <div className="modal-body">
            <div className="modal-rules">
                <h4>Participation Rules</h4>
                <ul>{sport.rules.map((rule, index) => <li key={index}>{rule}</li>)}</ul>
            </div>
          </div>
          <div className="modal-footer" style={{ textAlign: 'center' }}>
            <a href={rulebookUrl} className="rulebook-link" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: 'red' }}>
              View Full Rulebook
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

// ============================================================================
// 4. MAIN EVENTS PAGE COMPONENT
// ============================================================================
const EventsPage: React.FC = () => {
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const RULEBOOK_URL = "#"; // TODO: Replace with your actual rulebook URL

  const handleCardClick = (sport: Sport) => setSelectedSport(sport);
  const handleCloseModal = () => setSelectedSport(null);
  
  return (
    <>
      <Navbar/>
      <AnimatedBackground />
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Teko:wght@700&family=Inter:wght@400;600;700&display=swap');
        
        :root {
            --bg-color: #3e3e3e; --text-primary: #ffffff; --text-secondary: #cccccc;
            --accent-orange: #f97316; --accent-sky: #38bdf8;
            --font-display: 'Teko', sans-serif; --font-body: 'Inter', sans-serif;
        }
        body {
            background-color: #111827; /* Dark background for the animation */
            color: var(--text-primary); font-family: var(--font-body);
            line-height: 1.6; overflow-x: hidden; margin: 0; padding: 0; min-height: 100vh;
        }
        * { box-sizing: border-box; }
      `}</style>
      
      <style jsx>{`
        .container { max-width: 1400px; margin: 0 auto; padding: 6rem 2rem 4rem; position: relative; }
        header { text-align: center; margin-bottom: 4rem; }
        header h1 {
            font-family: var(--font-display); font-size: 5rem; text-transform: uppercase;
            letter-spacing: -2px; line-height: 1; margin-bottom: 1rem;
            text-shadow: 0 0 30px rgba(56, 189, 248, 0.5);
        }
        .gradient-text { background-clip: text; -webkit-background-clip: text; color: transparent; }
        .gradient-orange { background-image: linear-gradient(45deg, #f97316, #fbbf24); }
        .gradient-blue { background-image: linear-gradient(45deg, #38bdf8, #0ea5e9); }
        header p { font-size: 1.25rem; color: var(--text-secondary); max-width: 600px; margin: 0 auto; }
        .categories-grid { display: flex; flex-wrap: wrap; justify-content: center; gap: 1.5rem; padding: 2rem 0; max-width: 1200px; margin: 0 auto; }
        .category-card {
            position: relative; width: 260px; height: 300px; cursor: pointer;
            background-color: #a8d5e5; padding: 4px;
            clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
            transition: transform 0.3s ease, filter 0.3s ease;
        }
        .category-card:hover {
            transform: scale(1.05) translateY(-10px);
            filter: drop-shadow(0 0 20px rgba(168, 213, 229, 0.7));
        }
        .card-inner {
            width: 100%; height: 100%; background-color: #ffffff; display: flex;
            flex-direction: column; align-items: center; justify-content: flex-start;
            padding-top: 1.5rem;
            clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        }
        .card-title {
            font-family: 'Inter', sans-serif; font-weight: 700; font-size: 1.1rem;
            color: #333; text-transform: uppercase; margin-bottom: 1rem;
        }
        .card-image { width: 70%; height: auto; max-height: 180px; object-fit: contain; }
        
        @media (max-width: 768px) {
            header h1 { font-size: 3.5rem; }
            .container { padding: 5rem 1rem 3rem; }
            .categories-grid { gap: 1rem; }
            .category-card { width: 200px; height: 230px; }
        }
        @media (max-width: 480px) {
            .category-card { width: 150px; height: 173px; }
            .card-title { font-size: 0.9rem; }
        }
      `}</style>
      
      <div className="container">
        <header>
          <h1 style={{
            fontFamily: 'GreekFont, sans-serif',
          }}>
            THE <span className="" style={{
              color:"red",
              fontFamily: 'GreekFont, sans-serif',
            }}>ARENA</span> OF <span className="text-red" style={{
              color:"red",
              fontFamily: 'GreekFont, sans-serif',
            }}>CHAMPIONS</span>
          </h1>
          <p>Forge your legacy. Compete against the best. Seize victory.</p>
          
        </header>

        <section className="categories">
          <div className="categories-grid">
            {sportsData.map((sport) => (
              <div key={sport.name} className="category-card" onClick={() => handleCardClick(sport)}>
                <div className="card-inner">
                  <h3 className="card-title">{sport.name}</h3>
                  <img src={sport.imageUrl} alt={sport.name} className="card-image" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      
      <SportModal sport={selectedSport} onClose={handleCloseModal} rulebookUrl={RULEBOOK_URL} />
    </>
  );
};

export default EventsPage;