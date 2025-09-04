"use client";
import React, { useLayoutEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';

// --- Configuration for the shapes ---
const SHAPE_COUNT = 25; // Increased for more visual richness
const SHAPE_COLORS = ['#f97316', '#38bdf8', '#ffffff', '#10b981', '#f59e0b', '#ef4444']; // Added more colors
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
        container.removeChild(flash);
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
        cursor: 'crosshair', // Visual hint that it's interactive
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 100%)',
      }}
    />
  );
};

export default AnimatedBackground;