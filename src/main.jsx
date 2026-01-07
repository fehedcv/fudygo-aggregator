import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { RestaurantProvider } from './context/RestaurantContext'; // Import this

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <LocationProvider>
        <RestaurantProvider> {/* Add Wrapper Here */}
          <CartProvider>
            <HashRouter>
              <App />
            </HashRouter>
          </CartProvider>
        </RestaurantProvider>
      </LocationProvider>
    </AuthProvider>
  </React.StrictMode>,
)