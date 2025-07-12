import type { ClothingItem, SwapRequest } from '../types/index';

export const mockClothingItems: ClothingItem[] = [
  {
    id: '1',
    title: 'Vintage Levi\'s Denim Jacket',
    description: 'Classic 90s Levi\'s denim jacket in excellent condition. Perfect for layering and sustainable fashion.',
    category: 'Outerwear',
    type: 'Jacket',
    size: 'M',
    condition: 'Good',
    tags: ['vintage', 'denim', 'classic', '90s'],
    images: [
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
      'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'
    ],
    uploaderId: '2',
    uploaderName: 'Sarah Johnson',
    pointValue: 150,
    isAvailable: true,
    createdAt: new Date('2024-11-15'),
    approvalStatus: 'approved'
  },
  {
    id: '2',
    title: 'Designer Black Wool Coat',
    description: 'Elegant black wool coat from a premium brand. Timeless design perfect for professional settings.',
    category: 'Outerwear',
    type: 'Coat',
    size: 'L',
    condition: 'Like New',
    tags: ['designer', 'wool', 'professional', 'winter'],
    images: [
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
      'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'
    ],
    uploaderId: '2',
    uploaderName: 'Sarah Johnson',
    pointValue: 300,
    isAvailable: true,
    createdAt: new Date('2024-11-20'),
    approvalStatus: 'approved'
  },
  {
    id: '3',
    title: 'Organic Cotton Summer Dress',
    description: 'Beautiful floral summer dress made from organic cotton. Comfortable and eco-friendly.',
    category: 'Dresses',
    type: 'Summer Dress',
    size: 'S',
    condition: 'Good',
    tags: ['organic', 'cotton', 'floral', 'summer'],
    images: [
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'
    ],
    uploaderId: '2',
    uploaderName: 'Sarah Johnson',
    pointValue: 120,
    isAvailable: true,
    createdAt: new Date('2024-11-25'),
    approvalStatus: 'approved'
  },
  {
    id: '4',
    title: 'Sustainable Bamboo T-Shirt',
    description: 'Ultra-soft bamboo fiber t-shirt. Naturally antibacterial and moisture-wicking.',
    category: 'Tops',
    type: 'T-Shirt',
    size: 'M',
    condition: 'Like New',
    tags: ['bamboo', 'sustainable', 'soft', 'eco-friendly'],
    images: [
      'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'
    ],
    uploaderId: '2',
    uploaderName: 'Sarah Johnson',
    pointValue: 80,
    isAvailable: true,
    createdAt: new Date('2024-12-01'),
    approvalStatus: 'approved'
  }
];

export const mockSwapRequests: SwapRequest[] = [
  {
    id: '1',
    requesterId: '2',
    requesterName: 'Sarah Johnson',
    itemId: '1',
    itemTitle: 'Vintage Levi\'s Denim Jacket',
    message: 'Hi! I\'d love to swap for this jacket. I have a similar vintage piece you might like.',
    status: 'pending',
    createdAt: new Date('2024-12-05')
  }
];

export const categories = [
  'Outerwear',
  'Tops',
  'Bottoms',
  'Dresses',
  'Shoes',
  'Accessories'
];

export const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const conditions = ['Like New', 'Good', 'Fair', 'Well-Worn'] as const;