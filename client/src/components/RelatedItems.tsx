import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

interface Props {
  category: string;
  currentId: number;
}

interface Item {
  id: number;
  title: string;
  images?: string[];
  // add other fields as needed
}

const RelatedItems: React.FC<Props> = ({ category, currentId }) => {
  const [items, setItems] = useState<Item[]>([]);
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.4 },
    }),
    };
  useEffect(() => {
    axios.get(`http://localhost:5000/api/items/category/${category}`)
      .then(res => {
        const filtered = res.data.filter((item: Item) => item.id !== currentId);
        setItems(filtered);
      });
  }, [category, currentId]);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Related Items</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item: any, i) => (
            <motion.div
                key={item.id}
                custom={i}
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                className="border p-3 rounded shadow bg-white"
            >
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

                <p className="font-medium">{item.title}</p>
            </motion.div>
        ))}

      </div>
    </div>
  );
};

export default RelatedItems;
