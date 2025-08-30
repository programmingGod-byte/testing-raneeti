"use client"
import React from 'react';
import { Navbar } from "@/components/navbar"

// --- Data for the Sports Cards ---
// NOTE: I've updated the names to match your image (e.g., Weight Lifting).
// You should replace these imageUrls with your own stylized graphics
// to fully match the look of your provided image.
const sportsData = [
  {
    name: 'Athletics',
    // Replace with your stylized image URL
    imageUrl: 'https://live.staticflickr.com/65535/52312199966_4be79e7e75_w.jpg',
  },
  {
    name: 'Badminton',
    imageUrl: 'https://live.staticflickr.com/65535/52345655636_fa9218d45e_n.jpg',
  },
  {
    name: 'Basketball',
    imageUrl: 'https://live.staticflickr.com/65535/52312513238_7aeba39a52_w.jpg',
  },
  {
    name: 'Chess',
    // The chess image is different, using a more realistic style
    imageUrl: 'https://live.staticflickr.com/65535/52345960989_e9bca2e00d_z.jpg',
  },
  {
    name: 'Cricket',
    imageUrl: 'https://live.staticflickr.com/65535/52345655506_afcbbc0b43_w.jpg',
  },
  {
    name: 'Football',
    imageUrl: 'https://live.staticflickr.com/65535/52346081405_d8c1db4e64_w.jpg',
  },
  
  {
    name: 'Hockey',
    imageUrl: 'https://live.staticflickr.com/65535/52312512833_16e26e1003_w.jpg',
  },
  
];


const EventsPage: React.FC = () => {
  return (
    <>
    <Navbar/>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Teko:wght@700&family=Inter:wght@400;600;700&display=swap');
        
        :root {
            --bg-color: #3e3e3e; 
            --text-primary: #ffffff;
            --text-secondary: #cccccc;
            --accent-orange: #f97316;
            --accent-sky: #38bdf8;
            --font-display: 'Teko', sans-serif;
            --font-body: 'Inter', sans-serif;
        }

        body {
            /* --- MODIFIED: Added your static background image --- */
            background-image: url('https://live.staticflickr.com/65535/52305606430_40ba7828eb_h.jpg');
            background-size: cover; /* Ensures the image covers the whole screen */
            background-position: center center; /* Centers the image */
            background-repeat: no-repeat; /* Prevents the image from repeating */
            background-attachment: fixed; /* Makes the background static (non-scrolling) */
            background-color: var(--bg-color); /* Fallback color */
            
            color: var(--text-primary);
            font-family: var(--font-body);
            line-height: 1.6;
            overflow-x: hidden;
            margin: 0;
            padding: 0;
            min-height: 100vh;
        }

        * {
            box-sizing: border-box;
        }
      `}</style>
      
      <style jsx>{`
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 4rem 2rem;
            position: relative;
        }

        header {
            text-align: center;
            margin-bottom: 4rem;
        }

        header h1 {
            font-family: var(--font-display);
            font-size: 5rem;
            text-transform: uppercase;
            letter-spacing: -2px;
            line-height: 1;
            margin-bottom: 1rem;
            text-shadow: 0 0 30px rgba(56, 189, 248, 0.5);
        }

        .gradient-text {
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
        }
        
        .gradient-orange {
            background-image: linear-gradient(45deg, #f97316, #fbbf24);
        }

        .gradient-blue {
            background-image: linear-gradient(45deg, #38bdf8, #0ea5e9);
        }

        header p {
            font-size: 1.25rem;
            color: var(--text-secondary);
            max-width: 600px;
            margin: 0 auto;
        }
        
        .categories-grid {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 1.5rem;
            padding: 2rem 0;
            max-width: 1200px;
            margin: 0 auto;
        }

        .category-card {
            position: relative;
            width: 260px;
            height: 300px;
            transition: transform 0.3s ease, filter 0.3s ease;
            cursor: pointer;
            background-color: #a8d5e5;
            clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
            padding: 4px;
        }
        
        .category-card:hover {
            transform: scale(1.05);
            filter: drop-shadow(0 0 15px rgba(168, 213, 229, 0.6));
        }
        
        .card-inner {
            position: relative;
            width: 100%;
            height: 100%;
            /* --- MODIFIED: Changed background to white as requested --- */
            background-color: #ffffff;
            clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            padding-top: 1.5rem;
        }

        .card-title {
            font-family: 'Inter', sans-serif;
            font-weight: 700;
            font-size: 1.1rem;
            color: #333;
            text-transform: uppercase;
            margin-bottom: 1rem;
        }
        
        .card-image {
            width: 70%;
            height: auto;
            max-height: 180px;
            object-fit: contain;
        }
        
        @media (max-width: 768px) {
            header h1 {
                font-size: 3.5rem;
            }
            .container {
                padding: 3rem 1rem;
            }
            .categories-grid {
                gap: 1rem;
            }
            .category-card {
                width: 200px;
                height: 230px;
            }
        }
        @media (max-width: 480px) {
            .category-card {
                width: 150px;
                height: 173px;
            }
            .card-title {
                font-size: 0.9rem;
            }
        }
      `}</style>
      
      <div className="container">
        <header>
          <h1>
            THE <span className="gradient-text gradient-orange">ARENA</span> OF <span className="gradient-text gradient-blue">CHAMPIONS</span>
          </h1>
          <p>
            Forge your legacy. Compete against the best. Seize victory.
          </p>
        </header>

        <section className="categories">
          <div className="categories-grid">
            {sportsData.map((sport) => (
              <div key={sport.name} className="category-card">
                <div className="card-inner">
                  <h3 className="card-title">{sport.name}</h3>
                  <img src={sport.imageUrl} alt={sport.name} className="card-image" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default EventsPage;