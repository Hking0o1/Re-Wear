import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import HeroCarousel from '../components/HeroCarousel';
import CategoryGrid from '../components/CategoryGrid';
import ProductGrid from '../components/ProductGrid';
import axios from 'axios';

const Landing: React.FC = () => {
  type Product = {
    id: number;
    title: string;
    description: string;
    images: string[];
    status: string;
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // <-- use boolean directly

  useEffect(() => {
  axios.get('http://localhost:5000/api/items/featured')
    .then(res => setProducts(res.data))
    .catch(err => {
      console.error('API failed, using mock data', err);
      setProducts([
        {
          id: 1,
          title: 'Vintage Denim Jacket',
          description: 'Classic denim with retro vibes',
          images: ['https://unsplash.com/photos/man-in-blue-denim-jacket-and-black-fitted-cap-sN9BqTtWJIE'],
          status: 'Available'
        },
        {
          id: 2,
          title: 'Ethnic Kurta',
          description: 'Perfect for traditional wear.',
          images: ['https://unsplash.com/photos/a-man-standing-next-to-a-tree-wearing-a-green-shirt-hEuVOYuq1l4'],
          status: 'Available'
        }
      ]);
    })
    .finally(() => setLoading(false));
}, []);


  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <SearchBar />
      <HeroCarousel />
      <CategoryGrid />
      <ProductGrid products={products} loading={loading} />
    </div>
  );
};

export default Landing;
