import React, { useState, useEffect } from 'react';
import { UserPlus, Users, Mail, Key, Shield, AlertCircle, CheckCircle, Trash2, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import bcrypt from 'bcryptjs';
import { AuthService } from '../services/authService';
import { NotificationService } from '../services/notificationService';
import AdminSidebar from './AdminSidebar';
import type { User } from '../types/collaboration';

const AdminCollaboratorManager: React.FC = () => {
  const currentUser = AuthService.getCurrentUser();
  const [collaborators, setCollaborators] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messageText, setMessageText] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'collaborator' as 'collaborator' | 'trusted_collaborator' | 'moderator',
    beta_mode: false
  });

  useEffect(() => {
    loadCollaborators();
  }, []);

  const loadCollaborators = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCollaborators(data || []);
    } catch (err) {
      console.error('Error loading collaborators:', err);
      setError('Error al cargar colaboradores');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(formData.password, 10);

      // Insert new user
      const { error: insertError } = await supabase
        .from('users')
        .insert([{
          username: formData.username,
          email: formData.email,
          password_hash: hashedPassword,
          role: formData.role,
          beta_mode: formData.beta_mode,
          approved_questions_count: 0
        }]);

      if (insertError) throw insertError;

      setSuccess('Colaborador registrado exitosamente');
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'collaborator',
        beta_mode: false
      });
      setShowAddForm(false);
      loadCollaborators();
    } catch (err: any) {
      console.error('Error creating collaborator:', err);
      setError(err.message || 'Error al crear colaborador');
    }
  };

  const handleToggleBetaMode = async (userId: string, currentBetaMode: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ beta_mode: !currentBetaMode })
        .eq('id', userId);

      if (error) throw error;

      setSuccess('Modo beta actualizado');
      loadCollaborators();
    } catch (err) {
      console.error('Error updating beta mode:', err);
      setError('Error al actualizar modo beta');
    }
  };

  const handleUpdateNationality = async (userId: string, nationality: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ nationality: nationality || null })
        .eq('id', userId);

      if (error) throw error;

      setSuccess('Nacionalidad actualizada');
      loadCollaborators();
    } catch (err) {
      console.error('Error updating nationality:', err);
      setError('Error al actualizar nacionalidad');
    }
  };

  const handleDeleteCollaborator = async (userId: string) => {
    if (!confirm('¿Estás seguro de eliminar este colaborador?')) return;

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      setSuccess('Colaborador eliminado');
      loadCollaborators();
    } catch (err) {
      console.error('Error deleting collaborator:', err);
      setError('Error al eliminar colaborador');
    }
  };

  const handleSendMessage = async () => {
    if (!selectedUser || !messageText.trim()) {
      setError('Por favor escribe un mensaje');
      return;
    }

    try {
      const result = await NotificationService.createNotification(
        selectedUser.id,
        'message',
        'Mensaje del administrador',
        messageText
      );

      if (result.success) {
        setSuccess(`Mensaje enviado a ${selectedUser.username}`);
        setShowMessageModal(false);
        setSelectedUser(null);
        setMessageText('');
      } else {
        setError(`Error al enviar el mensaje: ${result.message}`);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Error al enviar el mensaje. Verifica que hayas ejecutado el script SQL para agregar el tipo "message" a las notificaciones.');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'moderator':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'trusted_collaborator':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'Super Admin';
      case 'moderator':
        return 'Moderador';
      case 'trusted_collaborator':
        return 'Colaborador Confiable';
      default:
        return 'Colaborador';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar Navigation */}
      <AdminSidebar userRole={currentUser?.role || ''} />

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3" style={{ fontFamily: "'Bungee', cursive" }}>
              <Users className="h-8 w-8" />
              Gestión de Colaboradores
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Administra los colaboradores y sus permisos
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            <UserPlus className="h-5 w-5" />
            Nuevo Colaborador
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
            <AlertCircle className="h-5 w-5" />
            <p className="font-medium">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
          <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
            <CheckCircle className="h-5 w-5" />
            <p className="font-medium">{success}</p>
          </div>
        </div>
      )}

      {/* Add Form */}
      {showAddForm && (
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Registrar Nuevo Colaborador
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Nombre de Usuario
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Key className="inline h-4 w-4 mr-1" />
                  Contraseña
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Shield className="inline h-4 w-4 mr-1" />
                  Rol
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                >
                  <option value="collaborator">Colaborador</option>
                  <option value="trusted_collaborator">Colaborador Confiable</option>
                  <option value="moderator">Moderador</option>
                </select>
              </div>
            </div>

            {/* Beta Mode Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Modo Beta
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Permite acceso a funciones en desarrollo
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, beta_mode: !formData.beta_mode })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                  formData.beta_mode ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.beta_mode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
              >
                Registrar Colaborador
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Collaborators List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Lista de Colaboradores
        </h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
        ) : collaborators.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No hay colaboradores registrados</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {collaborators.map((collaborator) => (
              <div
                key={collaborator.id}
                className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-amber-300 dark:hover:border-amber-600 hover:shadow-lg transition-all"
              >
                {/* Header con nombre y rol */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {collaborator.username}
                    </h3>
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(collaborator.role)}`}>
                      {getRoleLabel(collaborator.role)}
                    </span>
                  </div>
                  
                  {/* Acciones */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedUser(collaborator);
                        setShowMessageModal(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      title="Enviar mensaje"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                    {collaborator.role !== 'superadmin' && (
                      <button
                        onClick={() => handleDeleteCollaborator(collaborator.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Eliminar colaborador"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="mb-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {collaborator.email || 'Sin email'}
                  </p>
                </div>

                {/* Estadísticas */}
                <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {collaborator.approved_questions_count}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Aprobadas</p>
                  </div>
                  <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Modo Beta</p>
                    <button
                      onClick={() => handleToggleBetaMode(collaborator.id, collaborator.beta_mode)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        collaborator.beta_mode ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                      disabled={collaborator.role === 'superadmin'}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          collaborator.beta_mode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Nacionalidad (solo para usuarios beta) */}
                {collaborator.beta_mode && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Nacionalidad</p>
                    <select
                      value={collaborator.nationality || ''}
                      onChange={(e) => handleUpdateNationality(collaborator.id, e.target.value)}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="">Sin nacionalidad</option>
                      <option value="AR">🇦🇷 Argentina</option>
                      <option value="BO">🇧🇴 Bolivia</option>
                      <option value="BR">🇧🇷 Brasil</option>
                      <option value="CL">🇨🇱 Chile</option>
                      <option value="CO">🇨🇴 Colombia</option>
                      <option value="CR">🇨🇷 Costa Rica</option>
                      <option value="CU">🇨🇺 Cuba</option>
                      <option value="DO">🇩🇴 República Dominicana</option>
                      <option value="EC">🇪🇨 Ecuador</option>
                      <option value="SV">🇸🇻 El Salvador</option>
                      <option value="GT">🇬🇹 Guatemala</option>
                      <option value="HN">🇭🇳 Honduras</option>
                      <option value="MX">🇲🇽 México</option>
                      <option value="NI">🇳🇮 Nicaragua</option>
                      <option value="PA">🇵🇦 Panamá</option>
                      <option value="PY">🇵🇾 Paraguay</option>
                      <option value="PE">🇵🇪 Perú</option>
                      <option value="PR">🇵🇷 Puerto Rico</option>
                      <option value="ES">🇪🇸 España</option>
                      <option value="UY">🇺🇾 Uruguay</option>
                      <option value="VE">🇻🇪 Venezuela</option>
                      <option value="US">🇺🇸 Estados Unidos</option>
                    </select>
                  </div>
                )}

                {/* Fecha de registro */}
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center pt-3 border-t border-gray-200 dark:border-gray-700">
                  Registrado: {new Date(collaborator.created_at).toLocaleDateString('es-ES')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para enviar mensaje */}
      {showMessageModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Enviar mensaje a {selectedUser.username}
            </h3>
            
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
              rows={5}
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowMessageModal(false);
                  setSelectedUser(null);
                  setMessageText('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default AdminCollaboratorManager;
