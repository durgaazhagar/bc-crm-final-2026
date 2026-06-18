Emergency Dispatch Module
=========================

Overview
- Implements a Dispatch model and API endpoints in the backend and a React/Tailwind UI in the frontend for managing emergency blood dispatches.

Backend
- Model: `backend/models/Dispatch.js`
- Controller: `backend/controllers/dispatchController.js`
- Routes: `backend/routes/dispatch.js` registered at `/api/dispatch`

Endpoints
- `GET /api/dispatch` — list with filtering: `q`, `status`, `hospital`, `district`, `page`, `limit`
- `POST /api/dispatch` — create a dispatch
- `GET /api/dispatch/:id` — get single
- `PUT /api/dispatch/:id/assign` — assign ambulance (body: `ambulanceId, driver, phone, etaMinutes, location`)
- `POST /api/dispatch/:id/notify` — notify donors (stub)

Frontend
- Page: `frontend/src/pages/EmergencyDispatchPage.tsx`
- Components:
  - `frontend/src/components/DispatchFilters.tsx`
  - `frontend/src/components/DispatchList.tsx`
  - `frontend/src/components/DispatchMap.tsx` (placeholder)
- API helper added: `dispatchService` in `frontend/src/services/api.ts`

Quick Start (local)
1. Start backend (from `backend`):
```
npm install
node server.js
```
2. Start frontend (from `frontend`):
```
npm install
npm run dev
```

Next Steps / Improvements
- Integrate a real map SDK (react-leaflet / Mapbox) for live ambulance tracking.
- Implement real donor notification flow and background matching using AI service.
- Add SSE / WebSocket for live updates instead of polling.
- Add unit/integration tests and seed data.
