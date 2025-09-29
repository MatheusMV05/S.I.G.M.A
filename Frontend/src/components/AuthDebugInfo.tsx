// Componente temporário para debug da autenticação
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function AuthDebugInfo() {
  const token = localStorage.getItem('auth_token');
  const refreshToken = localStorage.getItem('refresh_token');
  
  // Função para decodificar JWT (básica, sem verificação)
  const decodeJWT = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  };

  const tokenInfo = token ? decodeJWT(token) : null;
  const isExpired = tokenInfo ? (Date.now() / 1000) > tokenInfo.exp : false;

  return (
    <Card className="mb-4 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="text-blue-900">🔍 Debug - Autenticação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium">Token presente:</span>
          <Badge variant={token ? "default" : "destructive"}>
            {token ? "Sim" : "Não"}
          </Badge>
        </div>
        
        {token && (
          <>
            <div className="flex items-center gap-2">
              <span className="font-medium">Token expirado:</span>
              <Badge variant={isExpired ? "destructive" : "default"}>
                {isExpired ? "Sim" : "Não"}
              </Badge>
            </div>
            
            {tokenInfo && (
              <div className="text-xs bg-white p-2 rounded border">
                <div>Usuário: {tokenInfo.sub || 'N/A'}</div>
                <div>Expira em: {new Date(tokenInfo.exp * 1000).toLocaleString()}</div>
                <div>Emitido em: {new Date(tokenInfo.iat * 1000).toLocaleString()}</div>
              </div>
            )}
          </>
        )}
        
        <div className="flex items-center gap-2">
          <span className="font-medium">Refresh token presente:</span>
          <Badge variant={refreshToken ? "default" : "secondary"}>
            {refreshToken ? "Sim" : "Não"}
          </Badge>
        </div>
        
        <div className="text-xs text-blue-700">
          URL da API: {import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}
        </div>
      </CardContent>
    </Card>
  );
}