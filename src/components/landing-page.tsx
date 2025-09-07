'use client';

import type {getDictionary} from '@/lib/i18n/dictionaries';
import {useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {Logo} from '@/components/icons';
import Image from 'next/image';
import Link from 'next/link';

type Dictionary = Awaited<ReturnType<typeof getDictionary>>['dashboard'];

declare global {
  var feather: any;
}

export function LandingPage({dictionary}: {dictionary: Dictionary}) {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.feather) {
      window.feather.replace();
    }
  }, []);

  return (
    <div className="bg-[#F9F5F0] text-[#5D4037]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Logo className="h-10 mr-4 text-primary" />
            <span className="text-xl font-headline text-primary">
              KalpanaAI
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-[#5D4037] hover:text-[#8B4513] transition">
              Features
            </a>
            <a href="#demand" className="text-[#5D4037] hover:text-[#8B4513] transition">
              Demand
            </a>
            <a href="#muse" className="text-[#5D4037] hover:text-[#8B4513] transition">
              The Muse
            </a>
            <a href="#community" className="text-[#5D4037] hover:text-[#8B4513] transition">
              Community
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/en-US">
              <Button className="hidden md:block bg-primary text-primary-foreground hover:bg-primary/90 transition">
                Artisan Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden craft-pattern pt-16">
        <div className="absolute inset-0 bg-black/20 z-0"></div>
        <video
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="http://static.photos/artisan/1200x630/1" type="video/mp4" />
        </video>

        <div className="relative z-10 h-full flex flex-col justify-center px-8 pt-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl md:text-7xl font-headline font-bold text-primary mb-6 ink-text">
                  Your Hands Create Magic.
                  <br />
                  KalpanaAI Helps the World See It.
                </h1>
                <p className="text-xl md:text-2xl text-foreground mb-10 max-w-2xl">
                  One click: Upload your craft photo → AI writes its story,
                  finds buyers, and lists it everywhere. Zero tech skills
                  needed.
                </p>
                <div className="flex flex-col sm:flex-row justify-start gap-4">
                  <Link href="/en-US">
                    <Button
                      size="lg"
                      className="silk-gradient hover:bg-gradient-to-r hover:from-[#E6BE8A] hover:to-[#F5F5DC] text-[#5D4037] font-bold py-4 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 diya-glow"
                    >
                      <span className="mr-2">✨</span> Start Free (15 sec signup)
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-2xl shadow-2xl border-4 border-white">
                <div className="flex">
                  <div className="w-1/2 relative">
                    <Image
                      src="https://picsum.photos/600/600?random=10"
                      width={600}
                      height={600}
                      alt="Before AI Enhancement"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-center py-2 font-bold">
                      BEFORE
                    </div>
                  </div>
                  <div className="w-1/2 relative">
                    <Image
                      src="https://picsum.photos/600/600?random=11"
                      width={600}
                      height={600}
                      alt="After AI Enhancement"
                      className="w-full h-full object-cover border-l-4 border-accent"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-accent text-accent-foreground text-center py-2 font-bold">
                      AFTER AI
                    </div>
                  </div>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg">
                  <i data-feather="arrow-right" className="text-primary w-6 h-6"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
