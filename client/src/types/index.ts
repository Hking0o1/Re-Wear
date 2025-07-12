export interface User {
  id: string;
  email: string;
  name: string;
  points: number;
  avatar?: string;
  joinedDate: Date;
  isAdmin?: boolean;
}

export interface ClothingItem {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  size: string;
  condition: 'Like New' | 'Good' | 'Fair' | 'Well-Worn';
  tags: string[];
  images: string[];
  uploaderId: string;
  uploaderName: string;
  uploaderAvatar?: string;
  pointValue: number;
  isAvailable: boolean;
  createdAt: Date;
  approvalStatus: 'pending' | 'approved' | 'rejected';
}

export interface SwapRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  itemId: string;
  itemTitle: string;
  offeredItemId?: string;
  offeredItemTitle?: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
}