"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Building, Wifi, Car, Utensils, Dumbbell, BookOpen } from "lucide-react"
import Image from "next/image"

// Import Swiper React components and modules
import { Swiper, SwiperSlide } from "swiper/react"
import type { Swiper as SwiperCore } from "swiper"
import { FreeMode, Navigation, Thumbs, Autoplay, EffectCoverflow, Pagination } from "swiper/modules"

// Import Swiper styles
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/navigation"
import "swiper/css/thumbs"
import "swiper/css/effect-coverflow" // <-- New style import for Coverflow
import "swiper/css/pagination"       // <-- New style import for Pagination

// --- Main CollegeFacilities Component ---
export function CollegeFacilities() {
  // State to hold the thumbnail Swiper instance
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null)

  // Combined data for facilities with corresponding images
  const facilitiesData = [
    {
      icon: Building,
      title: "Modern Infrastructure",
      description: "State-of-the-art academic and residential buildings with contemporary amenities.",
      imgSrc: "/collage/1.png" 
    },
    {
      icon: Dumbbell,
      title: "Sports Complex",
      description: "Olympic-standard facilities including swimming pool, gymnasium, and outdoor courts.",
      imgSrc: "/collage/2.png" 
    },
    {
      icon: Utensils,
      title: "Dining Facilities",
      description: "Multiple mess halls and cafeterias serving diverse cuisines.",
     imgSrc: "/collage/3.png" 
    },
    {
      icon: Wifi,
      title: "High-Speed Internet",
      description: "Campus-wide Wi-Fi connectivity for seamless digital experience.",
      imgSrc: "/collage/7.png" 
    },
    {
      icon: BookOpen,
      title: "Library & Labs",
      description: "Extensive library and cutting-edge research laboratories.",
      imgSrc: "/collage/5.png" 
    },
    {
      icon: Car,
      title: "Transportation",
      description: "Easy connectivity with shuttle services and parking facilities.",
      imgSrc: "/collage/6.png" 
    },
  ]
  
  // Extract image sources for the new slider to avoid redundancy
  const campusImages = facilitiesData.map(facility => facility.imgSrc);


  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            <span className="text-primary">IIT Mandi</span> Facilities
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Experience world-class facilities nestled in the scenic beauty of the Himalayas. Our campus provides
            everything you need for an unforgettable sports festival experience.
          </p>
        </div>

        {/* --- Synced Image Slider and Thumbnail Gallery --- */}
        <div className="mb-20">
          {/* Main Slider */}
          <Swiper
            loop={true}
            spaceBetween={10}
            navigation={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            modules={[FreeMode, Navigation, Thumbs, Autoplay]}
            className="h-96 md:h-[500px] w-full rounded-lg"
          >
            {facilitiesData.map((facility, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full">
                  <Image
                    src={facility.imgSrc}
                    alt={facility.title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Thumbnail Gallery Slider */}
          <Swiper
            onSwiper={setThumbsSwiper}
            loop={false}
            spaceBetween={10}
            slidesPerView={4}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="mt-4"
            breakpoints={{
              640: { slidesPerView: 5, spaceBetween: 15 },
              1024: { slidesPerView: 6, spaceBetween: 20 },
            }}
          >
            {facilitiesData.map((facility, index) => (
              <SwiperSlide key={index} className="cursor-pointer">
                <div className="aspect-video w-full rounded-md overflow-hidden opacity-60 hover:opacity-100 transition-opacity swiper-slide-thumb-active:opacity-100 swiper-slide-thumb-active:ring-2 ring-primary ring-offset-2 ring-offset-background">
                  <Image src={facility.imgSrc} alt={`${facility.title} thumbnail`} layout="fill" objectFit="cover" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* --- Campus in the Clouds Section (Updated) --- */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* The new Coverflow slider is placed here */}
            <div className="w-full min-h-[350px] flex items-center justify-center">
              <CampusImageSlider images={campusImages} /> {/* <-- UPDATED SLIDER */}
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-6 text-foreground">Campus in the Clouds</h3>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Located at an altitude of 1,400 meters above sea level, IIT Mandi offers a unique blend of academic
                excellence and natural beauty. Our campus is designed to inspire innovation while providing a
                comfortable living environment.
              </p>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                The sports facilities at IIT Mandi are designed to international standards, making it the perfect venue
                for RANN-NEETI. From indoor courts to outdoor fields, every facility is maintained to ensure peak
                performance.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-primary/10 px-4 py-2 rounded-full">
                  <span className="text-primary font-semibold">Green Campus</span>
                </div>
                <div className="bg-primary/10 px-4 py-2 rounded-full">
                  <span className="text-primary font-semibold">24/7 Security</span>
                </div>
                <div className="bg-primary/10 px-4 py-2 rounded-full">
                  <span className="text-primary font-semibold">Medical Facility</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


// --- NEW Coverflow Image Slider Component ---
function CampusImageSlider({ images }: { images: string[] }) {
  return (
    <div className="w-full">
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        className="w-full py-8" // Added padding for pagination dots
      >
        {images.map((src, index) => (
          <SwiperSlide key={index} style={{ width: "70%", maxWidth: "350px" }}> {/* Control slide width */}
            <div className="relative aspect-square w-full rounded-lg overflow-hidden shadow-xl">
              <Image
                src={src}
                alt={`IIT Mandi Campus Image ${index + 1}`}
                layout="fill"
                objectFit="cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}