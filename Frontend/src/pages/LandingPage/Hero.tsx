import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, BarChart3, Headphones, ChevronDown } from 'lucide-react';
import DashboardPreview from './DashboardPreview';

const Hero = () => {
  const features = [
    { icon: Zap, text: 'PDV Ultra-Rápido' },
    { icon: Shield, text: '100% Seguro' },
    { icon: BarChart3, text: 'Relatórios em Tempo Real' },
    { icon: Headphones, text: 'Suporte 24/7' }
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen bg-black overflow-hidden flex items-center">
      {/* Grid Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="h-full w-full bg-[linear-gradient(#D946EF_1px,transparent_1px),linear-gradient(90deg,#D946EF_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>
      
      {/* Purple Glow Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] 
                   bg-[#D946EF] rounded-full blur-[150px] opacity-30"
      />
      
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        className="absolute bottom-1/4 -right-1/4 w-[700px] h-[700px] 
                   bg-[#9333EA] rounded-full blur-[150px] opacity-20"
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
          {/* Conteúdo Esquerdo */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 
                         bg-[#D946EF]/10 border border-[#D946EF]/20 
                         rounded-full mb-8"
            >
              <div className="w-2 h-2 bg-[#D946EF] rounded-full animate-pulse" />
              <span className="text-sm text-[#D946EF] font-medium">
                Sistema Integrado de Gestão
              </span>
            </motion.div>

            {/* Título Principal */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Transforme Seu
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D946EF] to-[#9333EA]">
                Negócio
              </span>{' '}
              com SIGMA
            </motion.h1>

            {/* Subtítulo */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl text-[#A1A1AA] mb-8 max-w-xl"
            >
              Sistema completo para supermercados, mercados e atacarejos. 
              Gestão inteligente de estoque, vendas, financeiro e muito mais.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollToSection('#seja-sigma')}
                className="group px-8 py-4 bg-[#D946EF] text-white rounded-xl 
                           font-semibold shadow-[0_0_30px_rgba(217,70,239,0.4)]
                           hover:shadow-[0_0_50px_rgba(217,70,239,0.6)]
                           transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>Solicitar Demonstração</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = '/login'}
                className="px-8 py-4 bg-transparent border-2 border-[#D946EF] 
                           text-[#D946EF] rounded-xl font-semibold
                           hover:bg-[#D946EF]/10 transition-all duration-300"
              >
                Já é cliente? Faça login
              </motion.button>
            </motion.div>

            {/* Features Rápidas */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {features.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + (index * 0.1) }}
                  className="flex items-center gap-3 text-[#A1A1AA]"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#D946EF]/10 
                                flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-[#D946EF]" />
                  </div>
                  <span className="text-sm font-medium">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Screenshot do Sistema (Direita) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            {/* Glow Effect */}
            <motion.div
              animate={{
                opacity: [0.2, 0.4, 0.2],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 bg-[#D946EF] blur-[100px] opacity-30"
            />

            {/* Screenshot/Mockup */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              <div className="relative rounded-2xl overflow-hidden border border-[#1F1F23] 
                            shadow-[0_0_50px_rgba(217,70,239,0.3)] bg-[#0A0A0A]">
                {/* Dashboard Preview */}
                <div className="aspect-video w-full">
                  <DashboardPreview variant="hero" />
                </div>
              </div>
            </motion.div>

            {/* Elementos decorativos */}
            <motion.div
              animate={{
                rotate: [0, 360],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-20 -right-20 w-40 h-40 border-2 
                       border-[#D946EF]/20 rounded-full"
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.button
          onClick={() => scrollToSection('#sobre')}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-[#A1A1AA] hover:text-white transition-colors"
        >
          <span className="text-xs uppercase tracking-wider">Role para baixo</span>
          <ChevronDown className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </section>
  );
};

export default Hero;
