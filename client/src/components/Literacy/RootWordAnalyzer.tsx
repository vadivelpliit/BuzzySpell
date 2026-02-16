import React, { useState } from 'react';

interface WordPart {
  prefix?: string;
  root: string;
  suffix?: string;
}

interface WordAnalysis extends WordPart {
  prefixMeaning?: string;
  rootMeaning: string;
  suffixMeaning?: string;
  fullMeaning: string;
}

const wordDatabase: Record<string, WordAnalysis> = {
  unhappy: {
    prefix: 'un',
    root: 'happy',
    suffix: '',
    prefixMeaning: 'not',
    rootMeaning: 'feeling good',
    fullMeaning: 'not happy; sad',
  },
  replay: {
    prefix: 're',
    root: 'play',
    suffix: '',
    prefixMeaning: 'again',
    rootMeaning: 'to have fun',
    fullMeaning: 'to play again',
  },
  teacher: {
    prefix: '',
    root: 'teach',
    suffix: 'er',
    rootMeaning: 'to help learn',
    suffixMeaning: 'person who',
    fullMeaning: 'a person who teaches',
  },
  kindness: {
    prefix: '',
    root: 'kind',
    suffix: 'ness',
    rootMeaning: 'nice, caring',
    suffixMeaning: 'state of being',
    fullMeaning: 'the state of being kind',
  },
  unfriendly: {
    prefix: 'un',
    root: 'friend',
    suffix: 'ly',
    prefixMeaning: 'not',
    rootMeaning: 'a person you like',
    suffixMeaning: 'in a way that is',
    fullMeaning: 'not in a friendly way',
  },
  wonderful: {
    prefix: '',
    root: 'wonder',
    suffix: 'ful',
    rootMeaning: 'amazement',
    suffixMeaning: 'full of',
    fullMeaning: 'full of wonder; amazing',
  },
  rebuild: {
    prefix: 're',
    root: 'build',
    suffix: '',
    prefixMeaning: 'again',
    rootMeaning: 'to make something',
    fullMeaning: 'to build again',
  },
  colorful: {
    prefix: '',
    root: 'color',
    suffix: 'ful',
    rootMeaning: 'hue, shade',
    suffixMeaning: 'full of',
    fullMeaning: 'having many colors',
  },
  disappear: {
    prefix: 'dis',
    root: 'appear',
    suffix: '',
    prefixMeaning: 'opposite of',
    rootMeaning: 'to show up',
    fullMeaning: 'to stop being visible',
  },
  happily: {
    prefix: '',
    root: 'happy',
    suffix: 'ly',
    rootMeaning: 'feeling good',
    suffixMeaning: 'in a way',
    fullMeaning: 'in a happy way',
  },
};

