# ⚡ Quick Start Guide

Get the Spelling Bee & Reading Coach app running in 5 minutes!

## Prerequisites

- ✅ Node.js v18+ installed
- ✅ OpenAI API key

## Step 1: Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

## Step 2: Configure API Key

1. Copy `server/.env.example` to `server/.env`
2. Add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```

## Step 3: Start the App

### Option A: Automated Script (Windows)
```bash
# From project root
start.bat
```

### Option B: Automated Script (Mac/Linux)
```bash
# From project root
chmod +x start.sh
./start.sh
```

### Option C: Manual Start
```bash
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Client
cd client
npm run dev
```

## Step 4: Open Browser

Navigate to: **http://localhost:3000**

## Step 5: Create Student Profile

1. Click "Create New Student"
2. Enter name and grade
3. Start learning!

---

## What's Included?

### 📝 Spelling Bee Module
- Study flashcards
- Practice with 3 difficulty modes
- Gateway tests to level up

### 📚 Reading Comprehension
- AI-generated stories
- Interactive reading
- Comprehension quizzes

### 🎮 Gamification
- Evolving bee avatar
- Golden Hive word collection
- Daily streak tracking

### 🎓 Literacy Tools
- Dictation practice
- Root word analyzer
- Phonics feedback

---

## Troubleshooting

**Port already in use?**
- Change port in `server/.env`: `PORT=3002`

**API errors?**
- Verify your OpenAI API key in `server/.env`
- Check your OpenAI account has credits

**Database errors?**
- Delete `server/data/spelling_bee.db` and restart

---

## Full Documentation

For detailed setup and features, see:
- [README.md](README.md) - Complete documentation
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup instructions

---

🐝 **Happy Learning!** 📚
