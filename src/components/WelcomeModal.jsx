import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const WelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, loginWithGoogle } = useAuth();

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    
    if (!hasSeenWelcome && !currentUser) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [currentUser]);

  const handleSkip = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setIsOpen(false);
  };

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      localStorage.setItem('hasSeenWelcome', 'true');
      setIsOpen(false);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-sm w-full p-6 relative">
        <button onClick={handleSkip} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-2">Welcome to FudyGo</h2>
        <p className="text-sm text-gray-600 mb-6">Sign in for a better experience</p>

        <button
          onClick={handleLogin}
          className="w-full bg-white border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:border-gray-300 transition-all flex items-center justify-center gap-2 mb-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>
        
        <button onClick={handleSkip} className="w-full text-gray-500 text-sm py-2 hover:text-gray-700">
          Continue without signing in
        </button>
      </div>
    </div>
  );
};

export default WelcomeModal;
