import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import ItemDetail from './pages/ItemDetail';
import PrivateRoute from './components/PrivateRoute';
import ListItem from './pages/ListItem';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/list-item"
          element={
            <PrivateRoute>
              <ListItem />
            </PrivateRoute>
          }
        />
        <Route path="/item/:id" element={<ItemDetail />} />
      </Routes>
    </Router>
  );
}

export default App;