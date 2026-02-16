<<<<<<< HEAD
# 🐝 AI-Powered Spelling Bee & Reading Coach

A gamified educational web application designed for elementary school students (primarily 2nd grade) to prepare for Spelling Bee contests and improve English literacy skills.

## ✨ Features

### Core Features

#### 1. Spelling Bee Engine (10 levels per grade)
- **Study Phase**: Interactive flashcards with audio pronunciation, definitions, origins, and example sentences
- **Practice Phase**: Fill-in-the-blanks with three difficulty modes
  - **Easy**: 50% of letters revealed
  - **Medium**: First letter revealed
  - **Hard**: Audio only (contest mode)
- **Gateway Test**: Pass/fail test to unlock next level (80% required)
- **Phonics Feedback**: Educational explanations for spelling errors

#### 2. Reading Comprehension
- AI-generated story packs (5 stories per level)
- Progressive complexity:
  - Levels 1-3: Short fables with literal questions
  - Levels 4-7: Narrative stories with inference questions
  - Levels 8-10: Complex stories with vocabulary/theme questions
- Interactive story reader with:
  - Adjustable font size
  - Click-to-hear word pronunciation
  - Read-aloud feature
- Comprehension quizzes (70% required to pass)

#### 3. Gamification & Engagement
- **Bee Avatar System**: Character evolves through 3 stages (Baby → Worker → Queen)
- **XP & Leveling**: Earn experience points for completing activities
- **The Golden Hive**: Gallery of mastered words with achievement tracking
- **Daily Streaks**: Track consecutive days of practice with milestone rewards
- **Progress Dashboard**: Visual calendar and achievement badges

### Literacy Enhancement Features

- **Phonics Feedback Engine**: 50+ phonics rules for spelling guidance
- **Dictation Mode**: Full sentence typing practice with grammar validation
- **Root Word Analyzer**: Interactive prefix/root/suffix breakdown
- **Fluency Tracker**: Optional read-aloud recording and WPM tracking

## 🏗️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS (child-friendly design)
- **Routing**: React Router v6
- **Build Tool**: Vite
- **Audio**: Web Speech API (browser-based TTS/STT)

### Backend
- **Server**: Node.js with Express
- **Database**: SQLite with better-sqlite3
- **AI**: OpenAI GPT-4 for content generation
- **Security**: Helmet, CORS, rate limiting

## 📁 Project Structure

```
english_app/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── Avatar/     # Bee character
│   │   │   ├── SpellingBee/
│   │   │   │   ├── Flashcard.tsx
│   │   │   │   ├── FillInBlanks.tsx
│   │   │   │   └── GatewayTest.tsx
│   │   │   ├── Reading/
│   │   │   │   ├── StoryReader.tsx
│   │   │   │   └── ComprehensionQuiz.tsx
│   │   │   ├── Gamification/
│   │   │   │   ├── GoldenHive.tsx
│   │   │   │   └── ProgressTracker.tsx
│   │   │   └── Literacy/
│   │   │       ├── DictationMode.tsx
│   │   │       └── RootWordAnalyzer.tsx
│   │   ├── pages/          # Main app views
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API client
│   │   ├── contexts/       # State management
│   │   └── utils/          # Helper functions
│   └── package.json
├── server/                 # Express Backend
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── services/
│   │   │   ├── openai.service.ts
│   │   │   └── content.generator.ts
│   │   ├── database/
│   │   │   ├── schema.sql
│   │   │   └── db.ts
│   │   └── middleware/     # Auth, validation
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   cd english_app
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure environment variables**
   ```bash
   cd ../server
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```
   PORT=3001
   OPENAI_API_KEY=your_openai_api_key_here
   NODE_ENV=development
   DATABASE_PATH=./data/spelling_bee.db
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   Server will run on http://localhost:3001

2. **Start the frontend (in a new terminal)**
   ```bash
   cd client
   npm run dev
   ```
   Client will run on http://localhost:3000

3. **Open your browser**
   Navigate to http://localhost:3000

### First-Time Setup

1. Create a new student profile (or multiple for siblings)
2. The database will be automatically created on first run
3. Content will be generated on-demand and cached for performance

## 📊 Database Schema

The SQLite database includes the following tables:

- **users**: Student profiles
- **spelling_progress**: Tracks completion, scores, difficulty modes
- **mastered_words**: Words in "The Golden Hive"
- **reading_progress**: Stories completed and quiz scores
- **daily_streaks**: Engagement tracking
- **avatar_state**: Current bee level and appearance
- **content_cache**: Cached AI-generated content
- **word_attempts**: Phonics feedback history

## 🎨 UI/UX Design Principles

- **Large, readable fonts** (minimum 18px body text)
- **High contrast colors** (WCAG AAA compliance)
- **Generous spacing** and touch targets (44x44px minimum)
- **Positive reinforcement** animations
- **Child-friendly color palette**: Warm yellows, sky blues, grass greens
- **No negative feedback** - only encouraging messages

## 🔐 Security Features

- API keys secured server-side only
- Rate limiting on content generation endpoints
- Input validation and sanitization
- CORS protection
- Helmet security headers

## ⚡ Performance Optimizations

- Content caching in SQLite database
- localStorage for offline capabilities
- Lazy loading of components
- Optimized image assets
- Efficient database queries with indexes

## 📱 Browser Support

- Chrome/Edge (recommended for best Web Speech API support)
- Firefox
- Safari (limited Web Speech API support)

## 🧪 Testing

```bash
# Run server tests
cd server
npm test

# Run client tests
cd client
npm test
```

## 🚢 Deployment

### Production Build

1. **Build the client**
   ```bash
   cd client
   npm run build
   ```

2. **Build the server**
   ```bash
   cd server
   npm run build
   ```

3. **Set production environment variables**
   ```bash
   NODE_ENV=production
   FRONTEND_URL=https://your-domain.com
   ```

4. **Start the production server**
   ```bash
   cd server
   npm start
   ```

### Deployment Options

- **Vercel/Netlify**: Frontend static hosting
- **Heroku/Railway**: Full-stack deployment
- **AWS/DigitalOcean**: VPS hosting
- **Docker**: Containerized deployment

## 🤝 Contributing

This is a personal educational project. Feel free to fork and customize for your needs!

## 📝 License

MIT License - feel free to use this project for educational purposes.

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Web Speech API for browser-based TTS
- Tailwind CSS for styling framework
- The educational community for phonics rules and best practices

## 📧 Support

For issues or questions, please create an issue in the repository.

---

Built with ❤️ for young learners preparing for spelling bee contests and improving their literacy skills.
=======
# BuzzySpell
Learn english in a fun way
>>>>>>> ca4dadc6e7c1409dbbc09004f96560cd281bc78a
