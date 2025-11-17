import { motion } from 'framer-motion';
import { TrendingUp, Package, DollarSign, Users, ArrowUp, ArrowDown } from 'lucide-react';

interface DashboardPreviewProps {
  variant?: 'hero' | 'pdv' | 'estoque' | 'financeiro' | 'analytics';
}

const DashboardPreview = ({ variant = 'hero' }: DashboardPreviewProps) => {
  const getContent = () => {
    switch (variant) {
      case 'pdv':
        return (
          <div className="w-full h-full bg-gradient-to-br from-[#0A0A0A] to-[#1A0A1A] p-6">
            {/* Header PDV */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#D946EF]/20 rounded-lg flex items-center justify-center">
                  <span className="text-[#D946EF] font-bold">PDV</span>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Caixa 01</p>
                  <p className="text-[#71717A] text-xs">Operador: Admin</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[#71717A] text-xs">Venda Atual</p>
                <p className="text-white text-lg font-bold">R$ 234,50</p>
              </div>
            </div>

            {/* Lista de produtos */}
            <div className="space-y-2 mb-4">
              {[
                { name: 'Arroz Tio João 5kg', qty: 2, price: 'R$ 45,90' },
                { name: 'Feijão Preto 1kg', qty: 3, price: 'R$ 23,70' },
                { name: 'Óleo de Soja 900ml', qty: 1, price: 'R$ 8,90' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[#0A0A0A] border border-[#1F1F23] rounded-lg p-3"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="text-white text-xs font-medium">{item.name}</p>
                      <p className="text-[#71717A] text-xs">Qtd: {item.qty}</p>
                    </div>
                    <p className="text-[#D946EF] text-sm font-bold">{item.price}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Botões de ação */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#D946EF]/10 border border-[#D946EF]/30 rounded-lg p-2 text-center">
                <p className="text-[#D946EF] text-xs font-semibold">F1 - Finalizar</p>
              </div>
              <div className="bg-[#71717A]/10 border border-[#71717A]/30 rounded-lg p-2 text-center">
                <p className="text-[#71717A] text-xs font-semibold">F2 - Cancelar</p>
              </div>
            </div>
          </div>
        );

      case 'estoque':
        return (
          <div className="w-full h-full bg-gradient-to-br from-[#0A0A0A] to-[#1A0A1A] p-6">
            {/* Header Estoque */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#10B981]/20 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-[#10B981]" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Controle de Estoque</p>
                  <p className="text-[#71717A] text-xs">Atualizado agora</p>
                </div>
              </div>
            </div>

            {/* Cards de estoque */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-[#0A0A0A] border border-[#1F1F23] rounded-lg p-3">
                <p className="text-[#71717A] text-xs mb-1">Total Produtos</p>
                <p className="text-white text-xl font-bold">2.847</p>
              </div>
              <div className="bg-[#0A0A0A] border border-[#10B981]/30 rounded-lg p-3">
                <p className="text-[#71717A] text-xs mb-1">Em Estoque</p>
                <p className="text-[#10B981] text-xl font-bold">2.654</p>
              </div>
              <div className="bg-[#0A0A0A] border border-[#EF4444]/30 rounded-lg p-3">
                <p className="text-[#71717A] text-xs mb-1">Alerta Mínimo</p>
                <p className="text-[#EF4444] text-xl font-bold">193</p>
              </div>
            </div>

            {/* Lista de produtos */}
            <div className="space-y-2">
              {[
                { name: 'Arroz Tio João 5kg', stock: 245, status: 'ok' },
                { name: 'Feijão Preto 1kg', stock: 89, status: 'ok' },
                { name: 'Óleo de Soja 900ml', stock: 12, status: 'low' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[#0A0A0A] border border-[#1F1F23] rounded-lg p-3"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white text-xs font-medium">{item.name}</p>
                      <p className="text-[#71717A] text-xs">Estoque: {item.stock} un</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-semibold ${
                      item.status === 'ok' 
                        ? 'bg-[#10B981]/10 text-[#10B981]' 
                        : 'bg-[#EF4444]/10 text-[#EF4444]'
                    }`}>
                      {item.status === 'ok' ? 'OK' : 'BAIXO'}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'financeiro':
        return (
          <div className="w-full h-full bg-gradient-to-br from-[#0A0A0A] to-[#1A0A1A] p-6">
            {/* Header Financeiro */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#9333EA]/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-[#9333EA]" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Fluxo de Caixa</p>
                  <p className="text-[#71717A] text-xs">Novembro 2025</p>
                </div>
              </div>
            </div>

            {/* Cards financeiros */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-[#0A0A0A] border border-[#10B981]/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowUp className="w-4 h-4 text-[#10B981]" />
                  <p className="text-[#71717A] text-xs">Receitas</p>
                </div>
                <p className="text-[#10B981] text-2xl font-bold">R$ 248.5K</p>
                <p className="text-[#71717A] text-xs mt-1">+12% vs mês anterior</p>
              </div>
              <div className="bg-[#0A0A0A] border border-[#EF4444]/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowDown className="w-4 h-4 text-[#EF4444]" />
                  <p className="text-[#71717A] text-xs">Despesas</p>
                </div>
                <p className="text-[#EF4444] text-2xl font-bold">R$ 142.8K</p>
                <p className="text-[#71717A] text-xs mt-1">-5% vs mês anterior</p>
              </div>
            </div>

            {/* Saldo */}
            <div className="bg-gradient-to-r from-[#9333EA]/20 to-[#D946EF]/20 border border-[#9333EA]/30 rounded-lg p-4">
              <p className="text-[#A1A1AA] text-xs mb-2">Saldo do Período</p>
              <p className="text-white text-3xl font-bold">R$ 105.7K</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUp className="w-3 h-3 text-[#10B981]" />
                <p className="text-[#10B981] text-xs font-semibold">+42.5% lucro líquido</p>
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="w-full h-full bg-gradient-to-br from-[#0A0A0A] to-[#1A0A1A] p-6">
            {/* Header Analytics */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F59E0B]/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Dashboard Analytics</p>
                  <p className="text-[#71717A] text-xs">Últimos 30 dias</p>
                </div>
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-[#0A0A0A] border border-[#1F1F23] rounded-lg p-3">
                <p className="text-[#71717A] text-xs mb-1">Vendas</p>
                <p className="text-white text-xl font-bold">R$ 248K</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUp className="w-3 h-3 text-[#10B981]" />
                  <p className="text-[#10B981] text-xs">+24%</p>
                </div>
              </div>
              <div className="bg-[#0A0A0A] border border-[#1F1F23] rounded-lg p-3">
                <p className="text-[#71717A] text-xs mb-1">Ticket Médio</p>
                <p className="text-white text-xl font-bold">R$ 87,50</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUp className="w-3 h-3 text-[#10B981]" />
                  <p className="text-[#10B981] text-xs">+8%</p>
                </div>
              </div>
            </div>

            {/* Gráfico simulado */}
            <div className="bg-[#0A0A0A] border border-[#1F1F23] rounded-lg p-4">
              <p className="text-white text-xs font-semibold mb-3">Vendas por Dia</p>
              <div className="flex items-end justify-between gap-1 h-24">
                {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="flex-1 bg-gradient-to-t from-[#F59E0B] to-[#F59E0B]/50 rounded-t"
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2">
                {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((day, i) => (
                  <p key={i} className="text-[#71717A] text-xs">{day}</p>
                ))}
              </div>
            </div>
          </div>
        );

      default: // hero
        return (
          <div className="w-full h-full bg-gradient-to-br from-[#0A0A0A] to-[#1A0A1A] p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#D946EF] to-[#9333EA] rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">Σ</span>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Dashboard SIGMA</p>
                  <p className="text-[#71717A] text-xs">Visão Geral</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-[#10B981]/10 border border-[#10B981]/30 rounded-full">
                <p className="text-[#10B981] text-xs font-semibold">● Online</p>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[
                { label: 'Vendas Hoje', value: 'R$ 45.2K', icon: TrendingUp, color: '#10B981', trend: '+24%' },
                { label: 'Produtos', value: '2.847', icon: Package, color: '#D946EF', trend: '+12' },
                { label: 'Clientes', value: '1.234', icon: Users, color: '#9333EA', trend: '+8%' },
                { label: 'Ticket Médio', value: 'R$ 87', icon: DollarSign, color: '#F59E0B', trend: '+5%' }
              ].map((kpi, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[#0A0A0A] border border-[#1F1F23] rounded-lg p-3"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className="w-6 h-6 rounded flex items-center justify-center"
                      style={{ backgroundColor: `${kpi.color}20` }}
                    >
                      <kpi.icon className="w-3 h-3" style={{ color: kpi.color }} />
                    </div>
                    <p className="text-[#71717A] text-xs">{kpi.label}</p>
                  </div>
                  <p className="text-white text-lg font-bold mb-1">{kpi.value}</p>
                  <div className="flex items-center gap-1">
                    <ArrowUp className="w-3 h-3 text-[#10B981]" />
                    <p className="text-[#10B981] text-xs">{kpi.trend}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Gráfico simulado */}
            <div className="bg-[#0A0A0A] border border-[#1F1F23] rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white text-xs font-semibold">Vendas da Semana</p>
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-[#D946EF] rounded-full"></div>
                  <div className="w-2 h-2 bg-[#71717A] rounded-full"></div>
                </div>
              </div>
              <div className="flex items-end justify-between gap-2 h-20">
                {[30, 45, 35, 60, 40, 75, 50].map((height, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: 0.5 + (i * 0.1), duration: 0.5 }}
                    className="flex-1 bg-gradient-to-t from-[#D946EF] to-[#9333EA] rounded-t"
                  />
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full">
      {getContent()}
    </div>
  );
};

export default DashboardPreview;
