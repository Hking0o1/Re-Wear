import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import RelatedItems from '../components/RelatedItems';
import { motion } from 'framer-motion';

interface Item {
  id: number;
  title: string;
  description: string;
  category: string;
  type: string;
  size: string;
  condition: string;
  images: string[];
  tags: string[];
  status: string;
  uploader: {
    name: string;
    email: string;
  };
}



const ItemDetail: React.FC = () => {
  const { id } = useParams();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  axios.get(`http://localhost:5000/api/items/${id}`)
    .then(res => setItem(res.data))
    .catch(err => {
      console.error('API failed, using mock item', err);
      setItem({
        id: 1,
        title: 'Mock Winter Jacket',
        description: 'A cozy and warm winter jacket in excellent condition.',
        category: 'Winter',
        type: 'Jacket',
        size: 'M',
        condition: 'Like New',
        images: ['https://via.placeholder.com/400'],
        tags: ['jacket', 'winter', 'warm'],
        status: 'Available',
        uploader: {
          name: 'Test User',
          email: 'test@example.com'
        }
      });
    })
    .finally(()=> setLoading(false));
    }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!item) return <div className="p-6 text-red-600">Item not found.</div>;

  return (
    <div>
      <Navbar />
      <SearchBar />

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Image */}
        <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            <img
                src={item.images?.[0] || 'https://via.placeholder.com/400'}
                className="rounded-xl shadow w-full h-auto object-cover"
                alt={item.title}
            />
        </motion.div>

        {/* Right: Info */}
        <div className="space-y-4">
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
        >
            <h1 className="text-2xl font-bold">{item.title}</h1>
            <p className="text-gray-600 whitespace-pre-line">{item.description}</p>
            
        </motion.div>


          <div className="text-sm mt-2 space-y-1">
            <p><strong>Category:</strong> {item.category}</p>
            <p><strong>Type:</strong> {item.type}</p>
            <p><strong>Size:</strong> {item.size}</p>
            <p><strong>Condition:</strong> {item.condition}</p>
            <p><strong>Status:</strong> {item.status}</p>
            <p><strong>Uploaded By:</strong> {item.uploader?.name}</p>
          </div>

          <div className="flex gap-4 mt-4">
            <motion.button
                whileHover={{ scale: 1.05 }}
                className="bg-green-600 text-white px-4 py-2 rounded"
            >
                Swap Request
            </motion.button>
            <motion.button
                whileHover={{ scale: 1.05 }}
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                Redeem via Points
            </motion.button>
        </div>

        </div>
      </div>

      <RelatedItems category={item.category} currentId={item.id} />
    </div>
  );
};

export default ItemDetail;
