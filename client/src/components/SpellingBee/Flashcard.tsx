import React, { useState } from 'react';
import { SpellingWord } from '../../services/api';
import speechService from '../../utils/speechService';

interface FlashcardProps {
  word: SpellingWord;
  onNext: () => void;
  currentIndex: number;
  totalWords: number;
}

export default function Flashcard({ word, onNext, currentIndex, totalWords }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = async () => {
    setIsSpeaking(true);
    try {
      await speechService.speak(word.word);
    } catch (error) {
      console.error('Speech error:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Progress indicator */}
      <div className="mb-8 text-center">
        <p className="text-2xl font-bold text-bee-orange">
          Word {currentIndex + 1} of {totalWords}
        </p>
        <div className="w-64 h-4 bg-gray-300 rounded-full mt-2 overflow-hidden">
          <div 
            className="h-full bg-bee-yellow transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalWords) * 100}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div className={`flip-card w-full max-w-2xl h-96 ${isFlipped ? 'flipped' : ''}`}>
        <div className="flip-card-inner relative w-full h-full">
          {/* Front side */}
          <div className="flip-card-front absolute w-full h-full">
            <div className="card h-full flex flex-col items-center justify-center bg-gradient-to-br from-bee-yellow to-bee-gold">
              <h1 className="text-6xl font-bold mb-8 text-gray-900 animate-float">
                {word.word}
              </h1>
              
              <button
                onClick={handleSpeak}
                disabled={isSpeaking}
                className="btn-primary mb-4 text-2xl"
              >
                {isSpeaking ? '🔊 Speaking...' : '🔊 Hear It'}
              </button>

              <button
                onClick={handleFlip}
                className="text-xl text-gray-700 underline hover:text-gray-900"
              >
                Flip to see definition →
              </button>
            </div>
          </div>

          {/* Back side */}
          <div className="flip-card-back absolute w-full h-full">
            <div className="card h-full flex flex-col items-center justify-between p-8 bg-gradient-to-br from-sky to-blue-400 text-white">
              <div className="text-center flex-1 flex flex-col justify-center">
                <h2 className="text-4xl font-bold mb-4">{word.word}</h2>
                
                <div className="text-left max-w-xl mx-auto space-y-4 text-xl">
                  <div>
                    <strong className="block text-2xl mb-2">📖 Definition:</strong>
                    <p>{word.definition}</p>
                  </div>
                  
                  <div>
                    <strong className="block text-2xl mb-2">🌍 Origin:</strong>
                    <p>{word.origin}</p>
                  </div>
                  
                  <div>
                    <strong className="block text-2xl mb-2">🔤 Phonics:</strong>
                    <p>{word.phonics_pattern}</p>
                  </div>
                  
                  <div>
                    <strong className="block text-2xl mb-2">💡 Example:</strong>
                    <p className="italic">"{word.example_sentence}"</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleFlip}
                className="text-xl underline hover:text-gray-200 mt-4"
              >
                ← Flip back
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Next button */}
      <button
        onClick={onNext}
        className="btn-primary mt-8 text-2xl"
      >
        Next Word →
      </button>
    </div>
  );
}
