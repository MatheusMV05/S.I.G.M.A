import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import userService, { UsuarioData } from '@/services/userService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Lock, Mail, Phone, Building, Calendar, Shield, Eye, EyeOff } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function MyProfile() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  
  const [profileData, setProfileData] = useState<UsuarioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Estado para edição de perfil
  const [editData, setEditData] = useState({
    email: '',
    telefone: '',
  });
  
  // Estado para alteração de senha
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const data = await userService.getById(parseInt(user.id));
      setProfileData(data);
      setEditData({
        email: data.email || '',
        telefone: data.telefone || '',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao carregar dados do perfil',
        priority: 'high'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!profileData?.id) return;
    
    setIsSaving(true);
    try {
      await userService.update(profileData.id, {
        email: editData.email,
        telefone: editData.telefone,
      });
      
      addNotification({
        type: 'success',
        title: 'Sucesso',
        message: 'Perfil atualizado com sucesso!',
        priority: 'medium'
      });
      
      await loadProfile();
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao atualizar perfil',
        priority: 'high'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!profileData?.id) return;
    
    // Validações
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: 'Todos os campos de senha são obrigatórios',
        priority: 'high'
      });
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: 'A nova senha e a confirmação não coincidem',
        priority: 'high'
      });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: 'A nova senha deve ter no mínimo 6 caracteres',
        priority: 'high'
      });
      return;
    }
    
    setIsSaving(true);
    try {
      // Por enquanto, vamos usar o método update
      // TODO: Implementar endpoint específico para mudança de senha com validação da senha atual
      await userService.update(profileData.id, {
        password: passwordData.newPassword,
      });
      
      addNotification({
        type: 'success',
        title: 'Sucesso',
        message: 'Senha alterada com sucesso!',
        priority: 'medium'
      });
      
      // Limpar campos de senha
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao alterar senha',
        priority: 'high'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Dados do perfil não encontrados</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Meu Perfil</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais e configurações de conta
        </p>
      </div>

      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="edit">Editar Perfil</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        {/* Aba de Informações (Somente Leitura) */}
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
              <CardDescription>
                Visualize suas informações cadastradas no sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Dados Pessoais */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Dados Pessoais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Nome Completo</Label>
                    <p className="font-medium mt-1">{profileData.nome}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">CPF</Label>
                    <p className="font-medium mt-1">{profileData.cpf || 'Não informado'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">E-mail</Label>
                    <p className="font-medium mt-1 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {profileData.email || 'Não informado'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Telefone</Label>
                    <p className="font-medium mt-1 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {profileData.telefone || 'Não informado'}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Dados Profissionais */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Dados Profissionais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Matrícula</Label>
                    <p className="font-medium mt-1">{profileData.matricula || 'Não informado'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Cargo</Label>
                    <p className="font-medium mt-1">{profileData.cargo}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Setor</Label>
                    <p className="font-medium mt-1">{profileData.setor}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Data de Admissão</Label>
                    <p className="font-medium mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {profileData.dataAdmissao ? new Date(profileData.dataAdmissao).toLocaleDateString('pt-BR') : 'Não informado'}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Dados de Acesso */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Dados de Acesso
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Nome de Usuário</Label>
                    <p className="font-medium mt-1">{profileData.username}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Perfil</Label>
                    <p className="font-medium mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        profileData.role === 'ADMIN' 
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      }`}>
                        {profileData.role === 'ADMIN' ? 'Administrador' : 'Usuário'}
                      </span>
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <p className="font-medium mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        profileData.status === 'ATIVO'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {profileData.status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Último Acesso</Label>
                    <p className="font-medium mt-1">
                      {profileData.ultimoAcesso 
                        ? new Date(profileData.ultimoAcesso).toLocaleString('pt-BR')
                        : 'Primeiro acesso'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Edição de Perfil */}
        <TabsContent value="edit">
          <Card>
            <CardHeader>
              <CardTitle>Editar Perfil</CardTitle>
              <CardDescription>
                Atualize suas informações de contato
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  placeholder="seu.email@exemplo.com"
                />
                <p className="text-xs text-muted-foreground">
                  Seu endereço de e-mail para contato e recuperação de senha
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  type="tel"
                  value={editData.telefone}
                  onChange={(e) => setEditData({ ...editData, telefone: e.target.value })}
                  placeholder="(00) 00000-0000"
                />
                <p className="text-xs text-muted-foreground">
                  Seu número de telefone para contato
                </p>
              </div>

              <div className="pt-4">
                <Button 
                  onClick={handleUpdateProfile}
                  disabled={isSaving}
                  className="w-full md:w-auto"
                >
                  {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>

              <Separator className="my-4" />

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Dados somente leitura</h4>
                <p className="text-sm text-muted-foreground">
                  Outros dados como nome, CPF, cargo e setor são gerenciados pelo departamento de RH 
                  e não podem ser alterados através do perfil. Para atualizar essas informações, 
                  entre em contato com o administrador do sistema.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Segurança */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Segurança da Conta</CardTitle>
              <CardDescription>
                Altere sua senha para manter sua conta segura
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    placeholder="Digite sua senha atual"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="Digite sua nova senha"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  A senha deve ter no mínimo 6 caracteres
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="Digite novamente a nova senha"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  onClick={handleChangePassword}
                  disabled={isSaving}
                  className="w-full md:w-auto"
                  variant="default"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  {isSaving ? 'Alterando...' : 'Alterar Senha'}
                </Button>
              </div>

              <Separator className="my-4" />

              <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                <h4 className="font-semibold mb-2 flex items-center gap-2 text-amber-900 dark:text-amber-100">
                  <Lock className="h-4 w-4" />
                  Dicas de Segurança
                </h4>
                <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1 list-disc list-inside">
                  <li>Use uma senha forte com letras, números e caracteres especiais</li>
                  <li>Não compartilhe sua senha com ninguém</li>
                  <li>Altere sua senha periodicamente</li>
                  <li>Não use a mesma senha em diferentes sistemas</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
