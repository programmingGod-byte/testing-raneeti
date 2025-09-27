// app/merchandise/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/navbar';

const merchData = [
  {
    id: 1,
    name: 'Fest Hoodie',
    price: '₹899',
    imageUrls: ['/merch/2.png', '/merch/1.png'],
    description: 'Stay warm and stylish with our premium fest hoodie.'
  },
  {
    id: 2,
    name: 'Official T-Shirt',
    price: '₹449',
    imageUrls: ['/merch/5.png', '/merch/3.png'],
    description: 'The official tee of the fest, made with comfortable, breathable cotton.'
  },
];

type MerchProduct = {
  id: number;
  name: string;
  price: string;
  imageUrls: string[];
  description: string;
};

export default function EnhancedMerchandisePage() {
  const [selectedMerch, setSelectedMerch] = useState<MerchProduct | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleOpenModal = (item: MerchProduct) => {
    setSelectedMerch(item);
    setCurrentImageIndex(0);
  };

  const handleCloseModal = () => {
    setSelectedMerch(null);
  };

  const showNextImage = () => {
    if (selectedMerch) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedMerch.imageUrls.length);
    }
  };

  const showPrevImage = () => {
    if (selectedMerch) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedMerch.imageUrls.length) % selectedMerch.imageUrls.length);
    }
  };

  return (
    <>
      <Navbar />
      <section className="bg-gradient-to-b from-gray-900 to-black text-white min-h-screen py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-400">
              Official Fest Gear
            </h2>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              Own a piece of the experience. High-quality merch designed for the true enthusiast.
            </p>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              Get it NOW for an early-bird discounted price!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {merchData.map((item) => (
              <div
                key={item.id}
                onClick={() => handleOpenModal(item)}
                className="group cursor-pointer col-span-1 sm:col-span-1 lg:col-span-2"
              >
                <div className="relative rounded-lg overflow-hidden border-2 border-white/10 bg-gray-800/40 p-2 backdrop-blur-xl transition-all duration-300 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2">
                  <div className="relative w-full aspect-square overflow-hidden rounded-md">
                    <Image
                      src={item.imageUrls[0]}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex flex-col items-center text-white">
                        <Eye className="w-10 h-10 mb-2" />
                        <span className="font-semibold">Quick View</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 text-center">
                    <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                    <p className="text-primary font-bold mt-1 text-xl">{item.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center bg-[#0b121f] rounded-2xl p-10 shadow-lg border border-white">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Special Combo Offer
            </h3>
            <p className="text-lg text-gray-200 mb-6">
              Get both the <span className="font-semibold text-primary">Hoodie</span> and <span className="font-semibold text-orange-400">T-Shirt</span> together for just
            </p>
            <div className="text-4xl md:text-5xl font-extrabold text-green-400 mb-6">
              ₹1299
            </div>
            <a
              href="https://forms.gle/gxFSVBp2HahdKSkb6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#0b121f] text-white px-8 py-4 rounded-xl font-bold text-lg border border-white hover:bg-white hover:text-[#0b121f] transition-all duration-300 transform hover:scale-105"
            >
              Order Now
            </a>
          </div>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selectedMerch && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
              onClick={handleCloseModal}
            >
              <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative bg-gray-900 border border-white/20 rounded-lg shadow-2xl w-11/12 max-w-5xl max-h-[90vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Image container */}
                <div className="relative flex-grow flex items-center justify-center min-h-[500px]">
                  <Image
                    src={selectedMerch.imageUrls[currentImageIndex]}
                    alt={`${selectedMerch.name} - view ${currentImageIndex + 1}`}
                    fill
                    className="object-contain"
                  />

                  {/* Left/Right arrows */}
                  <button onClick={showPrevImage} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/40 rounded-full hover:bg-black/60">
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                  <button onClick={showNextImage} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/40 rounded-full hover:bg-black/60">
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>

                  {/* Dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {selectedMerch.imageUrls.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${currentImageIndex === index ? 'bg-white' : 'bg-white/50 hover:bg-white/75'}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Details section */}
                <div className="w-full text-center p-4 border-t border-white/20 flex-shrink-0">
                  <h3 className="text-xl font-bold text-white">{selectedMerch.name}</h3>
                  <p className="text-lg text-primary font-semibold mb-4">{selectedMerch.price}</p>
                  <a
                    href="https://forms.gle/gxFSVBp2HahdKSkb6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#0b121f] text-white px-8 py-3 rounded-xl font-bold text-lg border border-white hover:bg-white hover:text-[#0b121f] transition-all duration-300 transform hover:scale-105"
                  >
                    Order Now
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
}
