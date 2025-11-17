import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { text: 'Início', href: '#hero' },
    { text: 'Sobre', href: '#sobre' },
    { text: 'Funcionalidades', href: '#funcionalidades' },
    { text: 'Contato', href: '#contato' }
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Scroll Progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-[#D946EF] origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`
          fixed top-0 w-full z-40 transition-all duration-300
          ${scrolled 
            ? 'bg-black/95 backdrop-blur-xl border-b border-[#1F1F23] py-4' 
            : 'bg-transparent py-6'
          }
        `}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => scrollToSection('#hero')}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#D946EF] to-[#9333EA] 
                            rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(217,70,239,0.4)]">
                <span className="text-white font-bold text-xl">Σ</span>
              </div>
              <span className="text-2xl font-bold text-white">SIGMA</span>
            </motion.div>

            {/* Menu Desktop */}
            <div className="hidden lg:flex items-center gap-8">
              {menuItems.map((item, index) => (
                <motion.button
                  key={index}
                  onClick={() => scrollToSection(item.href)}
                  whileHover={{ y: -2 }}
                  className="text-[#A1A1AA] hover:text-white font-medium 
                           transition-colors relative group"
                >
                  {item.text}
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#D946EF] 
                             origin-left scale-x-0 group-hover:scale-x-100 transition-transform"
                  />
                </motion.button>
              ))}
            </div>

            {/* CTAs */}
            <div className="hidden lg:flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/login'}
                className="px-6 py-2 text-white border border-[#1F1F23] 
                         rounded-lg font-medium hover:border-[#D946EF]/30 
                         hover:bg-[#D946EF]/5 transition-all"
              >
                Login
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('#seja-sigma')}
                className="px-6 py-2 bg-[#D946EF] text-white rounded-lg 
                         font-medium shadow-[0_0_20px_rgba(217,70,239,0.3)]
                         hover:shadow-[0_0_30px_rgba(217,70,239,0.5)]
                         transition-all"
              >
                Demonstração
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-black/95 backdrop-blur-xl border-t 
                       border-[#1F1F23] overflow-hidden"
            >
              <div className="container mx-auto px-4 py-6 space-y-4">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => scrollToSection(item.href)}
                    className="block w-full text-left text-[#A1A1AA] hover:text-white 
                             font-medium py-2 px-4 rounded-lg hover:bg-white/5 
                             transition-all"
                  >
                    {item.text}
                  </motion.button>
                ))}
                
                <div className="pt-4 space-y-3">
                  <button
                    onClick={() => window.location.href = '/login'}
                    className="block w-full text-center px-6 py-3 text-white 
                             border border-[#1F1F23] rounded-lg font-medium 
                             hover:border-[#D946EF]/30 transition-all"
                  >
                    Login
                  </button>
                  
                  <button
                    onClick={() => scrollToSection('#seja-sigma')}
                    className="block w-full text-center px-6 py-3 bg-[#D946EF] 
                             text-white rounded-lg font-medium 
                             shadow-[0_0_20px_rgba(217,70,239,0.3)]"
                  >
                    Demonstração
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navbar;
