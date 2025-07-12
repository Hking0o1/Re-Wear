import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import LandingPage from './Pages/LandingPage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import DashboardPage from './Pages/DashboardPage';
import BrowsePage from './Pages/BrowsePage';
import ItemDetailPage from './Pages/ItemDetailPage';
import AddItemPage from './Pages/AddItemPage';
import AdminPage from './Pages/AdminPage';
import type { ClothingItem } from './types';

type Page = 'home' | 'login' | 'register' | 'dashboard' | 'browse' | 'item-detail' | 'add-item' | 'admin';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);

  const handlePageChange = (page: string) => {
    setCurrentPage(page as Page);
  };

  const handleItemClick = (item: ClothingItem) => {
    setSelectedItem(item);
    setCurrentPage('item-detail');
  };

  const handleBackFromItem = () => {
    setCurrentPage('browse');
    setSelectedItem(null);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Header currentPage={currentPage} onPageChange={handlePageChange} />
        
        <main>
          {currentPage === 'home' && (
            <LandingPage onPageChange={handlePageChange} onItemClick={handleItemClick} />
          )}
          {currentPage === 'login' && (
            <LoginPage onPageChange={handlePageChange} />
          )}
          {currentPage === 'register' && (
            <RegisterPage onPageChange={handlePageChange} />
          )}
          {currentPage === 'dashboard' && (
            <DashboardPage onPageChange={handlePageChange} onItemClick={handleItemClick} />
          )}
          {currentPage === 'browse' && (
            <BrowsePage onItemClick={handleItemClick} />
          )}
          {currentPage === 'item-detail' && selectedItem && (
            <ItemDetailPage 
              item={selectedItem} 
              onBack={handleBackFromItem}
              onPageChange={handlePageChange}
            />
          )}
          {currentPage === 'add-item' && (
            <AddItemPage onPageChange={handlePageChange} />
          )}
          {currentPage === 'admin' && (
            <AdminPage onPageChange={handlePageChange} />
          )}
        </main>
        
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;