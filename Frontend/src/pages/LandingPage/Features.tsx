import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, Package, TrendingUp, BarChart3, 
  Check, ArrowRight, Users, UserCheck, Truck, 
  Receipt, Shield, Smartphone
} from 'lucide-react';
import DashboardPreview from './DashboardPreview';

const Features = () => {
  const [activeTab, setActiveTab] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const modules = [
    {
      id: 0,
      name: 'PDV',
      icon: ShoppingCart,
      title: 'Ponto de Venda Inteligente',
      description: 'Sistema de caixa ultra-rápido e intuitivo. Interface otimizada para alta performance, reduzindo filas e aumentando a satisfação do cliente.',
      features: [
        'Interface touch-screen responsiva',
        'Busca instantânea de produtos',
        'Múltiplas formas de pagamento',
        'Identificação automática de clientes',
        'Integração com balanças e scanners',
        'Impressão automática de cupons fiscais'
      ],
      color: '#D946EF',
      stats: {
        label: 'Transações/min',
        value: '120+'
      }
    },
    {
      id: 1,
      name: 'Estoque',
      icon: Package,
      title: 'Gestão Total de Estoque',
      description: 'Controle preciso em tempo real. Alertas inteligentes, rastreamento por lote, controle de validade e integração automática com fornecedores.',
      features: [
        'Controle de entrada e saída automatizado',
        'Alertas de estoque mínimo e máximo',
        'Rastreamento por lote e validade',
        'Inventário simplificado',
        'Integração com XML de fornecedores',
        'Relatórios de giro de estoque'
      ],
      color: '#10B981',
      stats: {
        label: 'Produtos rastreados',
        value: '50K+'
      }
    },
    {
      id: 2,
      name: 'Financeiro',
      icon: TrendingUp,
      title: 'Controle Financeiro Completo',
      description: 'Visão 360° das suas finanças. Contas a pagar/receber, fluxo de caixa, conciliação bancária e relatórios gerenciais em tempo real.',
      features: [
        'Contas a pagar e receber',
        'Fluxo de caixa projetado',
        'Conciliação bancária automática',
        'Controle de inadimplência',
        'Relatórios DRE e balanço',
        'Integração contábil'
      ],
      color: '#9333EA',
      stats: {
        label: 'Precisão financeira',
        value: '99.9%'
      }
    },
    {
      id: 3,
      name: 'Analytics',
      icon: BarChart3,
      title: 'Inteligência e Relatórios',
      description: 'Transforme dados em decisões. Dashboards customizáveis, análise preditiva, curva ABC e insights acionáveis para crescer seu negócio.',
      features: [
        'Dashboards em tempo real',
        'Análise de vendas e margem',
        'Curva ABC de produtos',
        'Previsão de demanda (IA)',
        'Relatórios fiscais automáticos',
        'Exportação para Excel/PDF'
      ],
      color: '#F59E0B',
      stats: {
        label: 'Relatórios disponíveis',
        value: '50+'
      }
    }
  ];

  const additionalFeatures = [
    { icon: Users, label: 'Clientes' },
    { icon: UserCheck, label: 'Funcionários' },
    { icon: Truck, label: 'Fornecedores' },
    { icon: Receipt, label: 'Fiscal' },
    { icon: Shield, label: 'Segurança' },
    { icon: Smartphone, label: 'Mobile' }
  ];

  return (
    <section id="funcionalidades" ref={ref} className="py-32 bg-[#050505] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b 
                    from-black to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-2 bg-[#D946EF]/10 border 
                        border-[#D946EF]/20 rounded-full mb-6">
            <span className="text-sm text-[#D946EF] font-medium uppercase tracking-wider">
              Funcionalidades
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Tudo que Você{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r 
                         from-[#D946EF] to-[#9333EA]">
              Precisa
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-[#A1A1AA] max-w-3xl mx-auto">
            Módulos integrados que trabalham juntos para otimizar cada aspecto 
            do seu negócio
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-16 overflow-x-auto pb-4"
        >
          <div className="inline-flex bg-[#0A0A0A] border border-[#1F1F23] 
                        rounded-2xl p-2 gap-2">
            {modules.map((module) => (
              <motion.button
                key={module.id}
                onClick={() => setActiveTab(module.id)}
                className={`
                  relative px-4 sm:px-6 py-3 rounded-xl font-medium transition-all 
                  duration-300 whitespace-nowrap flex items-center gap-2
                  ${activeTab === module.id 
                    ? 'text-white' 
                    : 'text-[#A1A1AA] hover:text-white'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Background animado do tab ativo */}
                {activeTab === module.id && (
                  <motion.div
                    layoutId="activeTabBg"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: `linear-gradient(135deg, ${module.color}40 0%, ${module.color}20 100%)`,
                      border: `1px solid ${module.color}60` 
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                <span className="relative z-10 flex items-center gap-2">
                  <module.icon 
                    className="w-5 h-5" 
                    style={{ color: activeTab === module.id ? module.color : 'inherit' }}
                  />
                  <span className="hidden sm:inline">{module.name}</span>
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            {/* Screenshot */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative order-2 lg:order-1"
            >
              <div className="relative rounded-2xl overflow-hidden border 
                            border-[#1F1F23] shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                {/* Glow effect */}
                <div 
                  className="absolute inset-0 blur-[60px] opacity-30"
                  style={{ backgroundColor: modules[activeTab].color }}
                />
                
                {/* Dashboard Preview */}
                <div className="relative z-10 aspect-video">
                  <DashboardPreview 
                    variant={
                      activeTab === 0 ? 'pdv' : 
                      activeTab === 1 ? 'estoque' : 
                      activeTab === 2 ? 'financeiro' : 
                      'analytics'
                    } 
                  />
                </div>
              </div>
            </motion.div>

            {/* Conteúdo */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="order-1 lg:order-2"
            >
              {/* Badge */}
              <div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                style={{ 
                  backgroundColor: `${modules[activeTab].color}15`,
                  border: `1px solid ${modules[activeTab].color}30` 
                }}
              >
                {(() => {
                  const IconComponent = modules[activeTab].icon;
                  return <IconComponent className="w-4 h-4" style={{ color: modules[activeTab].color }} />;
                })()}
                <span 
                  className="text-sm font-medium"
                  style={{ color: modules[activeTab].color }}
                >
                  Módulo Principal
                </span>
              </div>

              {/* Título */}
              <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {modules[activeTab].title}
              </h3>

              {/* Descrição */}
              <p className="text-base sm:text-lg text-[#A1A1AA] mb-8 leading-relaxed">
                {modules[activeTab].description}
              </p>

              {/* Lista de features */}
              <ul className="space-y-4 mb-8">
                {modules[activeTab].features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (index * 0.1) }}
                    className="flex items-center gap-3 text-[#A1A1AA]"
                  >
                    <div 
                      className="flex-shrink-0 w-6 h-6 rounded-full 
                               flex items-center justify-center"
                      style={{ backgroundColor: `${modules[activeTab].color}20` }}
                    >
                      <Check 
                        className="w-4 h-4" 
                        style={{ color: modules[activeTab].color }}
                      />
                    </div>
                    <span className="text-sm sm:text-base">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl 
                         font-medium transition-all duration-300"
                style={{
                  backgroundColor: `${modules[activeTab].color}20`,
                  border: `1px solid ${modules[activeTab].color}40`,
                  color: modules[activeTab].color
                }}
              >
                <span>Explorar {modules[activeTab].name}</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Funcionalidades Secundárias */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-32"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">
            E Muito Mais...
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {additionalFeatures.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.7 + (index * 0.05) }}
                whileHover={{ 
                  y: -5,
                  boxShadow: '0 0 20px rgba(217, 70, 239, 0.2)'
                }}
                className="bg-[#0A0A0A] border border-[#1F1F23] rounded-xl 
                         p-6 text-center hover:border-[#D946EF]/30 
                         transition-all duration-300 group"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-lg 
                              bg-[#D946EF]/10 flex items-center justify-center
                              group-hover:bg-[#D946EF]/20 transition-colors">
                  <item.icon className="w-6 h-6 text-[#D946EF]" />
                </div>
                <p className="text-sm font-medium text-[#A1A1AA] 
                            group-hover:text-white transition-colors">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
