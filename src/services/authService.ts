import { supabase } from '../lib/supabase';
import bcrypt from 'bcryptjs';
import type { User } from '../types/collaboration';

const SALT_ROUNDS = 10;

export class AuthService {
  // Registrar nuevo usuario
  static async register(username: string, password: string, email?: string): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      // Validar que el username no exista
      const { data: existingUsers } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .limit(1);

      if (existingUsers && existingUsers.length > 0) {
        return { success: false, message: 'El nombre de usuario ya está en uso' };
      }

      // Validar email si se proporciona
      if (email) {
        const { data: existingEmails } = await supabase
          .from('users')
          .select('id')
          .eq('email', email)
          .limit(1);

        if (existingEmails && existingEmails.length > 0) {
          return { success: false, message: 'El correo electrónico ya está registrado' };
        }
      }

      // Hash de la contraseña
      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

      // Insertar usuario
      const { data, error } = await supabase
        .from('users')
        .insert({
          username,
          password_hash: passwordHash,
          email,
          role: 'collaborator',
          approved_questions_count: 0
        })
        .select()
        .single();

      if (error) {
        console.error('Error al registrar usuario:', error);
        return { success: false, message: 'Error al crear la cuenta' };
      }

      return { 
        success: true, 
        message: 'Cuenta creada exitosamente',
        user: data as User
      };
    } catch (error) {
      console.error('Error en registro:', error);
      return { success: false, message: 'Error al procesar el registro' };
    }
  }

  // Login con consulta directa a la base de datos
  static async login(username: string, password: string): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      // Buscar usuario por username
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .limit(1);

      if (error || !users || users.length === 0) {
        return { success: false, message: 'Usuario o contraseña incorrectos' };
      }

      const user = users[0];

      // Verificar contraseña
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);

      if (!isPasswordValid) {
        return { success: false, message: 'Usuario o contraseña incorrectos' };
      }

      // No devolver el hash de la contraseña
      const { password_hash, ...userWithoutPassword } = user;

      return {
        success: true,
        message: 'Inicio de sesión exitoso',
        user: userWithoutPassword as User
      };
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, message: 'Error al iniciar sesión' };
    }
  }

  // Obtener usuario actual desde localStorage
  static getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem('currentUser');
      if (!userStr) return null;
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  }

  // Guardar usuario en localStorage
  static saveCurrentUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  // Cerrar sesión
  static logout(): void {
    localStorage.removeItem('currentUser');
  }

  // Verificar si el usuario está autenticado
  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  // Verificar si el usuario tiene un rol específico
  static hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  // Verificar si el usuario es admin o superadmin
  static isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'moderator' || user?.role === 'superadmin';
  }
}
