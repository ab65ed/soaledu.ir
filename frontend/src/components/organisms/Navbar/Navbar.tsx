'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-lg shadow-convrt-purple/5'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center space-x-2 space-x-reverse"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-convrt-purple to-convrt-purple-light flex items-center justify-center text-white font-bold text-lg">
              س
            </div>
            <span className="text-2xl font-bold text-convrt-dark-blue">سوال جو</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 space-x-reverse">
            <motion.a
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              href="#"
              className="text-convrt-dark-blue hover:text-convrt-purple transition-colors font-medium"
            >
              خانه
            </motion.a>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="relative group"
            >
              <button className="flex items-center text-convrt-dark-blue hover:text-convrt-purple transition-colors font-medium">
                امکانات
                <ChevronDown className="w-4 h-4 mr-1 group-hover:rotate-180 transition-transform" />
              </button>
            </motion.div>
            <motion.a
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              href="#"
              className="text-convrt-dark-blue hover:text-convrt-purple transition-colors font-medium"
            >
              قیمت‌گذاری
            </motion.a>
            <motion.a
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              href="#"
              className="text-convrt-dark-blue hover:text-convrt-purple transition-colors font-medium"
            >
              درباره ما
            </motion.a>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-convrt-dark-blue hover:text-convrt-purple transition-colors font-medium"
            >
              ورود
            </motion.button>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="button-primary"
            >
              شروع رایگان
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-convrt-dark-blue hover:text-convrt-purple transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4"
          >
            <div className="flex flex-col space-y-4">
              <a href="#" className="text-convrt-dark-blue hover:text-convrt-purple transition-colors font-medium py-2">
                خانه
              </a>
              <a href="#" className="text-convrt-dark-blue hover:text-convrt-purple transition-colors font-medium py-2">
                امکانات
              </a>
              <a href="#" className="text-convrt-dark-blue hover:text-convrt-purple transition-colors font-medium py-2">
                قیمت‌گذاری
              </a>
              <a href="#" className="text-convrt-dark-blue hover:text-convrt-purple transition-colors font-medium py-2">
                درباره ما
              </a>
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                <button className="text-convrt-dark-blue hover:text-convrt-purple transition-colors font-medium py-2 text-right">
                  ورود
                </button>
                <button className="button-primary text-center">
                  شروع رایگان
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar; 