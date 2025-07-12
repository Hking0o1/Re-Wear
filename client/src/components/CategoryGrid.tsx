const categories = ['Men', 'Women', 'Kids', 'Winter', 'Summer', 'Ethnic'];

const CategoryGrid: React.FC = () => (
  <div className="px-6 mt-6">
    <h2 className="text-lg font-semibold mb-2">Categories</h2>
    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
      {categories.map(cat => (
        <div key={cat} className="bg-green-100 hover:bg-green-200 transition rounded-lg text-center py-6 font-medium shadow">
          {cat}
        </div>
      ))}
    </div>
  </div>
);

export default CategoryGrid;
