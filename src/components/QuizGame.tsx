import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { QuestionService } from '../services/questionService';
import type { CollaborativeQuestion } from '../types/collaboration';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: string;
  verse: string;
}

interface UserAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeLeft: number;
}

// Función para mezclar array (Fisher-Yates shuffle)
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Convertir pregunta de la base de datos al formato del quiz
const convertToQuizQuestion = (dbQuestion: CollaborativeQuestion): Question => {
  return {
    id: dbQuestion.id,
    question: dbQuestion.question,
    options: [
      dbQuestion.option_a,
      dbQuestion.option_b,
      dbQuestion.option_c,
      dbQuestion.option_d
    ],
    correctAnswer: dbQuestion.correct_answer,
    difficulty: dbQuestion.difficulty,
    verse: dbQuestion.verse_reference
  };
};

const QuizGame: React.FC = () => {
  const navigate = useNavigate();
  const { category, level, section } = useParams<{ category: string; level: string; section: string }>();
  const [searchParams] = useSearchParams();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Cargar preguntas desde la base de datos
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        
        // Si es un quiz personalizado, cargar múltiples capítulos
        if (level === 'custom') {
          const chaptersParam = searchParams.get('chapters');
          const chapterIds = chaptersParam ? chaptersParam.split(',').map(Number) : [];
          
          const allQuestions: Question[] = [];
          for (const chapterId of chapterIds) {
            const dbQuestions = await QuestionService.getApprovedQuestionsByChapter(chapterId);
            const quizQuestions = dbQuestions.map(convertToQuizQuestion);
            allQuestions.push(...quizQuestions);
          }
          
          // Mezclar preguntas aleatoriamente sin repetición
          const shuffled = shuffleArray(allQuestions);
          // Tomar máximo 20 preguntas
          setQuestions(shuffled.slice(0, 20));
        } else {
          // Cargar preguntas del capítulo específico
          const levelKey = parseInt(level || '1');
          const sectionKey = parseInt(section || '1');
          
          const dbQuestions = await QuestionService.getApprovedQuestionsByChapter(levelKey);
          const quizQuestions = dbQuestions.map(convertToQuizQuestion);
          
          // Calcular el rango de preguntas para esta sección (20 preguntas por sección)
          const startIndex = (sectionKey - 1) * 20;
          const endIndex = startIndex + 20;
          
          // Mezclar todas las preguntas y tomar el rango correspondiente
          const shuffled = shuffleArray(quizQuestions);
          const sectionQuestions = shuffled.slice(startIndex, endIndex);
          
          setQuestions(sectionQuestions);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading questions:', error);
        setQuestions([]);
        setIsLoading(false);
      }
    };
    
    loadQuestions();
  }, [level, section, searchParams]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  // Temporizador - solo inicia cuando el juego ha comenzado
  useEffect(() => {
    if (!gameStarted || showResults || isAnswered || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeOut();
          return 20;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, showResults, isAnswered, questions, gameStarted]);

  const handleTimeOut = () => {
    // Si no respondió, marcar como incorrecta
    if (selectedAnswer === null && questions.length > 0 && questions[currentQuestionIndex]) {
      const answer: UserAnswer = {
        questionId: questions[currentQuestionIndex].id,
        selectedAnswer: -1,
        isCorrect: false,
        timeLeft: 0
      };
      setUserAnswers([...userAnswers, answer]);
      moveToNextQuestion();
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    
    const isCorrect = answerIndex === questions[currentQuestionIndex].correctAnswer;
    const answer: UserAnswer = {
      questionId: questions[currentQuestionIndex].id,
      selectedAnswer: answerIndex,
      isCorrect,
      timeLeft
    };
    
    setUserAnswers([...userAnswers, answer]);
    
    // Esperar 1 segundo antes de pasar a la siguiente pregunta
    setTimeout(() => {
      moveToNextQuestion();
    }, 1000);
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(20);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    return userAnswers.filter(answer => answer.isCorrect).length;
  };

  const handleBack = () => {
    const route = category ? `/${category}/quiz` : '/quiz';
    navigate(route);
  };

  const handleRetry = () => {
    // Mezclar preguntas nuevamente para el retry
    const shuffled = shuffleArray([...questions]);
    setQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setTimeLeft(20);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setShowResults(false);
    setIsAnswered(false);
    setGameStarted(false);
  };

  const handleStartGame = () => {
    setGameStarted(true);
  };

  if (isLoading || questions.length === 0) {
    return (
      <div className="quiz-game-container">
        <div className="quiz-loading">
          <span>Cargando preguntas</span>
          <span className="loading-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </div>
      </div>
    );
  }

  // Pantalla de inicio - Botón "Empezar"
  if (!gameStarted) {
    return (
      <div className="quiz-game-container">
        <div className="quiz-start-screen">
          <button 
            onClick={handleBack} 
            className="carousel-nav-button group/arrow fixed top-6 left-6 z-50 absolute"
          >
            <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-full blur-lg opacity-75 group-hover/arrow:opacity-100 animate-pulse-glow"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-amber-800 to-amber-950 rounded-full transform translate-y-1.5 group-hover/arrow:translate-y-1 transition-transform duration-150"></div>
            
            <div className="relative bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 rounded-full p-4 transform group-hover/arrow:translate-y-1 transition-all duration-150 border-3 border-amber-900/70 shadow-2xl">
              <ArrowLeft className="h-8 w-8 text-amber-900 stroke-[3] group-hover/arrow:-translate-x-0.5 transition-transform duration-300" />
            </div>
          </button>

          <div className="start-content">
            <h1 className="start-title" style={{ fontFamily: "'Bungee', cursive" }}>
              ¿Listo para el desafío?
            </h1>
            <p className="start-subtitle">
              {questions.length} preguntas te esperan
            </p>
            <p className="start-info">
              Tienes 20 segundos por pregunta
            </p>
            
            <button 
              onClick={handleStartGame} 
              className="start-game-button"
              style={{ fontFamily: "'Bungee', cursive" }}
            >
              EMPEZAR
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const percentage = (score / questions.length) * 100;

    return (
      <div className="quiz-game-container-new">
        <button 
          onClick={handleBack} 
          className="carousel-nav-button group/arrow fixed top-6 left-6 z-50"
        >
          <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-full blur-lg opacity-75 group-hover/arrow:opacity-100 animate-pulse-glow"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-amber-800 to-amber-950 rounded-full transform translate-y-1.5 group-hover/arrow:translate-y-1 transition-transform duration-150"></div>
          
          <div className="relative bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 rounded-full p-4 transform group-hover/arrow:translate-y-1 transition-all duration-150 border-3 border-amber-900/70 shadow-2xl">
            <ArrowLeft className="h-8 w-8 text-amber-900 stroke-[3] group-hover/arrow:-translate-x-0.5 transition-transform duration-300" />
          </div>
        </button>

        <div className="results-container-trivia">
          {/* Card de resultados */}
          <div className="results-card-trivia">
            <h1 className="results-title-trivia" style={{ fontFamily: "'Bungee', cursive" }}>
              ¡Quiz Completado!
            </h1>

            <div className="results-score-trivia">
              <div className="score-circle-trivia">
                <span className="score-number-trivia" style={{ fontFamily: "'Bungee', cursive" }}>{score}</span>
                <span className="score-total-trivia">/ {questions.length}</span>
              </div>
              <p className="score-percentage-trivia" style={{ fontFamily: "'Bungee', cursive" }}>
                {percentage.toFixed(0)}% Correcto
              </p>
            </div>

            {/* Botones de acción */}
            <div className="results-actions-trivia">
              <button 
                onClick={handleRetry} 
                className="retry-button-trivia"
                style={{ fontFamily: "'Bungee', cursive" }}
              >
                Reintentar
              </button>
              <button 
                onClick={handleBack} 
                className="back-button-trivia"
                style={{ fontFamily: "'Bungee', cursive" }}
              >
                Volver
              </button>
            </div>
          </div>

          {/* Lista de respuestas */}
          <div className="results-list-trivia">
            {questions.map((question, index) => {
              const userAnswer = userAnswers[index];
              const isCorrect = userAnswer?.isCorrect;
              
              return (
                <div key={question.id} className="result-item-trivia">
                  <div className="result-header-trivia">
                    <span className="result-number-trivia" style={{ fontFamily: "'Bungee', cursive" }}>
                      {index + 1}
                    </span>
                    {isCorrect ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600" />
                    )}
                  </div>
                  
                  <p className="result-question-trivia">{question.question}</p>
                  
                  <div className="result-answers-trivia">
                    {userAnswer?.selectedAnswer >= 0 && (
                      <p className="user-answer-trivia">
                        Tu respuesta: <span className={isCorrect ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                          {question.options[userAnswer.selectedAnswer]}
                        </span>
                      </p>
                    )}
                    {!isCorrect && (
                      <p className="correct-answer-trivia">
                        Correcta: <span className="text-green-600 font-bold">
                          {question.options[question.correctAnswer]}
                        </span>
                      </p>
                    )}
                    <p className="verse-reference-trivia">📖 {question.verse}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-game-container-new">
      <button 
        onClick={handleBack} 
        className="carousel-nav-button group/arrow fixed top-6 left-6 z-50"
      >
        <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-full blur-lg opacity-75 group-hover/arrow:opacity-100 animate-pulse-glow"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-amber-800 to-amber-950 rounded-full transform translate-y-1.5 group-hover/arrow:translate-y-1 transition-transform duration-150"></div>
        
        <div className="relative bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 rounded-full p-4 transform group-hover/arrow:translate-y-1 transition-all duration-150 border-3 border-amber-900/70 shadow-2xl">
          <ArrowLeft className="h-8 w-8 text-amber-900 stroke-[3] group-hover/arrow:-translate-x-0.5 transition-transform duration-300" />
        </div>
      </button>

      <div className="game-container-trivia">
        {/* Contador de preguntas dentro de la card */}
        <div className="question-counter-inside">
          <span style={{ fontFamily: "'Bungee', cursive" }}>
            {currentQuestionIndex + 1}/{questions.length}
          </span>
        </div>

        {/* Barra de progreso del temporizador */}
        <div className="timer-progress-bar">
          <div 
            className="timer-progress-fill" 
            style={{ width: `${(timeLeft / 20) * 100}%` }}
          ></div>
        </div>

        {/* Panel de la Pregunta */}
        <div className="question-panel-trivia">
          <p className="question-text-trivia">
            {currentQuestion.question}
          </p>
        </div>

        {/* Panel de Respuestas */}
        <div className="answers-panel-trivia">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQuestion.correctAnswer;
            const showCorrect = isAnswered && isCorrect;
            const showIncorrect = isAnswered && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={isAnswered}
                className={`answer-btn-trivia ${showCorrect ? 'correct-trivia' : ''} ${showIncorrect ? 'wrong-trivia' : ''}`}
              >
                {String.fromCharCode(65 + index)}. {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizGame;
