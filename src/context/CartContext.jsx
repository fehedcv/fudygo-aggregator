import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Initialize state from LocalStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('fudygo_cart');
    return savedCart 
      ? JSON.parse(savedCart) 
      : { restaurantId: null, restaurantName: null, items: [] };
  });

  const [deliveryAddress, setDeliveryAddress] = useState({
    id: 1,
    label: 'Home',
    address: '6 Lewis St, Aberdare, CF44 6PY',
    icon: 'home'
  });

  useEffect(() => {
    localStorage.setItem('fudygo_cart', JSON.stringify(cart));
  }, [cart]);

  // --- ACTIONS ---

  const addToCart = (item, restaurantId, restaurantName) => {
    if (cart.restaurantId && cart.restaurantId !== restaurantId) {
      const confirmSwitch = window.confirm(
        `Start a new basket? You have items from ${cart.restaurantName}. Adding this will clear your current basket.`
      );
      if (!confirmSwitch) return;
      
      setCart({
        restaurantId,
        restaurantName,
        items: [{ ...item, quantity: 1 }]
      });
      return;
    }

    setCart((prev) => {
      const existingItem = prev.items.find((i) => i.name === item.name); // Using name as ID for now, ideally use item.id
      let newItems;
      if (existingItem) {
        newItems = prev.items.map((i) =>
          i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        newItems = [...prev.items, { ...item, quantity: 1 }];
      }

      return { restaurantId, restaurantName, items: newItems };
    });
  };

  const removeFromCart = (itemName) => {
    setCart((prev) => {
      const newItems = prev.items.filter((i) => i.name !== itemName);
      return {
        ...prev,
        restaurantId: newItems.length === 0 ? null : prev.restaurantId,
        restaurantName: newItems.length === 0 ? null : prev.restaurantName,
        items: newItems
      };
    });
  };

  const updateQuantity = (itemName, delta) => {
    setCart((prev) => {
      const newItems = prev.items.map((item) => {
        if (item.name === itemName) {
          return { ...item, quantity: Math.max(0, item.quantity + delta) };
        }
        return item;
      }).filter(item => item.quantity > 0);

      return {
        ...prev,
        restaurantId: newItems.length === 0 ? null : prev.restaurantId,
        restaurantName: newItems.length === 0 ? null : prev.restaurantName,
        items: newItems
      };
    });
  };

  // NEW: Clear Cart Function
  const clearCart = () => {
    const emptyState = { restaurantId: null, restaurantName: null, items: [] };
    setCart(emptyState);
    localStorage.removeItem('fudygo_cart');
  };

  const getCartTotal = () => {
    return cart.items.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0).toFixed(2);
  };

  const getCartCount = () => {
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, // Export this
      getCartTotal, 
      getCartCount,
      deliveryAddress,
      setDeliveryAddress 
    }}>
      {children}
    </CartContext.Provider>
  );
};