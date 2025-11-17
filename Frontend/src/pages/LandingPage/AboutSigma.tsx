import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Network, Brain, Zap, Package, Shield, Headphones,
  Users, ShoppingCart, Activity, Clock, ArrowRight
} from 'lucide-react';

const AboutSigma = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const benefits = [
    {
      icon: Network,
      title: 'Sistema 100% Integrado',
      description: 'Todos os módulos conectados. Dados sincronizados em tempo real entre estoque, vendas e financeiro.',
      color: '#D946EF'
    },
    {
      icon: Brain,
      title: 'Inteligência de Dados',
      description: 'Dashboards avançados e relatórios preditivos para decisões estratégicas baseadas em dados reais.',
      color: '#9333EA'
    },
    {
      icon: Zap,
      title: 'Performance Extrema',
      description: 'PDV ultra-rápido desenvolvido para alta demanda. Redução de filas e aumento da produtividade.',
      color: '#10B981'
    },
    {
      icon: Package,
      title: 'Controle Total de Estoque',
      description: 'Rastreamento completo com alertas inteligentes, controle de validade e integração com fornecedores.',
      color: '#F59E0B'
    },
    {
      icon: Shield,
      title: 'Segurança Avançada',
      description: 'Criptografia de ponta, backups automáticos e conformidade total com LGPD.',
      color: '#EF4444'
    },
    {
      icon: Headphones,
      title: 'Suporte Especializado',
      description: 'Equipe técnica disponível 24/7 para garantir que sua operação nunca pare.',
      color: '#D946EF'
    }
  ];

  const stats = [
    { value: '500+', label: 'Clientes Ativos', icon: Users, color: '#D946EF' },
    { value: '10M+', label: 'Transações/Mês', icon: ShoppingCart, color: '#10B981' },
    { value: '99.9%', label: 'Uptime Garantido', icon: Activity, color: '#9333EA' },
    { value: '24/7', label: 'Suporte', icon: Clock, color: '#F59E0B' }
  ];

  return (
    <section id="sobre" ref={ref} className="py-32 bg-black relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="h-full w-full bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Título da Seção */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-2 bg-[#D946EF]/10 border border-[#D946EF]/20 
                     rounded-full mb-6"
          >
            <span className="text-sm text-[#D946EF] font-medium uppercase tracking-wider">
              Por que SIGMA?
            </span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            A Solução <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D946EF] to-[#9333EA]">Completa</span>
            <br />para Seu Negócio
          </h2>

          <p className="text-lg sm:text-xl text-[#A1A1AA] max-w-3xl mx-auto">
            Mais de 500 empresas confiam no SIGMA para gerenciar suas operações 
            com eficiência, segurança e inteligência
          </p>
        </motion.div>

        {/* Grid de Cards */}
        <motion.div
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.12
              }
            }
          }}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="group relative bg-[#0A0A0A] border border-[#1F1F23] 
                       rounded-2xl p-8 hover:border-[#2D2D33]
                       hover:shadow-[0_0_30px_rgba(217,70,239,0.1)]
                       transition-all duration-300"
            >
              {/* Glow no hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br 
                            from-[#D946EF]/5 to-transparent opacity-0 
                            group-hover:opacity-100 transition-opacity duration-300" />

              {/* Conteúdo */}
              <div className="relative z-10">
                {/* Ícone */}
                <motion.div
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-14 h-14 rounded-xl mb-6 flex items-center justify-center"
                  style={{ 
                    backgroundColor: `${benefit.color}15`,
                    border: `1px solid ${benefit.color}30` 
                  }}
                >
                  <benefit.icon 
                    className="w-7 h-7" 
                    style={{ color: benefit.color }}
                  />
                </motion.div>

                {/* Título */}
                <h3 className="text-xl font-semibold text-white mb-3 
                             group-hover:text-[#D946EF] transition-colors">
                  {benefit.title}
                </h3>

                {/* Descrição */}
                <p className="text-[#A1A1AA] leading-relaxed mb-4">
                  {benefit.description}
                </p>

                {/* Link hover */}
                <motion.div
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-2 text-[#D946EF] 
                           font-medium text-sm opacity-0 group-hover:opacity-100 
                           transition-opacity"
                >
                  Saiba mais
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.9 + (index * 0.1) }}
              className="text-center bg-[#0A0A0A] border border-[#1F1F23] 
                       rounded-2xl p-6 hover:border-[#D946EF]/30 
                       transition-all duration-300 group"
            >
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                     style={{ backgroundColor: `${stat.color}15` }}>
                  <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
              </div>
              
              <motion.div
                className="text-3xl sm:text-4xl font-bold text-white mb-2"
                animate={{
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.2
                }}
              >
                {stat.value}
              </motion.div>
              
              <p className="text-[#A1A1AA] text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSigma;
