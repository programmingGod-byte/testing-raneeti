"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ArrowRight, Trophy, Users, Calendar, MapPin, PlayCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// --- 1. UPDATED DATA FOR THE VIDEO SLIDER ---
const videoData = [
  {
    id: 1,
    type: 'local', // Type can be 'local' or 'youtube'
    thumbnailUrl: "/images/video-thumb-1.jpg", 
    videoUrl: "/videos/fest-recap.mp4", // Path to local video
    title: "Official Fest Recap",
  },
  {
    id: 2,
    type: 'youtube',
    thumbnailUrl: "/images/video-thumb-2.jpg",
    videoUrl: "https://www.youtube.com/embed/videoseries?list=PLx0sYbCqOb8TBPR_vp3eH4M_ChI_2qE3e&autoplay=1",
    title: "Thrilling Sports Moments",
  },
  {
    id: 3,
    type: 'local',
    thumbnailUrl: "/images/video-thumb-3.jpg",
    videoUrl: "/videos/cultural-night.mp4",
    title: "Cultural Night Extravaganza",
  },
  {
    id: 4,
    type: 'youtube',
    thumbnailUrl: "/images/video-thumb-4.jpg",
    videoUrl: "https://www.youtube.com/embed/LXb3EKWsInQ?autoplay=1",
    title: "Athlete Interviews",
  },
];

// Define a type for our video data for better TypeScript support
type VideoData = typeof videoData[0];


export function AboutFestival() {
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);

  return (
    <section className="py-20 sm:py-24 lg:py-32 bg-gradient-to-b from-background via-muted/40 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ... (rest of your component content remains the same) ... */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
            About <span className="text-primary" style={{ fontFamily: 'GreekFont' }}>RANN-NEETI</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            RANN-NEETI is IIT Mandi's premier sports festival that brings together the finest athletes from across the
            nation. Inspired by the Gods of Olympus, we celebrate the spirit of competition, excellence, and
            sportsmanship.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 items-center">
          <div className="justify-center flex">
            <div className="relative w-48 h-48 animate-float">
              <Image
                src="/images-removebg-preview.png"
                alt="RANN-NEETI Logo"
                layout="fill"
                objectFit="contain"
                className="rounded-md shadow-md"
              />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-4 tracking-tight">Embracing the Spirit</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The RANN-NEETI logo symbolizes the fusion of strategy ('Neeti') with the battlefield ('Rann'), embodying the
              essence of competitive sports. It represents the platform where tactical prowess meets athletic excellence,
              in the majestic setting of IIT Mandi.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          <InfoCard icon={<Trophy className="w-8 h-8 text-primary" />} title="50+ Events" description="From traditional sports to modern competitions" />
          <InfoCard icon={<Users className="w-8 h-8 text-primary" />} title="1000+ Athletes" description="Participants from top colleges nationwide" />
          <InfoCard icon={<Calendar className="w-8 h-8 text-primary" />} title="3 Days of Glory" description="Non-stop action and entertainment" />
          <InfoCard icon={<MapPin className="w-8 h-8 text-primary" />} title="IIT Mandi" description="World-class facilities in the Himalayas" />
        </div>

        {/* <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
            Fest in Motion
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Relive the most electrifying moments from our past editions. Click on any video to watch.
          </p>
        </div>
        
        <Carousel opts={{ align: "start", loop: true, }} className="w-full max-w-6xl mx-auto">
          <CarouselContent>
            {videoData.map((video) => (
              <CarouselItem key={video.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card 
                    className="overflow-hidden group cursor-pointer"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <CardContent className="p-0 flex flex-col aspect-video items-center justify-center relative">
                      <Image
                        src={video.thumbnailUrl}
                        alt={video.title}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                      <PlayCircle className="w-16 h-16 text-white/80 absolute z-10 transform transition-transform duration-300 group-hover:scale-110" />
                      <p className="absolute bottom-2 left-3 text-white font-semibold text-sm z-10">{video.title}</p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel> */}
      </div>

      {/* --- 3. UPDATED VIDEO PLAYER MODAL --- */}
      <Dialog open={!!selectedVideo} onOpenChange={(isOpen) => !isOpen && setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl w-full p-0 border-0 bg-black">
          <div className="aspect-video">
            {selectedVideo?.type === 'youtube' && (
              <iframe
                width="100%"
                height="100%"
                src={selectedVideo.videoUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            )}
            {selectedVideo?.type === 'local' && (
              <video controls autoPlay width="100%" height="100%">
                <source src={selectedVideo.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

// Reusable Card component for cleaner code
function InfoCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="text-center bg-card/60 backdrop-blur-sm border-border/20 hover:border-primary/50 hover:bg-card hover:-translate-y-2 transition-all duration-300 shadow-md hover:shadow-primary/10">
      <CardContent className="p-8">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5 border-2 border-primary/20">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2 text-foreground">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}