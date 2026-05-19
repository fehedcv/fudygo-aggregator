import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useLayoutEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import Navbar from './components/Navbar';
import WelcomeModal from './components/WelcomeModal';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import RestaurantDetails from './pages/RestaurantDetails';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import PhoneVerify from './pages/PhoneVerify';

// Store Lenis instance globally so ScrollToTop can access it
let lenisInstance = null;

// Scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (lenisInstance) {
      lenisInstance.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

function App() {
  const rafId = useRef(null);

  // useLayoutEffect runs BEFORE the browser paints
  // This ensures Lenis is ready before the user can scroll,
  // eliminating the first-scroll jank
  useLayoutEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 1.5,
      infinite: false,
      syncTouch: false,
      syncTouchLerp: 0.1,
    });

    lenisInstance = lenis;

    function raf(time) {
      lenis.raf(time);
      rafId.current = requestAnimationFrame(raf);
    }

    // Start RAF immediately
    rafId.current = requestAnimationFrame(raf);

    // Preload critical resources
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = 'https://images.unsplash.com';
        document.head.appendChild(link);
      });
    }

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <ScrollToTop />
      <WelcomeModal />
      <Navbar />
      <div className="pb-20 xl:pb-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/restaurant/:id" element={<RestaurantDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/verify-phone" element={<PhoneVerify />} />
          <Route path="/orders" element={<Orders />} /> 
        </Routes>
      </div>
    </div>
  );
}

export default App;