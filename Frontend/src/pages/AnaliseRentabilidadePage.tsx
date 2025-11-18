import React from 'react';
import { AnaliseRentabilidade } from '@/components/AnaliseRentabilidade';

/**
 * Página dedicada à Análise de Rentabilidade de Produtos
 * Utiliza a VIEW vw_inventario_rentabilidade do banco de dados
 */
export default function AnaliseRentabilidadePage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Análise de Rentabilidade</h1>
        <p className="text-muted-foreground">
          Visão completa da rentabilidade dos produtos com análise de margem, lucro potencial e recomendações de estoque
        </p>
      </div>
      
      <AnaliseRentabilidade />
    </div>
  );
}
