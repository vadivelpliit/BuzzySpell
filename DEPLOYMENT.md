# Deployment Guide: Railway (Backend) + Vercel (Frontend)

## Is the latest code pushed to main?

**Check before deploying:** Run `git status`. If you have uncommitted changes (e.g. `server/.env.example`), either commit and push first, or be aware that only what’s on `origin/main` will be deployed.

---

## 1. Deploy backend to Railway

### 1.1 Create a Railway project

1. Go to [railway.app](https://railway.app) and sign in (e.g. with GitHub).
2. Click **New Project** → **Deploy from GitHub repo**.
3. Select your `english_app` repo.
4. After the project is created, open the new service.

### 1.2 Set root directory and build

1. In the service, go to **Settings** (or **Variables** area).
2. Set **Root Directory** to: `server`
3. **Build Command:** `npm install && npm run build`
4. **Start Command:** `npm run start`
5. **Watch Paths** (optional): `server/**` so only server changes trigger deploys.

Railway will set `PORT` automatically; your app already uses `process.env.PORT`.

### 1.3 Environment variables (Railway)

In the service → **Variables**, add:

| Variable          | Value / Note |
|-------------------|--------------|
| `NODE_ENV`        | `production` |
| `OPENAI_API_KEY`  | Your OpenAI API key |
| `FRONTEND_URL`    | Your Vercel app URL, e.g. `https://your-app.vercel.app` (no trailing slash). Required for CORS. |
| `DATABASE_PATH`   | e.g. `./data/spelling_bee.db` (default). On Railway the filesystem is ephemeral; data is lost on redeploy unless you add a **Volume** and set this path inside the volume. |

### 1.4 Persisting SQLite (optional)

1. In the same service, go to **Settings** → **Volumes**.
2. Click **Add Volume**. Railway will ask for a **Mount Path** — this is a path *you choose* (not something you look up). Type: **`/data`**
3. In **Variables**, set: **`DATABASE_PATH=/data/spelling_bee.db`** (so the DB file lives on the volume).
4. Redeploy so the app uses the volume.

### 1.5 Deploy and get backend URL

1. Trigger a deploy (push to `main` or **Deploy** in the dashboard).
2. In **Settings** → **Networking**, add a **Public Domain** (e.g. `your-app-backend.up.railway.app`).
3. Your API base URL is: `https://your-app-backend.up.railway.app`  
   So the client should call: `https://your-app-backend.up.railway.app/api`.

---

## 2. Deploy frontend to Vercel

### 2.1 Import project

1. Go to [vercel.com](https://vercel.com) and sign in (e.g. with GitHub).
2. **Add New** → **Project** → Import your `english_app` repo.

### 2.2 Configure root and build

1. Set **Root Directory** to: `client` (then **Edit** next to it and type `client`).
2. **Framework Preset:** Vite (usually auto-detected).
3. **Build Command:** `npm run build` (default is fine).
4. **Output Directory:** `dist` (default for Vite).

### 2.3 Environment variable (Vercel)

In **Settings** → **Environment Variables** add:

| Name            | Value |
|-----------------|--------|
| `VITE_API_URL`  | Your Railway API URL **including `/api`**, no trailing slash. Example: `https://buzzyspell-production.up.railway.app/api` |

Add it for **Production** (and Preview if you want).

### 2.4 Deploy

1. Click **Deploy**.
2. After deploy, note the frontend URL, e.g. `https://your-app.vercel.app`.

### 2.5 Point backend CORS to frontend

1. In Railway, set **FRONTEND_URL** to that Vercel URL, e.g. `https://your-app.vercel.app` (no trailing slash).
2. Redeploy the Railway service so CORS allows the Vercel origin.

---

## 3. Quick checklist

- [ ] Latest code committed and pushed to `main` (if you want prod to match your repo).
- [ ] Railway: root = `server`, build = `npm run build`, start = `npm run start`.
- [ ] Railway: `NODE_ENV`, `OPENAI_API_KEY`, `FRONTEND_URL` set; optional volume for `DATABASE_PATH`.
- [ ] Railway: public domain added; copy the backend URL.
- [ ] Vercel: root = `client`, `VITE_API_URL` = `https://<railway-domain>/api`.
- [ ] Vercel: deploy and copy frontend URL.
- [ ] Railway: `FRONTEND_URL` = Vercel URL; redeploy.

---

## 4. Redeploying

- **Railway:** Push to `main` (if connected to GitHub) or click **Deploy** in the dashboard.
- **Vercel:** Push to `main` (or the connected branch); Vercel will auto-deploy.
