import React, { useState } from 'react';
import { ArrowLeft, Heart, Star,  Clock, User, MessageCircle, Package } from 'lucide-react';
import  type { ClothingItem } from '../types';
import  { useAuth } from '../hooks/useAuth';

interface ItemDetailPageProps {
  item: ClothingItem;
  onBack: () => void;
  onPageChange: (page: string) => void;
}

const ItemDetailPage: React.FC<ItemDetailPageProps> = ({ item, onBack, onPageChange }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapMessage, setSwapMessage] = useState('');
  const { user, isLoggedIn } = useAuth();

  const handleSwapRequest = () => {
    if (!isLoggedIn) {
      onPageChange('login');
      return;
    }
    setShowSwapModal(true);
  };

  const handlePointsRedeem = () => {
    if (!isLoggedIn) {
      onPageChange('login');
      return;
    }
    // Handle points redemption logic
    alert('Points redemption functionality would be implemented here');
  };

  const handleSendSwapRequest = () => {
    // Handle swap request logic
    alert('Swap request sent!');
    setShowSwapModal(false);
    setSwapMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to listings</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={item.images[selectedImage]}
                alt={item.title}
                className="w-full h-96 object-cover"
              />
            </div>
            {item.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {item.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-w-1 aspect-h-1 bg-gray-200 rounded-md overflow-hidden ${
                      selectedImage === index ? 'ring-2 ring-emerald-500' : ''
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${item.title} ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <Heart className="h-6 w-6 text-gray-600" />
                </button>
              </div>
              
              <div className="flex items-center space-x-4 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.condition === 'Like New' ? 'bg-emerald-100 text-emerald-800' :
                  item.condition === 'Good' ? 'bg-blue-100 text-blue-800' :
                  item.condition === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {item.condition}
                </span>
                <span className="text-gray-600">{item.category}</span>
                <span className="text-gray-600">Size {item.size}</span>
              </div>

              <div className="flex items-center space-x-2 mb-6">
                <Star className="h-5 w-5 text-emerald-600 fill-current" />
                <span className="text-xl font-semibold text-emerald-600">{item.pointValue} points</span>
              </div>
            </div>

            {/* Uploader Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src={item.uploaderAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.uploaderName)}&background=10b981&color=fff`}
                  alt={item.uploaderName}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{item.uploaderName}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Listed {new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>View profile</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleSwapRequest}
                className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Package className="h-5 w-5" />
                <span>Request Swap</span>
              </button>
              
              <button
                onClick={handlePointsRedeem}
                disabled={!user || user.points < item.pointValue}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Star className="h-5 w-5" />
                <span>
                  Redeem with Points
                  {user && user.points < item.pointValue && 
                    ` (Need ${item.pointValue - user.points} more points)`
                  }
                </span>
              </button>
              
              <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>Message Owner</span>
              </button>
            </div>

            {/* Availability Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${item.isAvailable ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className="text-sm font-medium">
                {item.isAvailable ? 'Available for swap' : 'Currently unavailable'}
              </span>
            </div>
          </div>
        </div>

        {/* Description and Tags */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
          <p className="text-gray-700 mb-6">{item.description}</p>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Similar Items */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Similar Items</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Placeholder for similar items */}
            <div className="text-center text-gray-500 py-8 col-span-full">
              Similar items would be displayed here based on category and tags
            </div>
          </div>
        </div>
      </div>

      {/* Swap Request Modal */}
      {showSwapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Swap</h3>
            <p className="text-gray-600 mb-4">
              Send a message to {item.uploaderName} about swapping for "{item.title}"
            </p>
            <textarea
              value={swapMessage}
              onChange={(e) => setSwapMessage(e.target.value)}
              placeholder="Hi! I'm interested in swapping for this item. I have..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none h-32 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <div className="flex space-x-3 mt-4">
              <button
                onClick={handleSendSwapRequest}
                className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                Send Request
              </button>
              <button
                onClick={() => setShowSwapModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetailPage;