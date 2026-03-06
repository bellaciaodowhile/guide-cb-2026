import { supabase } from '../lib/supabase';
import type { Notification } from '../types/collaboration';

export class NotificationService {
  // Crear una nueva notificación
  static async createNotification(
    userId: string,
    type: 'approved' | 'rejected' | 'message',
    title: string,
    message: string,
    questionId?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert([{
          user_id: userId,
          type,
          title,
          message,
          question_id: questionId || null,
          is_read: false
        }]);

      if (error) {
        console.error('Error al crear notificación:', error);
        return { success: false, message: 'Error al crear notificación' };
      }

      return { success: true, message: 'Notificación creada' };
    } catch (error) {
      console.error('Error:', error);
      return { success: false, message: 'Error al procesar la solicitud' };
    }
  }

  // Obtener notificaciones del usuario
  static async getUserNotifications(userId: string): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error al obtener notificaciones:', error);
        return [];
      }

      return data as Notification[];
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  }

  // Obtener notificaciones no leídas del usuario
  static async getUnreadNotifications(userId: string): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('is_read', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error al obtener notificaciones no leídas:', error);
        return [];
      }

      return data as Notification[];
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  }

  // Contar notificaciones no leídas
  static async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) {
        console.error('Error al contar notificaciones no leídas:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error:', error);
      return 0;
    }
  }

  // Marcar notificación como leída
  static async markAsRead(notificationId: string): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('Error al marcar notificación como leída:', error);
        return { success: false, message: 'Error al marcar como leída' };
      }

      return { success: true, message: 'Notificación marcada como leída' };
    } catch (error) {
      console.error('Error:', error);
      return { success: false, message: 'Error al procesar la solicitud' };
    }
  }

  // Marcar todas las notificaciones como leídas
  static async markAllAsRead(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) {
        console.error('Error al marcar todas como leídas:', error);
        return { success: false, message: 'Error al marcar todas como leídas' };
      }

      return { success: true, message: 'Todas las notificaciones marcadas como leídas' };
    } catch (error) {
      console.error('Error:', error);
      return { success: false, message: 'Error al procesar la solicitud' };
    }
  }

  // Eliminar notificación
  static async deleteNotification(notificationId: string): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) {
        console.error('Error al eliminar notificación:', error);
        return { success: false, message: 'Error al eliminar notificación' };
      }

      return { success: true, message: 'Notificación eliminada' };
    } catch (error) {
      console.error('Error:', error);
      return { success: false, message: 'Error al procesar la solicitud' };
    }
  }

  // Eliminar todas las notificaciones leídas del usuario
  static async deleteAllRead(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId)
        .eq('is_read', true);

      if (error) {
        console.error('Error al eliminar notificaciones leídas:', error);
        return { success: false, message: 'Error al eliminar notificaciones' };
      }

      return { success: true, message: 'Notificaciones leídas eliminadas' };
    } catch (error) {
      console.error('Error:', error);
      return { success: false, message: 'Error al procesar la solicitud' };
    }
  }
}
