/**
 * COMPONENTE DE BUSCA DE CLIENTE NO PDV
 * Permite buscar cliente por CPF/CNPJ com máscara automática
 * e exibir dados do cliente encontrado
 */

import React, { useState } from 'react';
import { Search, X, User, Phone, Mail, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { customerService } from '@/services/customerService';
import type { Customer } from '@/services/types';

interface CustomerSearchPDVProps {
  onClienteSelecionado: (cliente: Customer | null) => void;
  clienteSelecionado: Customer | null;
  onCadastroRapido: () => void;
}

export function CustomerSearchPDV({ onClienteSelecionado, clienteSelecionado, onCadastroRapido }: CustomerSearchPDVProps) {
  const { toast } = useToast();
  const [documento, setDocumento] = useState('');
  const [buscando, setBuscando] = useState(false);

  /**
   * Aplica máscara de CPF ou CNPJ automaticamente
   */
  const aplicarMascara = (value: string) => {
    // Remove tudo que não é dígito
    const numeros = value.replace(/\D/g, '');
    
    // CPF: 000.000.000-00
    if (numeros.length <= 11) {
      return numeros
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    
    // CNPJ: 00.000.000/0000-00
    return numeros
      .substring(0, 14)
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  };

  /**
   * Busca cliente por documento
   */
  const buscarCliente = async () => {
    if (!documento) {
      toast({
        title: 'Documento necessário',
        description: 'Por favor, digite um CPF ou CNPJ',
        variant: 'destructive',
      });
      return;
    }

    // Remove máscara para validar
    const documentoLimpo = documento.replace(/\D/g, '');
    
    if (documentoLimpo.length !== 11 && documentoLimpo.length !== 14) {
      toast({
        title: 'Documento inválido',
        description: 'Digite um CPF (11 dígitos) ou CNPJ (14 dígitos) válido',
        variant: 'destructive',
      });
      return;
    }

    setBuscando(true);
    
    try {
      const cliente = await customerService.getCustomerByDocument(documentoLimpo);
      
      onClienteSelecionado(cliente);
      
      toast({
        title: 'Cliente encontrado!',
        description: `${cliente.name} - ${cliente.email}`,
      });
    } catch (error: any) {
      // Cliente não encontrado
      if (error?.status === 404) {
        toast({
          title: 'Cliente não cadastrado',
          description: 'Deseja cadastrar agora?',
          variant: 'default',
        });
      } else {
        toast({
          title: 'Erro ao buscar cliente',
          description: error?.message || 'Tente novamente',
          variant: 'destructive',
        });
      }
      
      onClienteSelecionado(null);
    } finally {
      setBuscando(false);
    }
  };

  /**
   * Remove cliente selecionado
   */
  const removerCliente = () => {
    onClienteSelecionado(null);
    setDocumento('');
  };

  /**
   * Handle Enter key
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      buscarCliente();
    }
  };

  /**
   * Formata classificação VIP
   */
  const getClassificacaoColor = (classificacao?: string) => {
    switch (classificacao) {
      case 'DIAMANTE': return 'bg-blue-500 text-white';
      case 'PLATINA': return 'bg-gray-300 text-gray-900';
      case 'OURO': return 'bg-yellow-500 text-white';
      case 'PRATA': return 'bg-gray-400 text-white';
      case 'BRONZE': return 'bg-orange-700 text-white';
      default: return 'bg-gray-200 text-gray-900';
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Digite CPF ou CNPJ do cliente"
                  value={documento}
                  onChange={(e) => setDocumento(aplicarMascara(e.target.value))}
                  onKeyPress={handleKeyPress}
                  disabled={!!clienteSelecionado}
                  maxLength={18} // CNPJ formatado: 00.000.000/0000-00
                  className="pr-10"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            {!clienteSelecionado ? (
              <>
                <Button 
                  onClick={buscarCliente} 
                  disabled={buscando || !documento}
                  size="lg"
                >
                  {buscando ? 'Buscando...' : 'Buscar'}
                </Button>
                <Button 
                  onClick={onCadastroRapido} 
                  variant="outline"
                  size="lg"
                >
                  Cadastrar
                </Button>
              </>
            ) : (
              <Button 
                onClick={removerCliente} 
                variant="destructive"
                size="lg"
              >
                <X className="h-4 w-4 mr-2" />
                Remover
              </Button>
            )}
          </div>

          {/* Exibição do Cliente Selecionado */}
          {clienteSelecionado && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-lg">{clienteSelecionado.name}</h3>
                    <p className="text-sm text-gray-600">{clienteSelecionado.document}</p>
                  </div>
                </div>
                
                {clienteSelecionado.classificacao && (
                  <Badge className={getClassificacaoColor(clienteSelecionado.classificacao)}>
                    {clienteSelecionado.classificacao}
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                {clienteSelecionado.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">{clienteSelecionado.email}</span>
                  </div>
                )}
                
                {clienteSelecionado.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">{clienteSelecionado.phone}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-green-200">
                <div>
                  <p className="text-xs text-gray-500">Total Gasto</p>
                  <p className="font-semibold text-green-700">
                    R$ {clienteSelecionado.totalSpent?.toFixed(2) || '0,00'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Compras</p>
                  <p className="font-semibold text-green-700 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    {clienteSelecionado.totalPurchases || 0}
                  </p>
                </div>
              </div>
            </div>
          )}

          {!clienteSelecionado && (
            <p className="text-sm text-gray-500 text-center">
              Busque um cliente pelo CPF/CNPJ ou clique em "Cadastrar" para cadastro rápido
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

