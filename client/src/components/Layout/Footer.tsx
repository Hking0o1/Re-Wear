import React from 'react';
import { ShoppingBag, Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <ShoppingBag className="h-8 w-8 text-emerald-400" />
              <span className="text-xl font-bold">ReWear</span>
            </div>
            <p className="text-gray-300 mb-4">
              Join the sustainable fashion revolution. Exchange, swap, and reduce textile waste while discovering unique clothing pieces.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors" />
              <Mail className="h-5 w-5 text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Browse Items</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">List an Item</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">How It Works</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Sustainability</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Safety Guidelines</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 ReWear. All rights reserved. Made with 💚 for sustainable fashion.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;