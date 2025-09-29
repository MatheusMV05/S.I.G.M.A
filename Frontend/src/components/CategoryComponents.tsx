import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle } from 'lucide-react';
import { useCategoryOptions, useCategoryById } from '@/hooks/useCategoryUtils';

interface CategorySelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  showDescription?: boolean;
}

/**
 * Componente Select para categorias integrado com o backend
 * Exemplo de uso do sistema de categorias em formulários
 */
export const CategorySelect: React.FC<CategorySelectProps> = ({
  value,
  onValueChange,
  placeholder = "Selecione uma categoria",
  disabled = false,
  required = false,
  label = "Categoria",
  showDescription = true
}) => {
  const { categoryOptions, isLoading, error, isEmpty } = useCategoryOptions();

  if (error) {
    return (
      <div className="space-y-2">
        {label && <Label>{label} {required && '*'}</Label>}
        <div className="flex items-center gap-2 p-3 border border-destructive rounded-md bg-destructive/10">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <span className="text-sm text-destructive">Erro ao carregar categorias</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label && (
        <Label>
          {label} {required && '*'}
          {isLoading && <Loader2 className="inline h-3 w-3 ml-1 animate-spin" />}
        </Label>
      )}
      
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled || isLoading || isEmpty}
      >
        <SelectTrigger>
          <SelectValue placeholder={
            isLoading ? "Carregando..." : 
            isEmpty ? "Nenhuma categoria disponível" : 
            placeholder
          } />
        </SelectTrigger>
        <SelectContent>
          {categoryOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex flex-col">
                <span>{option.label}</span>
                {showDescription && option.description && (
                  <span className="text-xs text-muted-foreground">
                    {option.description}
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {isEmpty && !isLoading && (
        <p className="text-xs text-muted-foreground">
          Nenhuma categoria ativa encontrada. Crie uma categoria primeiro.
        </p>
      )}
    </div>
  );
};

interface CategoryDisplayProps {
  categoryId: string | null;
  showStatus?: boolean;
  fallback?: string;
}

/**
 * Componente para exibir informações de uma categoria
 * Exemplo de uso para mostrar categoria de um produto
 */
export const CategoryDisplay: React.FC<CategoryDisplayProps> = ({
  categoryId,
  showStatus = false,
  fallback = "Categoria não informada"
}) => {
  const { category, categoryName, isActive } = useCategoryById(categoryId);

  if (!categoryId || !category) {
    return <span className="text-muted-foreground">{fallback}</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <span>{categoryName}</span>
      {showStatus && (
        <Badge variant={isActive ? 'default' : 'secondary'} className="text-xs">
          {isActive ? 'Ativa' : 'Inativa'}
        </Badge>
      )}
    </div>
  );
};

/**
 * Exemplo de uso em um formulário de produto
 */
export const ProductFormExample = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    categoryId: '',
    price: 0,
  });

  return (
    <div className="space-y-4 max-w-md">
      <div>
        <Label htmlFor="productName">Nome do Produto *</Label>
        <input
          id="productName"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2 border rounded"
          placeholder="Nome do produto"
        />
      </div>

      <CategorySelect
        value={formData.categoryId}
        onValueChange={(categoryId) => setFormData({ ...formData, categoryId })}
        required
        label="Categoria do Produto"
        showDescription
      />

      <div>
        <Label htmlFor="productPrice">Preço *</Label>
        <input
          id="productPrice"
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
          className="w-full p-2 border rounded"
          placeholder="0.00"
        />
      </div>

      {/* Exibir categoria selecionada */}
      {formData.categoryId && (
        <div className="p-3 bg-muted rounded">
          <Label className="text-sm">Categoria selecionada:</Label>
          <CategoryDisplay 
            categoryId={formData.categoryId} 
            showStatus 
          />
        </div>
      )}
    </div>
  );
};