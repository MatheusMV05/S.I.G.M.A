import React from 'react';
import { AnaliseVendasDetalhada } from '@/components/AnaliseVendasDetalhada';

/**
 * Página dedicada à Análise Detalhada de Vendas
 * Utiliza a VIEW vw_analise_vendas_completa do banco de dados
 */
export default function AnaliseVendasPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Análise Detalhada de Vendas</h1>
        <p className="text-muted-foreground">
          Análise completa das vendas com informações de clientes, vendedores e métricas detalhadas
        </p>
      </div>
      
      <AnaliseVendasDetalhada />
    </div>
  );
}
