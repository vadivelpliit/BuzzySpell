# 🚀 Setup Guide - Spelling Bee & Reading Coach

Complete step-by-step guide to get the application running.

## Prerequisites Checklist

Before you begin, ensure you have:

- [ ] Node.js v18+ installed ([Download](https://nodejs.org/))
- [ ] npm (comes with Node.js)
- [ ] OpenAI API account ([Sign up](https://platform.openai.com/))
- [ ] Code editor (VS Code recommended)
- [ ] Terminal/Command Prompt access

## Step 1: Verify Node.js Installation

Open your terminal and run:

```bash
node --version
npm --version
```

You should see version numbers. If not, install Node.js first.

## Step 2: Get Your OpenAI API Key

1. Go to https://platform.openai.com/
2. Sign in or create an account
3. Navigate to API Keys section
4. Click "Create new secret key"
5. Copy the key (you won't be able to see it again!)
6. Keep it safe - you'll need it in Step 4

## Step 3: Install Dependencies

### Backend (Server)

```bash
cd server
npm install
```

This will install:
- express (web server)
- better-sqlite3 (database)
- openai (AI integration)
- cors, helmet (security)
- And other dependencies...

### Frontend (Client)

```bash
cd ../client
npm install
```

This will install:
- react, react-dom (UI framework)
- tailwindcss (styling)
- axios (API calls)
- react-router-dom (navigation)
- And other dependencies...

## Step 4: Configure Environment Variables

1. Navigate to the server folder:
   ```bash
   cd ../server
   ```

2. Copy the example environment file:
   ```bash
   # On Windows
   copy .env.example .env
   
   # On Mac/Linux
   cp .env.example .env
   ```

3. Open `.env` file in your editor and add your OpenAI API key:
   ```env
   PORT=3001
   OPENAI_API_KEY=sk-your-actual-key-here
   NODE_ENV=development
   DATABASE_PATH=./data/spelling_bee.db
   ```

## Step 5: Initialize the Database

The database will be created automatically when you first start the server, but you can also run migrations manually:

```bash
cd server
npm run migrate
```

This creates all necessary tables in SQLite.

## Step 6: (Optional) Pre-Generate Content

To speed up first-time usage, pre-generate word lists and stories:

```bash
cd server
npx tsx src/scripts/pregenerate.ts
```

⚠️ **Warning**: This will make 20 API calls to OpenAI (10 for spelling words + 10 for stories).
Estimated cost: ~$1-2 depending on your OpenAI plan.

You can skip this step - content will be generated on-demand when users access each level.

## Step 7: Start the Application

### Terminal 1 - Start Backend Server

```bash
cd server
npm run dev
```

You should see:
```
🐝 Spelling Bee Server running on port 3001
📚 Environment: development
🔑 OpenAI API Key: ✓ Configured
Database migrations completed successfully
```

### Terminal 2 - Start Frontend Client

Open a NEW terminal window:

```bash
cd client
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

## Step 8: Access the Application

1. Open your web browser
2. Navigate to: **http://localhost:3000**
3. You should see the welcome screen!

## Step 9: Create Your First Student

1. Click "Create New Student"
2. Enter the student's name
3. Select their grade level (2 is default)
4. Click "Create Student"

You're ready to start learning! 🎉

## Troubleshooting

### Problem: Port already in use

**Error**: `Port 3001 already in use`

**Solution**: 
- Stop any other applications using port 3001
- Or change the port in `server/.env`: `PORT=3002`

### Problem: OpenAI API errors

**Error**: `Invalid API key` or `Rate limit exceeded`

**Solutions**:
- Verify your API key is correct in `server/.env`
- Check your OpenAI account has credits
- Check your API key permissions at platform.openai.com

### Problem: Database errors

**Error**: `Database locked` or `Cannot open database`

**Solutions**:
- Make sure only one instance of the server is running
- Delete `server/data/spelling_bee.db` and restart (will lose data)
- Check file permissions on the `server/data/` folder

### Problem: Dependencies not installing

**Error**: npm install fails

**Solutions**:
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` folder and `package-lock.json`
- Run `npm install` again
- Update npm: `npm install -g npm@latest`

### Problem: Web Speech API not working

**Error**: Audio doesn't play

**Solutions**:
- Use Chrome or Edge browser (best support)
- Check browser permissions for audio
- Check system audio is not muted
- Try different browser if issues persist

## File Structure Quick Reference

```
english_app/
├── server/
│   ├── .env                    ← Your API key here
│   ├── src/
│   │   ├── index.ts           ← Server entry point
│   │   ├── database/
│   │   │   └── schema.sql     ← Database structure
│   │   └── services/
│   │       └── openai.service.ts  ← AI integration
│   └── data/
│       └── spelling_bee.db    ← Database (auto-created)
│
└── client/
    ├── src/
    │   ├── App.tsx            ← Main app component
    │   ├── pages/             ← Main pages
    │   └── components/        ← UI components
    └── public/
```

## Next Steps

1. ✅ Application is running
2. 📝 Explore the Spelling Bee module
3. 📚 Try reading a story
4. 🏆 Build your Golden Hive
5. 📊 Track your daily streaks

## Additional Resources

- **Full Documentation**: See README.md
- **API Documentation**: Check server/src/routes/ folder
- **Component Examples**: Check client/src/components/
- **OpenAI Documentation**: https://platform.openai.com/docs

## Getting Help

If you encounter issues:

1. Check this troubleshooting section
2. Review server and client terminal logs
3. Check browser console (F12) for errors
4. Verify all environment variables are set
5. Ensure database has proper permissions

---

Happy Learning! 🐝📚✨
