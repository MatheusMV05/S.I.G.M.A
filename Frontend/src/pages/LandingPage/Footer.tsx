import { motion } from 'framer-motion';
import { Facebook, Instagram, Linkedin, Twitter, Send } from 'lucide-react';
import { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar lógica de newsletter
    console.log('Newsletter:', email);
    setEmail('');
  };

  const quickLinks = [
    { name: 'Sobre', href: '#sobre' },
    { name: 'Funcionalidades', href: '#funcionalidades' },
    { name: 'Preços', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Contato', href: '#contato' }
  ];

  const solutions = [
    { name: 'Supermercados', href: '#' },
    { name: 'Mercearias', href: '#' },
    { name: 'Atacarejos', href: '#' },
    { name: 'Distribuidoras', href: '#' }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' }
  ];

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer id="contato" className="bg-black border-t border-[#1F1F23]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo e Descrição */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#D946EF] to-[#9333EA] 
                            rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(217,70,239,0.4)]">
                <span className="text-white font-bold text-xl">Σ</span>
              </div>
              <span className="text-2xl font-bold text-white">SIGMA</span>
            </div>
            <p className="text-sm text-[#A1A1AA] leading-relaxed mb-4">
              Sistema Integrado de Gerenciamento de Mercados e Atacados.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-[#0A0A0A] border border-[#1F1F23] 
                           rounded-lg flex items-center justify-center 
                           hover:border-[#D946EF]/30 hover:bg-[#D946EF]/10 
                           transition-all group"
                >
                  <social.icon className="w-5 h-5 text-[#A1A1AA] group-hover:text-[#D946EF] transition-colors" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="text-white font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <motion.button
                    onClick={() => scrollToSection(link.href)}
                    whileHover={{ x: 5 }}
                    className="text-[#A1A1AA] hover:text-[#D946EF] 
                             transition-colors text-sm text-left"
                  >
                    {link.name}
                  </motion.button>
                </li>
              ))}
            </ul>
          </div>

          {/* Soluções */}
          <div>
            <h4 className="text-white font-semibold mb-4">Soluções</h4>
            <ul className="space-y-2">
              {solutions.map((solution, index) => (
                <li key={index}>
                  <motion.a
                    href={solution.href}
                    whileHover={{ x: 5 }}
                    className="text-[#A1A1AA] hover:text-[#D946EF] 
                             transition-colors text-sm block"
                  >
                    {solution.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-[#A1A1AA] mb-4">
              Receba novidades sobre gestão e tecnologia
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                placeholder="Seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-2 bg-[#0A0A0A] border border-[#1F1F23] 
                         rounded-lg text-white text-sm placeholder-[#52525B]
                         focus:outline-none focus:border-[#D946EF] transition-all"
                required
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-[#D946EF] rounded-lg 
                         hover:bg-[#C026D3] transition-colors
                         shadow-[0_0_20px_rgba(217,70,239,0.3)]
                         hover:shadow-[0_0_30px_rgba(217,70,239,0.5)]"
              >
                <Send className="w-5 h-5 text-white" />
              </motion.button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#1F1F23]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#A1A1AA]">
              © 2025 SIGMA. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-[#A1A1AA] hover:text-[#D946EF] transition-colors">
                Privacidade
              </a>
              <a href="#" className="text-[#A1A1AA] hover:text-[#D946EF] transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="text-[#A1A1AA] hover:text-[#D946EF] transition-colors">
                LGPD
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
