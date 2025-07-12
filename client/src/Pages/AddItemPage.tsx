import React, { useState } from 'react';
import {  X, Plus, Camera } from 'lucide-react';
import { categories, sizes, conditions } from '../data/mockData';
import { useAuth } from '../hooks/useAuth';

interface AddItemPageProps {
  onPageChange: (page: string) => void;
}

const AddItemPage: React.FC<AddItemPageProps> = ({ onPageChange }) => {
  const { user, isLoggedIn } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: '',
    size: '',
    condition: 'Good' as const,
    tags: [] as string[],
    pointValue: 100
  });
  const [images, setImages] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoggedIn) {
    onPageChange('login');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArray = Array.from(files).slice(0, 5 - images.length);
    const newImages: string[] = [];
    for (const file of fileArray) {
      const url = URL.createObjectURL(file);
      newImages.push(url);
    }
    setImages(prev => [...prev, ...newImages].slice(0, 5));
  };


  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    alert('Item submitted for review! You\'ll be notified once it\'s approved.');
    onPageChange('dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">List a New Item</h1>
          <p className="text-gray-600">Share your unused clothing with the community and earn points</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className='flex'>
            {/* Image Upload */}
            <div className="bg-white rounded-lg shadow-sm border  border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Photos</h2>
              <p className="text-gray-600 mb-4">Add up to 5 photos. The first photo will be your main image.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-w-1 aspect-h-1">
                    <img
                      src={image}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 bg-emerald-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Main
                      </div>
                    )}
                  </div>
                ))}
                
                {images.length < 5 && (
                  <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors cursor-pointer h-32 flex flex-col items-center justify-center">
                    <Camera className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Add Photo</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="e.g., Vintage Levi's Denim Jacket"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <input
                    type="text"
                    id="type"
                    name="type"
                    required
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="e.g., Denim Jacket, T-Shirt, Sneakers"
                  />
                </div>

                <div>
                  <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
                    Size *
                  </label>
                  <select
                    id="size"
                    name="size"
                    required
                    value={formData.size}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Select a size</option>
                    {sizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
                    Condition *
                  </label>
                  <select
                    id="condition"
                    name="condition"
                    required
                    value={formData.condition}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    {conditions.map(condition => (
                      <option key={condition} value={condition}>{condition}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="pointValue" className="block text-sm font-medium text-gray-700 mb-2">
                    Suggested Point Value
                  </label>
                  <input
                    type="number"
                    id="pointValue"
                    name="pointValue"
                    min="10"
                    max="500"
                    value={formData.pointValue}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">Final value may be adjusted during review</p>
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  placeholder="Describe the item's condition, fit, style, and any other relevant details..."
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tags</h2>
            <p className="text-gray-600 mb-4">Add tags to help others find your item</p>
            
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Enter a tag (e.g., vintage, designer, casual)"
              />
              <button
                type="button"
                onClick={addTag}
                className="bg-emerald-600 text-white px-4 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1"
                >
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-emerald-600 hover:text-emerald-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Ready to submit?</h3>
                <p className="text-gray-600">Your item will be reviewed before going live</p>
              </div>
              <button
                type="submit"
                disabled={isSubmitting || images.length === 0}
                className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit for Review'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemPage;