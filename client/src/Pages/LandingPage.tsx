import React from 'react';
import { ArrowRight, Recycle, Users, ShoppingBag, Plus, Search } from 'lucide-react';
import ItemCard from '../components/ClothingItem/ItemCard';
import { mockClothingItems, categories } from '../data/mockData';
import type { ClothingItem } from '../types/index';

interface LandingPageProps {
  onPageChange: (page: string) => void;
  onItemClick: (item: ClothingItem) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onPageChange, onItemClick }) => {
  const featuredItems = mockClothingItems.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Sustainable Fashion
                <span className="block text-emerald-200">Starts Here</span>
              </h1>
              <p className="text-xl text-emerald-100 mb-8">
                Join our community of eco-conscious fashion lovers. Exchange, swap, and reduce textile waste while discovering unique clothing pieces.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
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
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg"
                alt="Sustainable Fashion"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How ReWear Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple, sustainable, and rewarding
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">List Your Items</h3>
              <p className="text-gray-600">
                Upload photos and details of clothing you no longer wear. Earn points for approved listings.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Connect & Swap</h3>
              <p className="text-gray-600">
                Browse items from other users and propose swaps or use your points to claim items directly.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Recycle className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Reduce Waste</h3>
              <p className="text-gray-600">
                Give clothes a second life and reduce textile waste while refreshing your wardrobe sustainably.
              </p>
            </div>
          </div>
        </div>
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