import { supabase } from '../lib/supabase';
import type { CollaborativeQuestion, QuestionSubmission } from '../types/collaboration';

export class QuestionService {
  // Enviar nueva pregunta
  static async submitQuestion(userId: string, question: QuestionSubmission, userRole?: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log('Submitting question:', { userId, question, userRole });

      // Si es moderador o superadmin, aprobar automáticamente
      const status = (userRole === 'moderator' || userRole === 'superadmin') ? 'approved' : 'pending';

      const { data, error } = await supabase
        .from('collaborative_questions')
        .insert({
          user_id: userId,
          chapter: question.chapter,
          question: question.question,
          option_a: question.option_a,
          option_b: question.option_b,
          option_c: question.option_c,
          option_d: question.option_d,
          correct_answer: question.correct_answer,
          verse_reference: question.verse_reference,
          difficulty: question.difficulty,
          show_author: question.show_author ?? true,
          time_limit: question.time_limit ?? 20,
          points: question.points ?? 20,
          status: status,
          reviewed_by: (status === 'approved') ? userId : null,
          reviewed_at: (status === 'approved') ? new Date().toISOString() : null
        })
        .select()
        .single();

      if (error) {
        console.error('Error al enviar pregunta:', error);
        return { success: false, message: `Error al enviar la pregunta: ${error.message}` };
      }

      console.log('Question submitted successfully:', data);
      const message = status === 'approved' 
        ? 'Pregunta publicada exitosamente.' 
        : 'Pregunta enviada exitosamente. Está en espera de aprobación.';
      return { success: true, message };
    } catch (error) {
      console.error('Error:', error);
      return { success: false, message: 'Error al procesar la pregunta' };
    }
  }

  // Obtener preguntas del usuario
  static async getUserQuestions(userId: string): Promise<CollaborativeQuestion[]> {
    try {
      const { data, error } = await supabase
        .from('collaborative_questions')
        .select(`
          *,
          users!collaborative_questions_user_id_fkey (
            username
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error al obtener preguntas:', error);
        return [];
      }

      // Mapear los datos para incluir el username directamente
      return (data || []).map((question: any) => ({
        ...question,
        author: question.users?.username || 'Anónimo'
      })) as CollaborativeQuestion[];
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  }

  // Obtener todas las preguntas pendientes (para moderadores)
  static async getPendingQuestions(): Promise<CollaborativeQuestion[]> {
    try {
      const { data, error } = await supabase
        .from('collaborative_questions')
        .select(`
          *,
          users!collaborative_questions_user_id_fkey (
            username
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error al obtener preguntas pendientes:', error);
        return [];
      }

      // Mapear los datos para incluir el username directamente
      return (data || []).map((question: any) => ({
        ...question,
        author: question.users?.username || 'Anónimo'
      })) as CollaborativeQuestion[];
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  }

  // Aprobar pregunta
  static async approveQuestion(questionId: string, reviewerId: string): Promise<{ success: boolean; message: string }> {
    try {
      // Obtener la pregunta para saber el user_id
      const { data: question } = await supabase
        .from('collaborative_questions')
        .select('user_id')
        .eq('id', questionId)
        .single();

      if (!question) {
        return { success: false, message: 'Pregunta no encontrada' };
      }

      // Actualizar estado de la pregunta
      const { error: updateError } = await supabase
        .from('collaborative_questions')
        .update({
          status: 'approved',
          reviewed_by: reviewerId,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', questionId);

      if (updateError) {
        console.error('Error al aprobar pregunta:', updateError);
        return { success: false, message: 'Error al aprobar la pregunta' };
      }

      // Incrementar contador de preguntas aprobadas del usuario
      const { error: countError } = await supabase.rpc('increment_approved_count', {
        user_id_param: question.user_id
      });

      // Si no existe la función RPC, hacerlo manualmente
      if (countError) {
        const { data: user } = await supabase
          .from('users')
          .select('approved_questions_count')
          .eq('id', question.user_id)
          .single();

        if (user) {
          await supabase
            .from('users')
            .update({ approved_questions_count: user.approved_questions_count + 1 })
            .eq('id', question.user_id);
        }
      }

      // Registrar en historial de aprobaciones
      await supabase
        .from('approval_history')
        .insert({
          user_id: question.user_id,
          question_id: questionId
        });

      return { success: true, message: 'Pregunta aprobada exitosamente' };
    } catch (error) {
      console.error('Error:', error);
      return { success: false, message: 'Error al procesar la aprobación' };
    }
  }

  // Rechazar pregunta
  static async rejectQuestion(questionId: string, reviewerId: string, reason: string): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase
        .from('collaborative_questions')
        .update({
          status: 'rejected',
          reviewed_by: reviewerId,
          reviewed_at: new Date().toISOString(),
          rejection_reason: reason
        })
        .eq('id', questionId);

      if (error) {
        console.error('Error al rechazar pregunta:', error);
        return { success: false, message: 'Error al rechazar la pregunta' };
      }

      return { success: true, message: 'Pregunta rechazada' };
    } catch (error) {
      console.error('Error:', error);
      return { success: false, message: 'Error al procesar el rechazo' };
    }
  }

  // Obtener preguntas aprobadas por capítulo
  static async getApprovedQuestionsByChapter(chapter: number): Promise<CollaborativeQuestion[]> {
    try {
      const { data, error } = await supabase
        .from('collaborative_questions')
        .select(`
          *,
          users!collaborative_questions_user_id_fkey (
            username
          )
        `)
        .eq('chapter', chapter)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error al obtener preguntas aprobadas:', error);
        return [];
      }

      // Mapear los datos para incluir el username directamente
      return (data || []).map((question: any) => ({
        ...question,
        author: question.users?.username || 'Anónimo'
      })) as CollaborativeQuestion[];
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  }

  // Obtener estadísticas del usuario
  static async getUserStats(userId: string): Promise<{ total: number; pending: number; approved: number; rejected: number }> {
    try {
      const { data, error } = await supabase
        .from('collaborative_questions')
        .select('status')
        .eq('user_id', userId);

      if (error || !data) {
        return { total: 0, pending: 0, approved: 0, rejected: 0 };
      }

      const stats = {
        total: data.length,
        pending: data.filter(q => q.status === 'pending').length,
        approved: data.filter(q => q.status === 'approved').length,
        rejected: data.filter(q => q.status === 'rejected').length
      };

      return stats;
    } catch (error) {
      console.error('Error:', error);
      return { total: 0, pending: 0, approved: 0, rejected: 0 };
    }
  }

  // Obtener estadísticas por capítulo del usuario
  static async getUserStatsByChapter(userId: string): Promise<Record<number, number>> {
    try {
      const { data, error } = await supabase
        .from('collaborative_questions')
        .select('chapter')
        .eq('user_id', userId);

      if (error || !data) {
        return {};
      }

      const statsByChapter: Record<number, number> = {};
      data.forEach(q => {
        statsByChapter[q.chapter] = (statsByChapter[q.chapter] || 0) + 1;
      });

      return statsByChapter;
    } catch (error) {
      console.error('Error:', error);
      return {};
    }
  }

  // Obtener estadísticas globales por capítulo (todos los usuarios)
  static async getGlobalStatsByChapter(): Promise<Record<number, number>> {
    try {
      const { data, error } = await supabase
        .from('collaborative_questions')
        .select('chapter')
        .eq('status', 'approved'); // Solo contar preguntas aprobadas

      if (error || !data) {
        return {};
      }

      const statsByChapter: Record<number, number> = {};
      data.forEach(q => {
        statsByChapter[q.chapter] = (statsByChapter[q.chapter] || 0) + 1;
      });

      return statsByChapter;
    } catch (error) {
      console.error('Error:', error);
      return {};
    }
  }

  // Actualizar pregunta (solo para superadmins)
  static async updateQuestion(questionId: string, updates: Partial<CollaborativeQuestion>): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase
        .from('collaborative_questions')
        .update(updates)
        .eq('id', questionId);

      if (error) {
        console.error('Error al actualizar pregunta:', error);
        return { success: false, message: 'Error al actualizar la pregunta' };
      }

      return { success: true, message: 'Pregunta actualizada exitosamente' };
    } catch (error) {
      console.error('Error:', error);
      return { success: false, message: 'Error al procesar la actualización' };
    }
  }

  // Obtener una pregunta por ID
  static async getQuestionById(questionId: string): Promise<CollaborativeQuestion | null> {
    try {
      const { data, error } = await supabase
        .from('collaborative_questions')
        .select('*')
        .eq('id', questionId)
        .single();

      if (error || !data) {
        return null;
      }

      return data as CollaborativeQuestion;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  // Obtener todas las preguntas (para administradores)
  static async getAllQuestions(): Promise<CollaborativeQuestion[]> {
    try {
      const { data, error } = await supabase
        .from('collaborative_questions')
        .select(`
          *,
          users!collaborative_questions_user_id_fkey (
            username
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error al obtener todas las preguntas:', error);
        return [];
      }

      // Mapear los datos para incluir el username directamente
      return (data || []).map((question: any) => ({
        ...question,
        author: question.users?.username || 'Anónimo'
      })) as CollaborativeQuestion[];
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  }

  // Obtener estadísticas globales (para administradores)
  static async getGlobalStats(): Promise<{ total: number; pending: number; approved: number; rejected: number }> {
    try {
      const { data, error } = await supabase
        .from('collaborative_questions')
        .select('status');

      if (error || !data) {
        return { total: 0, pending: 0, approved: 0, rejected: 0 };
      }

      const stats = {
        total: data.length,
        pending: data.filter(q => q.status === 'pending').length,
        approved: data.filter(q => q.status === 'approved').length,
        rejected: data.filter(q => q.status === 'rejected').length
      };

      return stats;
    } catch (error) {
      console.error('Error:', error);
      return { total: 0, pending: 0, approved: 0, rejected: 0 };
    }
  }
}
