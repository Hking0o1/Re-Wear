import React from 'react';
import { Heart, Star, Clock } from 'lucide-react';
import type { ClothingItem } from '../../types/index';

interface ItemCardProps {
  item: ClothingItem;
  onItemClick: (item: ClothingItem) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onItemClick }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onItemClick(item)}
    >
      <div className="relative">
        <img
          src={item.images[0]}
          alt={item.title}
          className="w-full h-48 object-cover"
        />
        <button className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors">
          <Heart className="h-4 w-4 text-gray-600" />
        </button>
        <div className="absolute bottom-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.condition === 'Like New' ? 'bg-emerald-100 text-emerald-800' :
            item.condition === 'Good' ? 'bg-blue-100 text-blue-800' :
            item.condition === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {item.condition}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">{item.category} • {item.size}</span>
          <div className="flex items-center space-x-1 text-emerald-600">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-medium">{item.pointValue} pts</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src={item.uploaderAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.uploaderName)}&background=10b981&color=fff`}
              alt={item.uploaderName}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-gray-600">{item.uploaderName}</span>
          </div>
          
          <div className="flex items-center space-x-1 text-gray-500">
            <Clock className="h-3 w-3" />
            <span className="text-xs">
              {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-1">
          {item.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className="text-xs text-gray-500">+{item.tags.length - 3} more</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;