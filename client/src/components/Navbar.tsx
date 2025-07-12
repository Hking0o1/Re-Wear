const Navbar: React.FC = () => (
  <nav className="w-full px-6 py-4 bg-green-700 text-white flex justify-between items-center shadow">
    <h1 className="text-xl font-bold">ReWear</h1>
    <div className="space-x-4">
      <button className="hover:underline">Browse</button>
      <button className="hover:underline">List Item</button>
      <button className="hover:underline">Login</button>
    </div>
  </nav>
);

export default Navbar;
