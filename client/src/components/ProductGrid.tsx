interface Product {
  id: number;
  title: string;
  description: string;
  images: string[];
  status: string;
}

interface Props {
  products: Product[];
}

const ProductGrid: React.FC<Props> = ({ products }) => (
  <div className="px-6 mt-10 mb-12">
    <h2 className="text-lg font-semibold mb-4">Product Listings</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {products.map(product => (
        <div key={product.id} className="border rounded-lg p-3 shadow hover:scale-105 transition">
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/150'}
            alt={product.title}
            className="w-full h-40 object-cover rounded mb-2"
          />
          <h3 className="font-bold">{product.title}</h3>
          <p className="text-sm text-gray-500">{product.description?.slice(0, 60)}...</p>
        </div>
      ))}
    </div>
  </div>
);

export default ProductGrid;
