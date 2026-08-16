# MetroSync — Real-Time Dashboard Backend

Node.js/Express + Socket.io backend for a real-time metro information system, backed by MongoDB.
Covers all 8 rubric tasks: project setup, stations API, admin auth (bcrypt + JWT), auth middleware,
announcements API + validation, real-time Socket.io rooms/presence, tests, and deployment.

## Project layout

```
src/
  app.js                 Express app: middleware, routes, error handling
  server.js               Entry point: connects DB, starts HTTP + Socket.io
  config/db.js             Mongoose connection
  models/                  Station, Admin, Announcement schemas
  services/                DB access logic (only place DB queries live)
  controllers/             Thin request/response coordination
  middleware/               requireAdmin, validators, rate limiter, error handler
  routes/                  Route definitions
  sockets/index.js          Socket.io rooms + presence tracking
  seed/                    seedStations.js, createAdmin.js
tests/                    Jest + Supertest integration tests
public/passenger/          Minimal passenger-facing demo page
public/admin/               Minimal admin demo page (login + post announcement)
postman/                  Postman collection
```

## 1. Install dependencies

```bash
npm install
```

## 2. Set up MongoDB Atlas

1. Create a free cluster at https://www.mongodb.com/cloud/atlas.
2. Create a database user and grab the connection string (Drivers → Node.js).
3. Allow your IP (or 0.0.0.0/0 for local dev) in Network Access.

## 3. Configure environment variables

```bash
cp .env.example .env
```

Fill in `.env`:
- `MONGO_URI` — your Atlas connection string
- `JWT_SECRET` — any long random string (e.g. `openssl rand -hex 32`)
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — credentials for the seeded admin account

`.env` is already in `.gitignore` — never commit it.

## 4. Seed the database

```bash
npm run seed          # loads the station list
npm run seed:admin    # creates the admin account from ADMIN_EMAIL/ADMIN_PASSWORD
```

## 5. Run the server

```bash
npm run dev     # nodemon, auto-restart
# or
npm start
```

Visit:
- `GET http://localhost:5000/health` → `{ status: 'ok', ... }`
- `http://localhost:5000/passenger` → passenger demo view
- `http://localhost:5000/admin-panel` → admin demo view (login + post announcement)

## 6. Run tests

```bash
npm test
```

Tests use `mongodb-memory-server`, so no real database is touched — this downloads a local
MongoDB binary the first time you run it (needs internet access once).

## 7. Deploy to Render

1. Push this repo to GitHub.
2. On Render: New → Web Service → connect the repo.
3. Build command: `npm install`. Start command: `npm start`.
4. Add the same environment variables from `.env` (MONGO_URI, JWT_SECRET, JWT_EXPIRES_IN,
   CLIENT_ORIGIN, PORT) in Render's Environment tab — Render sets `PORT` itself, so you can
   usually leave that one out.
5. Deploy, then confirm `https://<your-app>.onrender.com/health` responds.

## 8. Postman

Import `postman/MetroSync.postman_collection.json`. It's pre-wired with collection variables
(`baseUrl`, `token`, `stationId`) that auto-populate as you run Login and Stations List, so you
can run the requests top-to-bottom without manual copy-pasting.

## API summary

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/health` | none | Health check |
| GET | `/api/v1/stations` | none | All stations, sorted by line then order |
| POST | `/api/v1/auth/login` | none (rate limited) | Admin login → JWT |
| GET | `/api/v1/announcements/station/:stationId` | none | Announcements, newest-first, paginated |
| POST | `/api/v1/announcements` | Bearer JWT (admin) | Create announcement, broadcasts via Socket.io |

## Socket.io events

| Event | Direction | Payload |
|---|---|---|
| `joinStation` | client → server | `stationId` string |
| `presenceUpdate` | server → room | `{ stationId, viewers }` |
| `newAnnouncement` | server → room | the created announcement document |

## What to do after you get this code

See the checklist in the follow-up message from Claude.
