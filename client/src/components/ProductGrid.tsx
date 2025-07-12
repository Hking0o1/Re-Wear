import { motion } from 'framer-motion';

interface Product {
  id: number;
  title: string;
  description: string;
  images: string[];
  status: string;
}

interface Props {
  products: Product[];
  loading: boolean;
}

const ProductGrid: React.FC<Props> = ({ products, loading }) => {
  return (
    <div className="px-6 mt-10 mb-12">
      <h2 className="text-lg font-semibold mb-4">Product Listings</h2>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              className="border rounded-lg p-3 shadow bg-white hover:shadow-md"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <img
                src={product.images?.[0] || 'https://via.placeholder.com/150'}
                alt={product.title}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h3 className="font-bold">{product.title}</h3>
              <p className="text-sm text-gray-500">{product.description?.slice(0, 60)}...</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