export default function RootWordAnalyzer() {
  const [inputWord, setInputWord] = useState('');
  const [analysis, setAnalysis] = useState<WordAnalysis | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleAnalyze = () => {
    const word = inputWord.toLowerCase().trim();
    
    if (wordDatabase[word]) {
      setAnalysis(wordDatabase[word]);
      setNotFound(false);
    } else {
      setAnalysis(null);
      setNotFound(true);
    }
  };

  const handleTryExample = (word: string) => {
    setInputWord(word);
    setAnalysis(wordDatabase[word]);
    setNotFound(false);
  };

  const exampleWords = Object.keys(wordDatabase).slice(0, 6);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-bee-orange mb-4">
            🔍 Root Word Analyzer
          </h1>
          <p className="text-xl text-gray-700">
            Break words into parts to understand their meaning!
          </p>
        </div>

        {/* Input card */}
        <div className="card mb-6">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={inputWord}
              onChange={(e) => setInputWord(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
              placeholder="Enter a word..."
              className="input-field"
            />
            <button
              onClick={handleAnalyze}
              disabled={!inputWord.trim()}
              className={`btn-primary whitespace-nowrap ${!inputWord.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Analyze
            </button>
          </div>

          {/* Example words */}
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="text-sm text-gray-600">Try these:</span>
            {exampleWords.map((word) => (
              <button
                key={word}
                onClick={() => handleTryExample(word)}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 text-sm"
              >
                {word}
              </button>
            ))}
          </div>
        </div>

        {/* Analysis result */}
        {analysis && (
          <div className="card bg-gradient-to-br from-hive-light to-hive-medium">
            <h2 className="text-3xl font-bold mb-6 text-center text-bee-orange">
              Word Breakdown
            </h2>

            {/* Visual breakdown */}
            <div className="flex justify-center items-center gap-2 mb-8 flex-wrap">
              {analysis.prefix && (
                <div className="card bg-gradient-to-br from-blue-100 to-blue-200 text-center min-w-[120px]">
                  <p className="text-sm text-gray-600 mb-1">Prefix</p>
                  <p className="text-3xl font-bold text-blue-700">{analysis.prefix}</p>
                  <p className="text-sm text-gray-700 mt-1">({analysis.prefixMeaning})</p>
                </div>
              )}
              
              {analysis.prefix && <span className="text-3xl font-bold">+</span>}
              
              <div className="card bg-gradient-to-br from-green-100 to-green-200 text-center min-w-[120px]">
                <p className="text-sm text-gray-600 mb-1">Root Word</p>
                <p className="text-3xl font-bold text-green-700">{analysis.root}</p>
                <p className="text-sm text-gray-700 mt-1">({analysis.rootMeaning})</p>
              </div>
              
              {analysis.suffix && <span className="text-3xl font-bold">+</span>}
              
              {analysis.suffix && (
                <div className="card bg-gradient-to-br from-orange-100 to-orange-200 text-center min-w-[120px]">
                  <p className="text-sm text-gray-600 mb-1">Suffix</p>
                  <p className="text-3xl font-bold text-orange-700">{analysis.suffix}</p>
                  <p className="text-sm text-gray-700 mt-1">({analysis.suffixMeaning})</p>
                </div>
              )}
            </div>

            {/* Full meaning */}
            <div className="card bg-gradient-to-br from-bee-yellow to-bee-gold text-center">
              <h3 className="text-2xl font-bold mb-3">Full Meaning</h3>
              <p className="text-3xl font-bold text-gray-900">
                {inputWord}
              </p>
              <p className="text-xl text-gray-800 mt-2">
                {analysis.fullMeaning}
              </p>
            </div>
          </div>
        )}

        {/* Not found message */}
        {notFound && (
          <div className="card bg-yellow-50 border-2 border-yellow-400 text-center">
            <p className="text-2xl mb-2">🤔</p>
            <p className="text-xl text-gray-700">
              Word not found in our database yet!
            </p>
            <p className="text-gray-600 mt-2">
              Try one of the example words above.
            </p>
          </div>
        )}

        {/* Educational info */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="card bg-blue-50">
            <h3 className="text-lg font-bold mb-2 text-blue-800">📘 Prefixes</h3>
            <p className="text-sm text-gray-700 mb-2">Come at the beginning</p>
            <ul className="text-sm space-y-1">
              <li><strong>un-</strong> = not</li>
              <li><strong>re-</strong> = again</li>
              <li><strong>dis-</strong> = opposite</li>
              <li><strong>pre-</strong> = before</li>
            </ul>
          </div>
          
          <div className="card bg-green-50">
            <h3 className="text-lg font-bold mb-2 text-green-800">🌱 Root Words</h3>
            <p className="text-sm text-gray-700 mb-2">The main meaning</p>
            <ul className="text-sm space-y-1">
              <li>Base form of the word</li>
              <li>Carries core meaning</li>
              <li>Can stand alone</li>
            </ul>
          </div>
          
          <div className="card bg-orange-50">
            <h3 className="text-lg font-bold mb-2 text-orange-800">📙 Suffixes</h3>
            <p className="text-sm text-gray-700 mb-2">Come at the end</p>
            <ul className="text-sm space-y-1">
              <li><strong>-er</strong> = person who</li>
              <li><strong>-ly</strong> = in a way</li>
              <li><strong>-ful</strong> = full of</li>
              <li><strong>-ness</strong> = state of</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
