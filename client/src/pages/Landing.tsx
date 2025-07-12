import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import HeroCarousel from '../components/HeroCarousel';
import CategoryGrid from '../components/CategoryGrid';
import ProductGrid from '../components/ProductGrid';
import axios from 'axios';

const Landing: React.FC = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/items/featured')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Failed to fetch featured items', err));
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <SearchBar />
      <HeroCarousel />
      <CategoryGrid />
      <ProductGrid products={products} />
    </div>
  );
};

export default Landing;
