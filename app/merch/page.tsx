// app/merchandise/page.tsx
'use client'; 

import { useState } from 'react';
import Image from 'next/image';
import { X, Eye, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { Navbar } from '@/components/navbar';

const merchData = [
  {
    id: 1,
    name: 'Fest Hoodie BACK',
    price: '₹899',
    imageUrl: '/merch/1.png',
    description: ''
  },
  {
    id: 2,
    name: 'Fest Hoodie FRONT',
    price: '₹899',
    imageUrl: '/merch/2.png',
    description: ''
  },
  {
    id: 3,
    name: 'Official T-Shirt BACK',
    price: '₹449',
    imageUrl: '/merch/3.png',
    description: ''
  },
  {
    id: 5,
    name: 'Official T-Shirt FRONT',
    price: '₹449',
    imageUrl: '/merch/5.png',
    description: ''
  },
];

type MerchItem = typeof merchData[0];

export default function EnhancedMerchandisePage() {
  const [selectedMerch, setSelectedMerch] = useState<MerchItem | null>(null);

  return (
    <>
      <Navbar/>
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

          {/* Merchandise Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {merchData.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedMerch(item)}
                className="group cursor-pointer"
              >
                <div className="relative rounded-lg overflow-hidden border-2 border-white/10 bg-gray-800/40 p-2 backdrop-blur-xl transition-all duration-300 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2">
                  <div className="relative w-full aspect-square overflow-hidden rounded-md">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Hover overlay */}
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

          {/* 🔥 Discounted Bundle Section */}
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
            {/* Contact Button */}
            <a
              href="tel:+919485999199"
              className="inline-flex items-center gap-2 bg-[#0b121f] text-white px-8 py-4 rounded-xl font-bold text-lg border border-white hover:bg-white hover:text-[#0b121f] transition-all duration-300 transform hover:scale-105"
            >
              <Phone className="w-5 h-5" /> 
              {/* Contact Us At<br /> */}
              +91 94859 99199
            </a>
          </div>
        </div>

        {/* --- The Animated Modal --- */}
        <AnimatePresence>
          {selectedMerch && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedMerch(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative bg-gray-900 border border-white/20 rounded-lg shadow-2xl w-11/12 max-w-6xl h-[90vh] flex flex-col items-center justify-center overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedMerch(null)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full text-gray-300 bg-gray-700/50 hover:bg-gray-700 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Full Image */}
                <div className="w-full h-full relative flex items-center justify-center">
                  <Image
                    src={selectedMerch.imageUrl}
                    alt={selectedMerch.name}
                    fill
                    className="object-contain p-6"
                  />
                </div>

                {/* Contact Button in Modal */}
                <div className="absolute bottom-6">
                  <a
                    href="tel:+919485999199"
                    className="inline-flex items-center gap-2 bg-[#0b121f] text-white px-8 py-3 rounded-xl font-bold text-lg border border-white hover:bg-white hover:text-[#0b121f] transition-all duration-300 transform hover:scale-105"
                  >
                    <Phone className="w-5 h-5" /> 
                    {/* Contact Us At<br /> */}
                    +91 94859 99199
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
