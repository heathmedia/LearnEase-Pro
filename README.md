# LearnEase Pro

An eLearning platform built on the MERN stack (MongoDB, Express, React, Node.js). The project is split into a `client` (React front-end) and a `server` (Express API), orchestrated from the root.

## Tech Stack

- **Front-end:** React (Vite), ESLint
- **Back-end:** Node.js, Express, Mongoose
- **Database:** MongoDB
- **Dev tooling:** nodemon (server auto-restart), concurrently (run both apps with one command)

## Project Structure

```
learnease-pro/
├── package.json          # Root: orchestration scripts (concurrently)
├── client/               # React front-end (Vite)
│   ├── package.json
│   ├── vite.config.js    # Dev proxy: /api → http://localhost:5000
│   └── src/
└── server/               # Express API
    ├── server.js         # Entry point
    ├── nodemon.json
    ├── .env              # Local config (NOT committed)
    ├── .env.example      # Template for required env vars
    ├── seed.js           # Populates the database with sample data
    ├── config/
    │   └── db.js         # Mongoose connection
    ├── models/
    │   └── Course.js
    └── routes/
        └── courses.js
```

## Prerequisites

- **Node.js** (v18 or newer recommended) and npm
- **MongoDB Community Server**, installed and running locally on the default port (`27017`).
  This is the actual requirement for the app to run — the back-end connects to this server directly via Mongoose.
- **mongosh** (optional) — only needed if you want to inspect the database manually from the command line.

> **Note:** `mongosh` is the MongoDB shell *client*, not the database itself. The app does not run through it. What the app needs is the MongoDB **server** (`mongod`) running in the background.

### How to Install MongoDB Community
If MongoDB is not installed, you can install MongoDB Communtiy v8.3 via brew using the instructions below:
```bash
brew tap mongodb/brew
brew update
brew install mongodb-community@8.3
brew services start mongodb-community@8.3
```

## Setup

From the project root:

```bash
# 1. Install dependencies for root, server, and client and seed database.
npm run setup

# 2. Start both the API and the front-end
npm run dev
```

Once running:

- Front-end (Vite): http://localhost:5173
- API: http://localhost:5000

The Vite dev server proxies any request to `/api/*` to the back-end at `http://localhost:5000`, so the React app can call `fetch('/api/courses')` without CORS issues during development.

## Environment Variables

The server reads configuration from `server/.env`. Copy the example file and adjust if needed:

```bash
cp server/.env.example server/.env
```

| Variable    | Description                          | Default                                      |
| ----------- | ------------------------------------ | -------------------------------------------- |
| `PORT`      | Port the Express server listens on   | `5000`                                       |
| `NODE_ENV`  | Environment mode                     | `development`                                |
| `MONGO_URI` | MongoDB connection string            | `mongodb://127.0.0.1:27017/learnease`        |

> The database (`learnease`) does not need to exist beforehand. MongoDB creates it automatically on the first write — for example, when you run the seed script.

## Available Scripts

### Root

| Command               | What it does                                                        |
| --------------------- | ------------------------------------------------------------------- |
| `npm run dev`         | Runs the server and client together (via concurrently)              |
| `npm run install:all` | Installs dependencies for the root, server, and client              |

### Server (`server/`)

| Command          | What it does                                          |
| ---------------- | ----------------------------------------------------- |
| `npm run dev`    | Starts the API with nodemon (auto-restart on changes) |
| `npm run seed`   | Wipes and repopulates the database with sample data   |

### Client (`client/`)

| Command          | What it does                          |
| ---------------- | ------------------------------------- |
| `npm run dev`    | Starts the Vite dev server            |
| `npm run build`  | Builds the front-end for production   |
| `npm run lint`   | Runs ESLint                           |

## API Endpoints

Base URL: `http://localhost:5000`

| Method | Endpoint            | Description                          |
| ------ | ------------------- | ------------------------------------ |
| GET    | `/api/health`       | Health check                         |
| GET    | `/api/courses`      | List all courses                     |
| GET    | `/api/courses/:id`  | Get a single course by ID            |
| POST   | `/api/courses`      | Create a course (JSON body)          |

Example — create a course:

```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -d '{"title":"Intro to JavaScript","instructor":"Ada Lovelace"}'
```

## Inspecting the Database

With `mongosh` installed, you can check the data directly:

```bash
# List all courses
mongosh learnease --eval "db.courses.find().pretty()"

# Count courses
mongosh learnease --eval "db.courses.countDocuments()"

# List collections in the database
mongosh learnease --eval "db.getCollectionNames()"
```

If the `learnease` database doesn't appear yet, it's because nothing has been written to it — run `npm run seed --prefix server` first.

## Troubleshooting

- **`MongoDB connection error` on startup** — Make sure the MongoDB server is running and reachable at `127.0.0.1:27017`. The app failing here means the database server isn't up, regardless of whether `mongosh` is installed.
- **Port 5000 already in use (macOS)** — The AirPlay Receiver service sometimes claims port 5000. Disable it in System Settings, or change `PORT` in `server/.env` (and update the proxy target in `client/vite.config.js` to match).
- **Empty course list** — A fresh database is empty until seeded. Run `npm run seed --prefix server`.
- **Data appears "missing"** — Confirm `MONGO_URI` points at the database name you expect. A connection succeeds even if the database name is misspelled; it just silently uses a different database.
