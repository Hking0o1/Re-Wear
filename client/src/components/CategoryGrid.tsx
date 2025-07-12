import { motion } from 'framer-motion';

const categories = ['Men', 'Women', 'Kids', 'Winter', 'Summer', 'Ethnic'];

const CategoryGrid: React.FC = () => (
  <div className="px-6 mt-6">
    <h2 className="text-lg font-semibold mb-2">Categories</h2>
    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
      {categories.map((cat, i) => (
        <motion.div
          key={cat}
          className="bg-green-100 hover:bg-green-200 transition rounded-lg text-center py-6 font-medium shadow cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          {cat}
        </motion.div>
      ))}
    </div>
  </div>
);

export default CategoryGrid;
