"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

export function ImageGallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)


  const galleryImages = [
  {
    src: "/pronites/image.png",
    alt: "Track and Field Competition",
    title: "Track & Field Events",
  },
  {
    src: "/pronites/image%20copy.png",
    alt: "Basketball Tournament",
    title: "Basketball Championship",
  },
  {
    src: "/pronites/image%20copy%202.png",
    alt: "Swimming Competition",
    title: "Aquatic Sports",
  },
  {
    src: "/pronites/image%20copy%203.png",
    alt: "Football Match",
    title: "Football Tournament",
  },
  {
    src: "/pronites/image%20copy%204.png",
    alt: "Cricket Championship",
    title: "Cricket Championship",
  },
  {
    src: "/pronites/image%20copy%205.png",
    alt: "Badminton Tournament",
    title: "Badminton Competition",
  },
  {
    src: "/pronites/image%20copy%206.png",
    alt: "Volleyball Match",
    title: "Volleyball Championship",
  },
  {
    src: "/pronites/image%20copy%207.png",
    alt: "Table Tennis",
    title: "Table Tennis Tournament",
  },
]


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
            La Memoir<span className="text-primary">2024</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Relive the epic moments from previous RANN-NEETI festivals. Witness the passion, dedication, and triumph of
            athletes who dared to compete with the gods.
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
                    {/* <h3 className="font-semibold text-lg">{image.title}</h3> */}
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
