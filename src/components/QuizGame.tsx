import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, XCircle } from 'lucide-react';
import quizData from '../data/quiz-questions.json';

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

const QuizGame: React.FC = () => {
  const navigate = useNavigate();
  const { category, level } = useParams<{ category: string; level: string; section: string }>();
  
  // Cargar preguntas inmediatamente de forma síncrona
  const loadQuestions = (): Question[] => {
    try {
      const levelKey = level || '1';
      const chapters = quizData.categories.daniel.chapters as any;
      const chapterData = chapters[levelKey];
      
      if (chapterData && chapterData.questions) {
        return chapterData.questions as Question[];
      }
      return [];
    } catch (error) {
      console.error('Error loading questions:', error);
      return [];
    }
  };

  const [questions] = useState<Question[]>(loadQuestions());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  // Temporizador
  useEffect(() => {
    if (showResults || isAnswered || questions.length === 0) return;

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
  }, [currentQuestionIndex, showResults, isAnswered, questions]);

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
    setCurrentQuestionIndex(0);
    setTimeLeft(20);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setShowResults(false);
    setIsAnswered(false);
  };

  if (questions.length === 0) {
    return (
      <div className="quiz-game-container">
        <div className="quiz-loading">
          <span>Cargando</span>
          <span className="loading-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const percentage = (score / questions.length) * 100;

    return (
      <div className="quiz-game-container">
        <div className="quiz-results">
          <button onClick={handleBack} className="quiz-back-button">
            <ArrowLeft className="h-6 w-6" />
          </button>

          <h1 className="results-title" style={{ fontFamily: "'Bungee', cursive" }}>
            ¡Quiz Completado!
          </h1>

          <div className="results-score">
            <div className="score-circle">
              <span className="score-number">{score}</span>
              <span className="score-total">/ {questions.length}</span>
            </div>
            <p className="score-percentage">{percentage.toFixed(0)}% Correcto</p>
          </div>

          <div className="results-list">
            {questions.map((question, index) => {
              const userAnswer = userAnswers[index];
              const isCorrect = userAnswer?.isCorrect;
              
              return (
                <div key={question.id} className={`result-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="result-header">
                    <span className="result-number">Pregunta {index + 1}</span>
                    {isCorrect ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-500" />
                    )}
                  </div>
                  
                  <p className="result-question">{question.question}</p>
                  
                  <div className="result-answers">
                    {userAnswer?.selectedAnswer >= 0 && (
                      <p className="user-answer">
                        Tu respuesta: <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                          {question.options[userAnswer.selectedAnswer]}
                        </span>
                      </p>
                    )}
                    {!isCorrect && (
                      <p className="correct-answer">
                        Respuesta correcta: <span className="text-green-600">
                          {question.options[question.correctAnswer]}
                        </span>
                      </p>
                    )}
                    <p className="verse-reference">📖 {question.verse}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="results-actions">
            <button onClick={handleRetry} className="retry-button">
              Intentar de nuevo
            </button>
            <button onClick={handleBack} className="back-button">
              Volver a secciones
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="quiz-game-container">
      <button onClick={handleBack} className="quiz-back-button">
        <ArrowLeft className="h-6 w-6" />
      </button>

      <div className="quiz-game-card">
        {/* Barra de progreso */}
        <div className="quiz-progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Contador de preguntas */}
        <div className="question-counter">
          Pregunta {currentQuestionIndex + 1} de {questions.length}
        </div>

        {/* Temporizador */}
        <div className="timer-container">
          <Clock className="h-8 w-8 text-amber-500" />
          <div className="timer-bar">
            <div 
              className="timer-fill" 
              style={{ width: `${(timeLeft / 20) * 100}%` }}
            ></div>
          </div>
          <span className="timer-text">{timeLeft}s</span>
        </div>

        {/* Pregunta */}
        <div className="question-card">
          <h2 className="question-text">{currentQuestion.question}</h2>
        </div>

        {/* Opciones */}
        <div className="options-grid">
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
                className={`option-button ${isSelected ? 'selected' : ''} ${showCorrect ? 'correct' : ''} ${showIncorrect ? 'incorrect' : ''}`}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
                {showCorrect && <CheckCircle className="h-6 w-6" />}
                {showIncorrect && <XCircle className="h-6 w-6" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizGame;
