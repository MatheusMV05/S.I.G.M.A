/**
 * MODAL DE CADASTRO RÁPIDO DE CLIENTE
 * Permite cadastrar um cliente de forma simplificada no PDV
 * Campos mínimos: Nome, CPF/CNPJ, Telefone
 */

import React, { useState } from 'react';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { customerService } from '@/services/customerService';
import type { Customer, CreateCustomerRequest } from '@/services/types';

interface QuickCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClienteCriado: (cliente: Customer) => void;
}

export function QuickCustomerModal({ isOpen, onClose, onClienteCriado }: QuickCustomerModalProps) {
  const { toast } = useToast();
  const [salvando, setSalvando] = useState(false);
  
  // Estados do formulário
  const [tipoCliente, setTipoCliente] = useState<'individual' | 'business'>('individual');
  const [nome, setNome] = useState('');
  const [documento, setDocumento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');

  /**
   * Aplica máscara de CPF ou CNPJ
   */
  const aplicarMascaraDocumento = (value: string, tipo: 'individual' | 'business') => {
    const numeros = value.replace(/\D/g, '');
    
    if (tipo === 'individual') {
      // CPF: 000.000.000-00
      return numeros
        .substring(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      // CNPJ: 00.000.000/0000-00
      return numeros
        .substring(0, 14)
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }
  };

  /**
   * Aplica máscara de telefone: (00) 00000-0000
   */
  const aplicarMascaraTelefone = (value: string) => {
    const numeros = value.replace(/\D/g, '');
    
    return numeros
      .substring(0, 11)
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
  };

  /**
   * Valida formulário
   */
  const validarFormulario = (): boolean => {
    if (!nome.trim()) {
      toast({
        title: 'Nome obrigatório',
        description: 'Por favor, digite o nome do cliente',
        variant: 'destructive',
      });
      return false;
    }

    const documentoLimpo = documento.replace(/\D/g, '');
    const tamanhoEsperado = tipoCliente === 'individual' ? 11 : 14;
    
    if (documentoLimpo.length !== tamanhoEsperado) {
      toast({
        title: 'Documento inválido',
        description: `O ${tipoCliente === 'individual' ? 'CPF' : 'CNPJ'} deve ter ${tamanhoEsperado} dígitos`,
        variant: 'destructive',
      });
      return false;
    }

    const telefoneLimpo = telefone.replace(/\D/g, '');
    if (telefoneLimpo.length < 10) {
      toast({
        title: 'Telefone inválido',
        description: 'O telefone deve ter pelo menos 10 dígitos',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  /**
   * Salva cliente
   */
  const salvarCliente = async () => {
    if (!validarFormulario()) {
      return;
    }

    setSalvando(true);

    try {
      const novoCliente: CreateCustomerRequest = {
        name: nome.trim(),
        email: email.trim() || '',
        phone: telefone,
        type: tipoCliente,
        document: documento.replace(/\D/g, ''),
        address: {
          street: '',
          number: '',
          neighborhood: '',
          city: '',
          state: '',
          zipCode: '',
        },
      };

      const clienteCriado = await customerService.createCustomer(novoCliente);

      toast({
        title: 'Cliente cadastrado!',
        description: `${clienteCriado.name} foi cadastrado com sucesso`,
      });

      onClienteCriado(clienteCriado);
      limparFormulario();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Erro ao cadastrar cliente',
        description: error?.message || 'Tente novamente',
        variant: 'destructive',
      });
    } finally {
      setSalvando(false);
    }
  };

  /**
   * Limpa formulário
   */
  const limparFormulario = () => {
    setNome('');
    setDocumento('');
    setTelefone('');
    setEmail('');
    setTipoCliente('individual');
  };

  /**
   * Fecha modal e limpa formulário
   */
  const handleClose = () => {
    limparFormulario();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cadastro Rápido de Cliente</DialogTitle>
          <DialogDescription>
            Preencha os dados básicos do cliente para vincular à venda
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Tipo de Cliente */}
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Cliente *</Label>
            <Select 
              value={tipoCliente} 
              onValueChange={(value) => {
                setTipoCliente(value as 'individual' | 'business');
                setDocumento(''); // Limpa documento ao mudar tipo
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Pessoa Física (CPF)</SelectItem>
                <SelectItem value="business">Pessoa Jurídica (CNPJ)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="nome">
              {tipoCliente === 'individual' ? 'Nome Completo *' : 'Razão Social *'}
            </Label>
            <Input
              id="nome"
              type="text"
              placeholder={tipoCliente === 'individual' ? 'João da Silva' : 'Empresa LTDA'}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              disabled={salvando}
            />
          </div>

          {/* Documento */}
          <div className="space-y-2">
            <Label htmlFor="documento">
              {tipoCliente === 'individual' ? 'CPF *' : 'CNPJ *'}
            </Label>
            <Input
              id="documento"
              type="text"
              placeholder={tipoCliente === 'individual' ? '000.000.000-00' : '00.000.000/0000-00'}
              value={documento}
              onChange={(e) => setDocumento(aplicarMascaraDocumento(e.target.value, tipoCliente))}
              maxLength={tipoCliente === 'individual' ? 14 : 18}
              disabled={salvando}
            />
          </div>

          {/* Telefone */}
          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone *</Label>
            <Input
              id="telefone"
              type="text"
              placeholder="(00) 00000-0000"
              value={telefone}
              onChange={(e) => setTelefone(aplicarMascaraTelefone(e.target.value))}
              maxLength={15}
              disabled={salvando}
            />
          </div>

          {/* Email (Opcional) */}
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="cliente@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={salvando}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={salvando}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={salvarCliente}
            disabled={salvando}
          >
            {salvando ? 'Salvando...' : 'Cadastrar Cliente'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

