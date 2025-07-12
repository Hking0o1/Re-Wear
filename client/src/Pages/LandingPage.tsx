import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Recycle, Users, ShoppingBag, Plus, Search } from 'lucide-react';
import ItemCard from '../components/ClothingItem/ItemCard';
import { mockClothingItems, categories } from '../data/mockData';
import type { ClothingItem } from '../types/index';

interface LandingPageProps {
  onPageChange: (page: string) => void;
  onItemClick: (item: ClothingItem) => void;
}

const heroImages = [
  'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
  'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
  'https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg',
  'https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg',
];

const HeroCarousel: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const length = heroImages.length;

  const nextSlide = () => setCurrent((prev) => (prev + 1) % length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + length) % length);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % length);
    }, 3000);
    return () => timeoutRef.current && clearTimeout(timeoutRef.current);
  }, [current, length]);

  return (
    <div className="relative w-full h-72 md:h-96 rounded-lg overflow-hidden mb-8 shadow-2xl">
      {heroImages.map((img, idx) => (
        <img
          key={img}
          src={img}
          alt={`Hero Slide ${idx + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          style={{ pointerEvents: idx === current ? 'auto' : 'none' }}
        />
      ))}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-emerald-700/70 hover:bg-emerald-800/80 text-white rounded-full p-2 z-20"
        aria-label="Previous Slide"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-emerald-700/70 hover:bg-emerald-800/80 text-white rounded-full p-2 z-20"
        aria-label="Next Slide"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {heroImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full border border-white ${idx === current ? 'bg-white' : 'bg-emerald-700/60'}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ onPageChange, onItemClick }) => {
  const featuredItems = mockClothingItems.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-br from-emerald-600 to-emerald-800 text-white">
        {/* Carousel as background */}
        <HeroCarousel />
        {/* Overlay for text/buttons */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 py-20 z-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            Sustainable Fashion
            <span className="block text-emerald-200">Starts Here</span>
          </h1>
          <p className="text-xl text-emerald-100 mb-8 drop-shadow-lg">
            Join our community of eco-conscious fashion lovers. Exchange, swap, and reduce textile waste while discovering unique clothing pieces.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onPageChange('register')}
              className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              Start Swapping
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button
              onClick={() => onPageChange('browse')}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-emerald-600 transition-colors flex items-center justify-center"
            >
              <Search className="mr-2 h-5 w-5" />
              Browse Items
            </button>
          </div>
        </div>
        {/* Optional: dark overlay for readability */}
        <div className="absolute inset-0 bg-emerald-900/60 z-10" />
      </section>

      
      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600">Find exactly what you're looking for</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <button
                key={category}
                onClick={() => onPageChange('browse')}
                className="bg-gray-50 hover:bg-emerald-50 hover:border-emerald-200 border border-gray-200 rounded-lg p-6 text-center transition-colors group"
              >
                <div className="text-2xl mb-2">
                  {['👔', '👕', '👖', '👗', '👠', '👜'][index]}
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-600">
                  {category}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Items</h2>
            <p className="text-gray-600">Discover unique pieces from our community</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                onItemClick={onItemClick}
              />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button
              onClick={() => onPageChange('browse')}
              className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              View All Items
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">2,847</div>
              <div className="text-emerald-200">Items Exchanged</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1,256</div>
              <div className="text-emerald-200">Active Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.2 tons</div>
              <div className="text-emerald-200">Textile Waste Prevented</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Sustainable Fashion Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of users who are already making a difference, one swap at a time.
          </p>
          <button
            onClick={() => onPageChange('register')}
            className="bg-emerald-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-emerald-700 transition-colors inline-flex items-center"
          >
            <ShoppingBag className="mr-2 h-6 w-6" />
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;