import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ImageUploader from '../components/ImageUploader';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
const conditions = ['New', 'Like New', 'Good', 'Worn'];
const categories = ['Men', 'Women', 'Kids', 'Winter', 'Summer', 'Ethnic'];



const ListItem: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login'); // redirect to login page
    }
  }, [isAuthenticated, navigate]);

  

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    type: '',
    size: '',
    condition: '',
    tags: '',
    images: [] as string[],
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = (urls: string[]) => {
    setForm(prev => ({ ...prev, images: urls }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/items', {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()),
      });
      setSuccess(true);
    } catch (err) {
      console.error('Error uploading item:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <motion.h1
        className="text-2xl font-bold mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        List a New Item
      </motion.h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <ImageUploader onUpload={handleImageUpload} />

        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          required
          className="w-full border p-2 rounded"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          rows={3}
          className="w-full border p-2 rounded"
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          aria-label="Category"
        >
          <option value="">Select Category</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <input
          type="text"
          name="type"
          value={form.type}
          onChange={handleChange}
          placeholder="Type (e.g., Shirt, Pants)"
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="size"
          value={form.size}
          onChange={handleChange}
          placeholder="Size (e.g., M, L)"
          className="w-full border p-2 rounded"
        />

        <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
          Condition
        </label>
        <select
          id="condition"
          name="condition"
          value={form.condition}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          aria-label="Condition"
        >
          <option value="">Condition</option>
          {conditions.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <input
          type="text"
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="Tags (comma separated)"
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? 'Uploading...' : 'Submit Item'}
        </button>

        {success && <p className="text-green-600 mt-2">Item submitted for review!</p>}
      </form>
    </div>
  );
};

export default ListItem;
