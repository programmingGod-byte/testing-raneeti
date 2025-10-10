'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface Sponsor {
  name: string;
  logo: string;
  url?: string;
}

const sponsors: Sponsor[] = [
  { name: '', logo: '/spon/1.png' },
  { name: '', logo: '/spon/2.png' },
  { name: '', logo: '/spon/3.png' },
  { name: '', logo: '/spon/4.png' },
  { name: '', logo: '/spon/5.png' },
  { name: '', logo: '/spon/6.png' },
  { name: '', logo: '/spon/7.png' },
  { name: '', logo: '/spon/8.png' },
  { name: '', logo: '/spon/9.png' },
  { name: '', logo: '/spon/10.png' },
  { name: '', logo: '/spon/11.png' },
];

export default function OurSponsors() {
  return (
    <section className="min-h-screen  py-20">
      <div className="container mx-auto px-6 text-center">
        {/* Heading */}
        <motion.h1
          className="text-4xl font-bold text-[#641d1f] mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Our Sponsors
        </motion.h1>

        <motion.p
          className="text-gray-600 max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          We’re proud to be supported by our amazing sponsors who make everything we do possible.
        </motion.p>

        {/* Sponsor Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10 justify-center items-center"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {sponsors.map((sponsor, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center text-center p-4 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Image
                src={sponsor.logo}
                alt={sponsor.name}
                width={150}
                height={80}
                className="object-contain mb-4"
              />
              <p className="text-sm font-semibold text-[#641d1f]">{sponsor.name}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
