import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RestaurantDetails from './pages/RestaurantDetails';
import Cart from './pages/Cart';
import Profile from './pages/Profile'; // Import Profile

function App() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurant/:id" element={<RestaurantDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} /> {/* Add Route */}
      </Routes>
    </div>
  );
}

export default App;