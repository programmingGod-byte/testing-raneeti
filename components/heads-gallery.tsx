"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

export function HeadsGallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  
  const galleryImages = [
    {
    src: "/images/image.png",
    alt: "VANSH GOEL",
    title: "VANSH GOEL",
  },
  {
    src: "/images/Screenshot_2025-08-11-22-17-30-80_965bbf4d18d205f782c6b8409c5773a4 - SHRIYAANSH GUPTA.jpg",
    alt: "SHRIYAANSH GUPTA",
    title: "SHRIYAANSH GUPTA",
  },
  {
    src: "/images/1000035818 - MIHIR YADAV.jpg",
    alt: "MIHIR YADAV",
    title: "MIHIR YADAV",
  },
  {
    src: "/images/IMG_20240605_105801_031~2 - Dhruva Rathore.jpg",
    alt: "Dhruva Rathore",
    title: "Dhruva Rathore",
  },
  {
    src: "/images/IMG-20240929-WA0200 - AAKANSHA ,.jpg",
    alt: "AAKANSHA",
    title: "AAKANSHA",
  },
  {
    src: "/images/IMG_20241001_154016_617 - Mrinal Vora.webp",
    alt: "Mrinal Vora",
    title: "Mrinal Vora",
  },
  {
    src: "/images/IMG-20241102-WA0001 - Arani Ghosh.jpg",
    alt: "Arani Ghosh",
    title: "Arani Ghosh",
  },
  {
    src: "/images/IMG-20241106-WA0017~2 - SANYAM DHIMAN.jpg",
    alt: "SANYAM DHIMAN",
    title: "SANYAM DHIMAN",
  },
  {
    src: "/images/IMG_20250314_202117_902 - Gourav Chaudhary.webp",
    alt: "Gourav Chaudhary",
    title: "Gourav Chaudhary",
  },
  {
    src: "/images/IMG-20250401-WA0065-1 - OJASVI JAIN.jpg",
    alt: "OJASVI JAIN",
    title: "OJASVI JAIN",
  },
  {
    src: "/images/IMG-20250628-WA0021 - LUCKY.jpg",
    alt: "LUCKY",
    title: "LUCKY",
  },
  {
    src: "/images/IMG-20250704-WA0130 - Yash Verma.jpg",
    alt: "Yash Verma",
    title: "Yash Verma",
  },
  {
    src: "/images/IMG-20250718-WA0007 - Yugant Kanojiya IIT Mandi.jpg",
    alt: "Yugant Kanojiya IIT Mandi",
    title: "Yugant Kanojiya IIT Mandi",
  },
  {
    src: "/images/IMG20250720173148 - DEEPESH TRIPATHI.jpg",
    alt: "DEEPESH TRIPATHI",
    title: "DEEPESH TRIPATHI",
  },
  {
    src: "/images/IMG-20250724-WA0026 - Anand Swaroop.jpg",
    alt: "Anand Swaroop",
    title: "Anand Swaroop",
  },
  {
    src: "/images/IMG_20250727_002637 - AADITYA ,.jpg",
    alt: "AADITYA",
    title: "AADITYA",
  },
  {
    src: "/images/IMG_20250728_161824 - Rudraksh Rajendra Lande.jpg",
    alt: "Rudraksh Rajendra Lande",
    title: "Rudraksh Rajendra Lande",
  },
  {
    src: "/images/IMG-20250728-WA0016~2 - Mannepalli Samhitha IIT Mandi.jpg",
    alt: "Mannepalli Samhitha IIT Mandi",
    title: "Mannepalli Samhitha IIT Mandi",
  },
  {
    src: "/images/IMG_20250811_175835 - ARPIT MISHRA.jpg",
    alt: "ARPIT MISHRA",
    title: "ARPIT MISHRA",
  },
  {
    src: "/images/IMG_20250811_231629_868~2 - ABHISHEK ,.jpg",
    alt: "ABHISHEK",
    title: "ABHISHEK",
  },
  {
    src: "/images/IMG-20250811-WA0013 - SAMRIDHI SINGH.jpg",
    alt: "SAMRIDHI SINGH",
    title: "SAMRIDHI SINGH",
  },
  {
    src: "/images/IMG-20250811-WA0110 - THOKAL VIDISHA ATMARAM.jpg",
    alt: "THOKAL VIDISHA ATMARAM",
    title: "THOKAL VIDISHA ATMARAM",
  },
  
  {
    src: "/images/IMG_3055 - SAANVI MENDIRATTA.jpeg",
    alt: "SAANVI MENDIRATTA",
    title: "SAANVI MENDIRATTA",
  },
  {
    src: "/images/IMG_3068(2) - Yash Sharma.heic",
    alt: "Yash Sharma",
    title: "Yash Sharma",
  },
  {
    src: "/images/IMG_5626 - UDITYA ,.jpeg",
    alt: "UDITYA",
    title: "UDITYA",
  },
  {
    src: "/images/My pic in suit - TANISHQ SRIVASTAVA.jpeg",
    alt: "TANISHQ SRIVASTAVA",
    title: "TANISHQ SRIVASTAVA",
  },
  
  {
    src: "/images/Screenshot_2025-08-12-21-51-53-69_965bbf4d18d205f782c6b8409c5773a4 - KRSNAPRIYA VATS.jpg",
    alt: "KRSNAPRIYA VATS",
    title: "KRSNAPRIYA VATS",
  },
  {
    src: "/images/Vani_B23505 - Vani Dhiman.jpg",
    alt: "Vani Dhiman",
    title: "Vani Dhiman",
  },
];



  const openLightbox = (index: number) => {
    setSelectedImage(index)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % galleryImages.length)
    }
  }

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? galleryImages.length - 1 : selectedImage - 1)
    }
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Organizing<span className="text-primary">Teams</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
           
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryImages.map((image, index) => (
            <Card
              key={index}
              className="overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              onClick={() => openLightbox(index)}
            >
              <div className="relative">
                <img
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                  <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                    <h3 className="font-semibold text-lg">{image.title}</h3>
                  </div>
                </div>
                <div className="absolute top-2 right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-sm font-bold">+</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage !== null && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full">
              <img
                src={galleryImages[selectedImage].src || "/placeholder.svg"}
                alt={galleryImages[selectedImage].alt}
                className="max-w-full max-h-full object-contain"
              />

              {/* Close button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 text-white hover:bg-white/20"
                onClick={closeLightbox}
              >
                <X className="w-6 h-6" />
              </Button>

              {/* Navigation buttons */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                onClick={prevImage}
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                onClick={nextImage}
              >
                <ChevronRight className="w-8 h-8" />
              </Button>

              {/* Image title */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
                <h3 className="text-xl font-semibold">{galleryImages[selectedImage].title}</h3>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
