/**
 * Navbar.tsx
 * Top navigation bar component.
 * Features: Logo, Category Links, Dark Mode Toggle, Subscribe Button, Mobile Menu.
 */
import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Menu, X, Globe, Moon, Sun } from 'lucide-react';

const Navbar = () => {
  // State for mobile menu and dark mode
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Navigation hooks
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get('category');
  const navigate = useNavigate();

  // Toggle Dark Mode (updates HTML class)
  const toggleDark = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  // Available News Categories
  const categories = [
    { name: 'India', id: 'India' },
    { name: 'World', id: 'World' },
    { name: 'Tech', id: 'Technology' },
    { name: 'Sports', id: 'Sports' },
    { name: 'Business', id: 'Business' },
    { name: 'Education', id: 'Education' },
    { name: 'Environment', id: 'Environment' },
    { name: 'Originals', id: 'Originals' }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl border-b border-gray-200/50 dark:border-gray-800/50 transition-all duration-300 supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">

          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-black dark:bg-white text-white dark:text-black p-2.5 rounded-none transform group-hover:-rotate-3 transition-transform duration-300">
              <Globe size={28} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-2xl font-black font-serif tracking-tighter text-gray-900 dark:text-white leading-none">
                GATH<span className="text-brand-600">ERED</span>
              </span>
              <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 dark:text-gray-500 pl-0.5">
                Global Aggregator
              </span>
            </div>
          </Link>

          {/* Desktop Categories */}
          <div className="hidden md:flex items-center space-x-1">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/?category=${cat.id}`}
                className={`px-4 py-2 rounded-full text-sm font-bold tracking-wide transition-all duration-200 ${currentCategory === cat.id
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg transform scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
              >
                {cat.name.toUpperCase()}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-4 pl-4">
            <button onClick={toggleDark} className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
              {isDark ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-gray-600" />}
            </button>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2"></div>
            <button
              onClick={() => navigate('/subscribe')}
              className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-4 py-2.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Subscribe
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-4">
            <button onClick={toggleDark} className="p-2">
              {isDark ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-gray-600" />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-900 dark:text-white p-2">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 animate-slide-down shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <div className="pb-4 mb-4 border-b border-gray-100 dark:border-gray-800">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Categories</p>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/?category=${cat.id}`}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-lg font-serif font-medium ${currentCategory === cat.id
                    ? 'bg-gray-100 dark:bg-gray-800 text-brand-600 dark:text-brand-400'
                    : 'text-gray-700 dark:text-gray-200'
                    }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/subscribe');
              }}
              className="w-full text-center py-3 bg-brand-600 text-white font-bold rounded-xl"
            >
              Subscribe for Updates
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;