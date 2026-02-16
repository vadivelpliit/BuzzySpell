import React, { useState } from 'react';
import { Question } from '../../services/api';

interface ComprehensionQuizProps {
  questions: Question[];
  storyTitle: string;
  onComplete: (passed: boolean, score: number) => void;
}

export default function ComprehensionQuiz({ questions, storyTitle, onComplete }: ComprehensionQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const PASSING_SCORE = 0.7; // 70% to pass

  const handleSelectAnswer = (optionIndex: number) => {
    if (showFeedback) return;
    setSelectedAnswer(optionIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    const correct = selectedAnswer === currentQuestion.correct_answer;
    setAnswers([...answers, correct]);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setShowResults(true);
      const score = answers.filter(a => a).length;
      const passed = (score + (showFeedback && answers[answers.length - 1] ? 1 : 0)) / questions.length >= PASSING_SCORE;
      setTimeout(() => {
        onComplete(passed, score);
      }, 3000);
    }
  };

  if (showResults) {
    const score = answers.filter(a => a).length;
    const passed = score / questions.length >= PASSING_SCORE;

    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className={`card max-w-2xl w-full text-center ${
          passed ? 'bg-gradient-to-br from-green-100 to-green-200' : 'bg-gradient-to-br from-orange-100 to-orange-200'
        }`}>
          <h1 className="text-5xl font-bold mb-6">
            {passed ? '🎉 Great Job!' : '📚 Keep Reading!'}
          </h1>
          
          <p className="text-2xl mb-4">Quiz Complete for:</p>
          <p className="text-3xl font-bold text-bee-orange mb-8">"{storyTitle}"</p>
          
          <div className="text-3xl mb-8">
            <p className="mb-2">Your Score:</p>
            <p className="text-6xl font-bold text-bee-gold">
              {score} / {questions.length}
            </p>
            <p className="text-2xl mt-2 text-gray-600">
              ({Math.round((score / questions.length) * 100)}%)
            </p>
          </div>

          {passed ? (
            <div className="space-y-4">
              <p className="text-2xl">
                Excellent comprehension! Story complete! 📖✨
              </p>
              <p className="text-xl text-gray-600">
                You understood the story very well!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-2xl">
                You need {Math.ceil(questions.length * PASSING_SCORE)} correct to pass.
              </p>
              <p className="text-xl text-gray-600">
                Try reading the story again more carefully!
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isCorrect = showFeedback && selectedAnswer === currentQuestion.correct_answer;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Progress */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-bee-orange mb-4">
          📝 Comprehension Quiz
        </h2>
        <p className="text-xl mb-2">"{storyTitle}"</p>
        <p className="text-2xl font-bold">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
        <div className="w-64 h-4 bg-gray-300 rounded-full mt-2 mx-auto overflow-hidden">
          <div 
            className="h-full bg-bee-yellow transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="card max-w-3xl w-full">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">
          {currentQuestion.question}
        </h3>

        {/* Options */}
        <div className="space-y-4 mb-6">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedAnswer === idx;
            const isCorrectAnswer = idx === currentQuestion.correct_answer;
            
            let className = "p-4 border-4 rounded-xl cursor-pointer transition-all text-lg ";
            
            if (!showFeedback) {
              className += isSelected 
                ? "border-bee-yellow bg-bee-yellow bg-opacity-20" 
                : "border-gray-300 hover:border-bee-gold hover:bg-gray-50";
            } else {
              if (isCorrectAnswer) {
                className += "border-green-500 bg-green-100";
              } else if (isSelected && !isCorrectAnswer) {
                className += "border-red-500 bg-red-100";
              } else {
                className += "border-gray-300 bg-gray-50";
              }
            }

            return (
              <div
                key={idx}
                onClick={() => handleSelectAnswer(idx)}
                className={className}
              >
                <div className="flex items-center">
                  <span className="text-2xl font-bold mr-4 text-bee-orange">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span>{option}</span>
                  {showFeedback && isCorrectAnswer && (
                    <span className="ml-auto text-2xl">✓</span>
                  )}
                  {showFeedback && isSelected && !isCorrectAnswer && (
                    <span className="ml-auto text-2xl">✗</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`p-4 rounded-lg mb-6 ${
            isCorrect ? 'bg-green-100 border-2 border-green-500' : 'bg-orange-100 border-2 border-orange-400'
          }`}>
            <p className="text-xl font-bold mb-2">
              {isCorrect ? '🎉 Correct!' : '💭 Not quite...'}
            </p>
            <p className="text-lg">
              <strong>Explanation:</strong> {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          {!showFeedback ? (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className={`btn-primary ${selectedAnswer === null ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="btn-primary"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next Question →' : 'See Results'}
            </button>
          )}
        </div>

        {/* Score tracker */}
        {answers.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-300 text-center">
            <p className="text-lg">
              Current Score: <span className="font-bold text-green-600">
                {answers.filter(a => a).length} / {answers.length}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
