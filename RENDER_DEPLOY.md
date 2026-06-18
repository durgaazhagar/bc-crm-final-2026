# Deploying the backend to Render

This file explains how to deploy the `backend/` folder to Render and set required environment variables.

1) Prepare repo

- Ensure `backend/package.json` contains a `start` script (it does: `node server.js`).
- Ensure `backend/.env` is NOT committed — use Render secrets for production.

2) Push to Git hosting (GitHub/GitLab)

- Push your repo branch (e.g. `main`) to your Git provider.

3) Create a new Web Service on Render

- In Render dashboard -> New -> Web Service
- Connect your Git provider and select this repo and the branch (e.g. `main`).
- For "Root Directory" leave blank (repo root) — the `render.yaml` included will handle service configuration. Alternatively, set the build and start commands manually as below.

4) Build & Start commands (if not using `render.yaml`)

- Build Command: `cd backend && npm install`
- Start Command: `cd backend && npm start`

5) Environment variables (set in Render Dashboard -> Environment)

- `MONGO_URI` = your MongoDB Atlas connection string (mongodb+srv://...)
- `JWT_SECRET` = strong random string
- `FRONTEND_URL` = https://bc-crm-final-2026.vercel.app
- Optional: `AUTH_FALLBACK` = false (or true for dev fallback), `EMAIL_SERVICE`, `EMAIL_USER`, `EMAIL_PASSWORD`, `EMAIL_FROM`

Note: Render sets `PORT` automatically — do not hardcode it. The server is configured to use `process.env.PORT`.

6) Deploy & test

- Trigger a deploy in Render. After build succeeds, the service will start.
- Test the status endpoint:

```
curl https://<your-render-service>.onrender.com/api/status
```

7) Troubleshooting

- If you see `Server temporarily unavailable` in the frontend, confirm CORS and `FRONTEND_URL` are set correctly.
- View live logs in Render to see stdout from `server.js` and MongoDB connection attempts.

8) Secure secrets

- Use Render's Environment settings (Dashboard or `render` CLI) to store secrets. Do not commit secrets into the repo.
