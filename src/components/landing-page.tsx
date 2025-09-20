
'use client';

import type {getDictionary} from '@/lib/i18n/dictionaries';
import {useEffect} from 'react';
import {Button} from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, BookOpen, Lightbulb, TrendingUp, Camera, Users, Award } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from 'next/navigation';


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
  
  const pathname = usePathname();
  const lang = pathname.split('/')[1] || 'en-US';

  return (
    <div className="bg-background text-foreground">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-xl font-headline text-primary">
              KalpanaAI
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-foreground hover:text-primary transition">
              Features
            </a>
            <a href="#demand" className="text-foreground hover:text-primary transition">
              Demand
            </a>
            <a href="#muse" className="text-foreground hover:text-primary transition">
              The Muse
            </a>
            <a href="#community" className="text-foreground hover:text-primary transition">
              Community
            </a>
             <a href="#mentor" className="text-foreground hover:text-primary transition">
              Mentor
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <Link href={`/${lang}/login`}>
              <Button className="hidden md:block bg-primary text-primary-foreground hover:bg-primary/90 transition">
                Artisan Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <video
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="http://static.photos/artisan/1200x630/1" type="video/mp4" />
        </video>

        <div className="relative z-20 w-full">
          <div className="max-w-6xl mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl md:text-7xl font-headline font-bold text-white mb-6 ink-text">
                  Your Hands Create Magic.
                  <br />
                  KalpanaAI Helps the World See It.
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl">
                  One click: Upload your craft photo → AI writes its story,
                  finds buyers, and lists it everywhere. Zero tech skills
                  needed.
                </p>
                <div className="flex flex-col sm:flex-row justify-start gap-4">
                  <Link href="/en-US/dashboard">
                    <Button
                      size="lg"
                      className="silk-gradient hover:bg-gradient-to-r hover:from-[#E6BE8A] hover:to-[#F5F5DC] text-foreground font-bold py-4 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 diya-glow"
                    >
                      <span className="mr-2">✨</span> Start Free (15 sec signup)
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1-Click Magic Section */}
      <section id="features" className="py-20 px-8 bg-secondary/50">
        <div className="absolute inset-0 craft-pattern"></div>
          <div className="max-w-6xl mx-auto relative">
              <h2 className="text-4xl font-headline text-center text-primary mb-16 ink-text">
                  The 1-Click Magic
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                  <div className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:scale-105 transform group">
                      <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-4 transition-all duration-300 group-hover:shadow-[0_0_15px_hsl(var(--accent))]">
                          <i data-feather="upload" className="text-accent w-8 h-8"></i>
                      </div>
                      <h3 className="text-xl font-bold mb-2">Upload Photo</h3>
                      <p className="text-muted-foreground">Simply take a picture of your craft with your phone</p>
                  </div>
                  <div className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:scale-105 transform group">
                      <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-4 transition-all duration-300 group-hover:shadow-[0_0_15px_hsl(var(--accent))]">
                          <i data-feather="zap" className="text-accent w-8 h-8"></i>
                      </div>
                      <h3 className="text-xl font-bold mb-2">AI Enhances + Generates Story</h3>
                      <p className="text-muted-foreground">Our AI writes the perfect story about your craft's heritage</p>
                  </div>
                  <div className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:scale-105 transform group">
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 transition-all duration-300 group-hover:shadow-[0_0_15px_hsl(var(--primary))]">
                          <i data-feather="share-2" className="text-primary w-8 h-8"></i>
                      </div>
                      <h3 className="text-xl font-bold mb-2">Auto-Lists on Marketplaces</h3>
                      <p className="text-muted-foreground">Instantly appears on Amazon, Myntra, Instagram and more</p>
                  </div>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
                <div className="text-center">
                  <h3 className="text-2xl font-headline text-primary mb-4">Before</h3>
                  <div className="relative rounded-2xl shadow-2xl border-4 border-primary/50 overflow-hidden">
                    <Image
                      src="https://picsum.photos/seed/before/600/900"
                      width={600}
                      height={900}
                      alt="Before AI Enhancement"
                      className="w-full h-full object-cover"
                      data-ai-hint="raw craft photo"
                    />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-headline text-accent mb-4 ">After AI</h3>
                  <div className="relative rounded-2xl shadow-2xl border-4 border-accent overflow-hidden">
                    <Image
                      src="https://picsum.photos/seed/after/600/900"
                      width={600}
                      height={900}
                      alt="After AI Enhancement"
                      className="w-full h-full object-cover"
                      data-ai-hint="enhanced craft photo"
                    />
                  </div>
                </div>
              </div>
          </div>
      </section>

      {/* Hyperlocal Demand Section */}
      <section id="demand" className="py-20 px-8 bg-primary/90 text-primary-foreground">
        <div className="absolute inset-0 craft-pattern rotate-180"></div>
          <div className="max-w-6xl mx-auto relative">
              <h2 className="text-4xl font-headline text-center mb-16 ink-text">
                  Hyperlocal Demand Spikes
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
                  <div className="lg:col-span-2">
                      <div className="relative rounded-2xl shadow-2xl border-4 border-primary-foreground/20 overflow-hidden">
                          <Image src="https://picsum.photos/seed/map/800/600" alt="India Demand Map" width={800} height={600} className="w-full" data-ai-hint="map india" />
                      </div>
                  </div>
                  <div className="lg:col-span-3 flex h-full">
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 flex flex-col justify-center h-full">
                          <div className="flex items-center gap-2 mb-4">
                              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                              <span className="font-bold uppercase tracking-wider">Urgent Opportunity</span>
                          </div>
                          <h3 className="text-2xl font-bold mb-4">Diwali in Jaipur (Oct 31)</h3>
                          <ul className="space-y-3 mb-6">
                              <li className="flex items-start gap-2">
                                  <i data-feather="trending-up" className="text-accent"></i>
                                  <span>3.2x demand for brass diyas</span>
                              </li>
                              <li className="flex items-start gap-2">
                                  <i data-feather="map-pin" className="text-accent"></i>
                                  <span>Top buyers: Delhi, Mumbai, USA</span>
                              </li>
                              <li className="flex items-start gap-2">
                                  <i data-feather="clock" className="text-accent"></i>
                                  <span>Start making NOW → KalpanaAI will list by Oct 25</span>
                              </li>
                          </ul>
                          <Button className="silk-gradient hover:bg-gradient-to-r hover:from-[#E6BE8A] hover:to-[#F5F5DC] text-foreground font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300">
                              Start Crafting
                          </Button>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* The Muse Section */}
      <section id="muse" className="py-20 px-8 bg-secondary/50">
        <div className="absolute inset-0 craft-pattern"></div>
          <div className="max-w-6xl mx-auto relative">
              <h2 className="text-4xl font-headline text-center text-primary mb-16 ink-text">
                  The Muse - Your Generative Craft Co-Pilot
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="relative max-w-xs mx-auto">
                      <div className="relative rounded-2xl shadow-lg border-4 border-primary overflow-hidden">
                        <Image src="https://picsum.photos/seed/muse/400/400" alt="Original Craft" width={400} height={400} className="w-full" data-ai-hint="original craft" />
                      </div>
                      <div className="absolute -bottom-4 -right-4 bg-accent text-accent-foreground font-bold py-2 px-4 rounded-full shadow-md">
                          Your Original
                      </div>
                  </div>
                  <div className="space-y-4">
                      <h3 className="text-xl font-bold">Stuck for ideas? The Muse generates new designs from your work.</h3>
                      <div className="grid grid-cols-2 gap-4">
                          <div className="relative group rounded-lg shadow-md group-hover:shadow-xl transition-all border-2 border-primary/50 overflow-hidden">
                            <Image src="https://picsum.photos/seed/variant1/400/400" alt="Variant 1" width={400} height={400} className="w-full" data-ai-hint="craft design" />
                          </div>
                          <div className="relative group rounded-lg shadow-md group-hover:shadow-xl transition-all border-2 border-primary/50 overflow-hidden">
                            <Image src="https://picsum.photos/seed/variant2/400/400" alt="Variant 2" width={400} height={400} className="w-full" data-ai-hint="craft detail" />
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-20 px-8 bg-background">
          <div className="max-w-6xl mx-auto relative">
              <h2 className="text-4xl font-headline text-center text-primary mb-4 ink-text">
                  Join a Thriving Community
              </h2>
              <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
                  You are not alone. Connect with fellow artisans and expert mentors. KalpanaAI will even suggest pairing you with artisans of different crafts to create unique bundles and increase your sales.
              </p>
              
              <div className="flex flex-wrap justify-center gap-8">
                  <div className="text-center">
                      <Avatar className="h-24 w-24 mb-2 border-4 border-accent shadow-lg">
                          <AvatarImage src="https://picsum.photos/100/100?random=1" data-ai-hint="woman portrait" />
                          <AvatarFallback>MP</AvatarFallback>
                      </Avatar>
                      <p className="font-semibold">Meera P.</p>
                      <p className="text-sm text-muted-foreground">Textile Expert</p>
                  </div>
                  <div className="text-center">
                      <Avatar className="h-24 w-24 mb-2 border-4 border-accent shadow-lg">
                          <AvatarImage src="https://picsum.photos/100/100?random=2" data-ai-hint="man portrait" />
                          <AvatarFallback>RK</AvatarFallback>
                      </Avatar>
                      <p className="font-semibold">Rajesh K.</p>
                      <p className="text-sm text-muted-foreground">Metalwork Master</p>
                  </div>
                   <div className="text-center">
                      <Avatar className="h-24 w-24 mb-2 border-4 border-accent shadow-lg">
                          <AvatarImage src="https://picsum.photos/100/100?random=3" data-ai-hint="woman smiling" />
                          <AvatarFallback>AS</AvatarFallback>
                      </Avatar>
                      <p className="font-semibold">Anjali S.</p>
                      <p className="text-sm text-muted-foreground">Pottery Guru</p>
                  </div>
                   <div className="text-center">
                      <Avatar className="h-24 w-24 mb-2 border-4 border-accent shadow-lg">
                          <AvatarImage src="https://picsum.photos/100/100?random=8" data-ai-hint="man smiling" />
                          <AvatarFallback>SV</AvatarFallback>
                      </Avatar>
                      <p className="font-semibold">Sanjay V.</p>
                      <p className="text-sm text-muted-foreground">Woodcarver</p>
                  </div>
                   <div className="text-center">
                      <Avatar className="h-24 w-24 mb-2 border-4 border-accent shadow-lg">
                          <AvatarImage src="https://picsum.photos/100/100?random=9" data-ai-hint="woman glasses" />
                          <AvatarFallback>PD</AvatarFallback>
                      </Avatar>
                      <p className="font-semibold">Priya D.</p>
                      <p className="text-sm text-muted-foreground">Jewelry Designer</p>
                  </div>
              </div>
          </div>
      </section>

      {/* Artisan Mentor Section */}
      <section id="mentor" className="py-20 px-8 bg-secondary/50">
        <div className="absolute inset-0 craft-pattern"></div>
          <div className="max-w-6xl mx-auto relative">
              <h2 className="text-4xl font-headline text-center text-primary mb-16 ink-text">
                  Learn from the Best with Artisan Mentor
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:scale-105 transform group text-center">
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 transition-all duration-300 group-hover:shadow-[0_0_15px_hsl(var(--primary))] mx-auto">
                          <Camera className="text-primary w-8 h-8"/>
                      </div>
                      <h3 className="text-xl font-bold mb-2">Product Photography</h3>
                      <p className="text-muted-foreground">Take photos that sell</p>
                  </div>
                  <div className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:scale-105 transform group text-center">
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 transition-all duration-300 group-hover:shadow-[0_0_15px_hsl(var(--primary))] mx-auto">
                          <BookOpen className="text-primary w-8 h-8"/>
                      </div>
                      <h3 className="text-xl font-bold mb-2">Storytelling</h3>
                      <p className="text-muted-foreground">Connect with customers</p>
                  </div>
                   <div className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:scale-105 transform group text-center">
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 transition-all duration-300 group-hover:shadow-[0_0_15px_hsl(var(--primary))] mx-auto">
                          <TrendingUp className="text-primary w-8 h-8"/>
                      </div>
                      <h3 className="text-xl font-bold mb-2">Market Trends</h3>
                      <p className="text-muted-foreground">Know what's in demand</p>
                  </div>
                   <div className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:scale-105 transform group text-center">
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 transition-all duration-300 group-hover:shadow-[0_0_15px_hsl(var(--primary))] mx-auto">
                          <Award className="text-primary w-8 h-8"/>
                      </div>
                      <h3 className="text-xl font-bold mb-2">Digital Skills</h3>
                      <p className="text-muted-foreground">Master online selling</p>
                  </div>
              </div>
          </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary/90 text-primary-foreground/80 py-12 px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <span className="text-lg font-headline text-primary-foreground">KalpanaAI</span>
            </div>
            <p className="max-w-md">
              Your humble sevak in the digital marketplace. Empowering Indian artisans with AI since 2023.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-primary-foreground mb-4">Community</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">YouTube</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-primary-foreground mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"><Facebook /></a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"><Instagram /></a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"><Twitter /></a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"><Youtube /></a>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-primary-foreground/20 text-center text-xs">
          <p>© 2024 KalpanaAI. All rights reserved. Powered by Google Cloud AI.</p>
        </div>
      </footer>
    </div>
  );
}
