import React, { useState } from 'react';
import { Story } from '../../services/api';
import speechService from '../../utils/speechService';

interface StoryReaderProps {
  story: Story;
  onComplete: () => void;
}

export default function StoryReader({ story, onComplete }: StoryReaderProps) {
  const [fontSize, setFontSize] = useState(20);
  const [isReading, setIsReading] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const handleReadAloud = async () => {
    setIsReading(true);
    try {
      await speechService.speak(story.text, { rate: 0.85 });
    } catch (error) {
      console.error('Speech error:', error);
    } finally {
      setIsReading(false);
    }
  };

  const handleStopReading = () => {
    speechService.stop();
    setIsReading(false);
  };

  const handleWordClick = async (word: string) => {
    const cleanWord = word.replace(/[.,!?;:]/g, '');
    setSelectedWord(cleanWord);
    
    try {
      await speechService.speak(cleanWord);
    } catch (error) {
      console.error('Speech error:', error);
    }
  };

  const renderInteractiveText = () => {
    const words = story.text.split(' ');
    return words.map((word, idx) => (
      <span
        key={idx}
        onClick={() => handleWordClick(word)}
        className="cursor-pointer hover:bg-yellow-200 hover:px-1 rounded transition-all"
        title="Click to hear this word"
      >
        {word}{' '}
      </span>
    ));
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 py-8">
      <div className="card max-w-4xl w-full">
        {/* Header */}
        <div className="mb-6 text-center border-b-2 border-bee-yellow pb-4">
          <h1 className="text-4xl font-bold text-bee-orange mb-2">
            {story.title}
          </h1>
          <div className="flex justify-center gap-4 text-sm text-gray-600">
            <span>📊 {story.difficulty_level}</span>
            <span>📝 {story.word_count} words</span>
            <span>🏷️ {story.themes.join(', ')}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-4 mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <label className="text-lg font-semibold">Font Size:</label>
            <button
              onClick={() => setFontSize(Math.max(16, fontSize - 2))}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
            >
              A-
            </button>
            <span className="px-3">{fontSize}px</span>
            <button
              onClick={() => setFontSize(Math.min(32, fontSize + 2))}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
            >
              A+
            </button>
          </div>

          <div className="flex gap-2">
            {!isReading ? (
              <button
                onClick={handleReadAloud}
                className="btn-secondary"
              >
                📖 Read Aloud
              </button>
            ) : (
              <button
                onClick={handleStopReading}
                className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                ⏸️ Stop Reading
              </button>
            )}
          </div>
        </div>

        {/* Story text */}
        <div 
          className="prose prose-lg max-w-none leading-relaxed text-justify mb-8"
          style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
        >
          <p>{renderInteractiveText()}</p>
        </div>

        {/* Word info popup */}
        {selectedWord && (
          <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
            <p className="text-xl">
              <strong>Selected word:</strong> <span className="text-blue-600">{selectedWord}</span>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              💡 Click any word to hear it pronounced!
            </p>
          </div>
        )}

        {/* Complete button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={onComplete}
            className="btn-primary text-xl"
          >
            I've Finished Reading →
          </button>
        </div>
      </div>
    </div>
  );
}
