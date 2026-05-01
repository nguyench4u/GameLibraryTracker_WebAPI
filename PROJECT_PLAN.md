# Game Library Tracker — Final Project Plan

## Concept
A full-stack app that lets users manage a personal game library. Each game tracks its status (wishlist / playing / completed / dropped), a 1–10 rating, and personal notes.

---

## Architecture
```
client/  (React — create-react-app)
      ↓ HTTP requests
Express REST API  (repo root)
      ↓ Mongoose ODM
MongoDB Atlas
```

**One repo, two folders:**
```
GameLibraryTracker_WebAPI/   ← git root
  server.js
  Games.js
  package.json
  .env
  client/                    ← React app lives here
    src/
    package.json
    .env
```

---

## Phase 1 — Backend (Express API)

### 1.1 Project Setup
- [ ] `npm init -y` at repo root
- [ ] Install backend dependencies:
  ```
  express mongoose dotenv cors body-parser
  ```
- [ ] Create `.env` at root:
  ```
  DB=mongodb+srv://...
  PORT=8080
  ```
- [ ] Add `.gitignore` (node_modules, .env)

### 1.2 File Structure
```
server.js       — all routes and middleware
Games.js        — Mongoose model
```

### 1.3 Database Model

**Games.js**
| Field     | Type   | Notes                                          |
|-----------|--------|------------------------------------------------|
| title     | String | required                                       |
| platform  | String | required (e.g. PC, PS5, Switch)                |
| genre     | String |                                                |
| status    | String | enum: wishlist / playing / completed / dropped |
| rating    | Number | 1–10, optional                                 |
| notes     | String | personal notes / description                   |
| createdAt | Date   | default: Date.now                              |

### 1.4 API Endpoints

| Method | Route        | Auth | Description                  |
|--------|--------------|------|------------------------------|
| GET    | `/games`     | No   | Get all games                |
| POST   | `/games`     | No   | Add a new game               |
| GET    | `/games/:id` | No   | Get a single game by ID      |
| PUT    | `/games/:id` | No   | Update a game                |
| DELETE | `/games/:id` | No   | Remove a game from library   |

**Optional query params for `GET /games`:**
- `?status=playing` — filter by status
- `?platform=PC` — filter by platform

### 1.5 Key Patterns
- Use CORS middleware so the React client can call the API in development
- Keep all routes in `server.js` — no need for a separate router file at this scale
- Return consistent JSON responses: `{ success: true, game: {...} }` on success, `{ success: false, error: '...' }` on failure

---

## Phase 2 — Frontend (React)

### 2.1 Project Setup
- [ ] `npx create-react-app client` inside repo root (no Vite)
- [ ] Install frontend dependencies inside `client/`:
  ```
  redux react-redux redux-thunk react-bootstrap bootstrap react-router-dom react-icons
  ```
- [ ] Create `client/.env`:
  ```
  REACT_APP_API_URL=http://localhost:8080
  ```
- [ ] Import Bootstrap CSS in `client/src/index.js`

### 2.2 File Structure
```
client/src/
  actions/
    gameActions.js      — fetchGames, addGame, updateGame, deleteGame
  components/
    gameheader.js       — navbar with app title
    gamelibrary.js      — grid/list of all game cards + status filter + Add button
    gamecard.js         — individual game card (title, platform, status badge, rating)
    addgamemodal.js     — Bootstrap modal form to add a new game
    editgamemodal.js    — Bootstrap modal form to edit an existing game
  constants/
    actionTypes.js
  reducers/
    gameReducer.js      — games[], statusFilter
  stores/
    store.js
  App.js
```

### 2.3 Routing (`App.js`)
Using `HashRouter` (works well for static deployments):

| Route      | Component   |
|------------|-------------|
| `/`        | GameLibrary |

Single-page app — no login route needed until auth is added.

### 2.4 Redux State Shape

**gameReducer**
```js
{
  games: [],           // all games from API
  statusFilter: 'all'  // 'all' | 'wishlist' | 'playing' | 'completed' | 'dropped'
}
```

### 2.5 Actions (`gameActions.js`)

| Action      | Method | Endpoint       | Notes                              |
|-------------|--------|----------------|------------------------------------|
| fetchGames  | GET    | `/games`       | Called on library load + after any mutation |
| addGame     | POST   | `/games`       | Dispatches fetchGames on success   |
| updateGame  | PUT    | `/games/:id`   | Dispatches fetchGames on success   |
| deleteGame  | DELETE | `/games/:id`   | Dispatches fetchGames on success   |

### 2.6 Component Details

**GameLibrary (`gamelibrary.js`)**
- Dispatches `fetchGames` on mount
- Renders status filter buttons: All / Wishlist / Playing / Completed / Dropped
- Renders "Add Game" button that opens `AddGameModal`
- Filters displayed cards client-side using `statusFilter` from Redux
- Renders a Bootstrap grid of `GameCard` components

**GameCard (`gamecard.js`)**
- Displays: title, platform, genre, status badge (color-coded), star rating, notes preview
- Edit button → opens `EditGameModal` pre-filled with game data
- Delete button → dispatches `deleteGame`

**AddGameModal (`addgamemodal.js`)**
- Controlled form: title, platform, genre, status (select), rating (1–10), notes
- On submit → dispatches `addGame`, closes modal

**EditGameModal (`editgamemodal.js`)**
- Same fields as Add, pre-filled with the selected game's current data
- On submit → dispatches `updateGame`, closes modal

**GameHeader (`gameheader.js`)**
- App title / brand in a Bootstrap Navbar

### 2.7 Key Patterns
- After any mutation (add, update, delete), re-fetch the full game list to keep UI in sync
- Status badge colors: wishlist → secondary, playing → primary, completed → success, dropped → danger
- Status filter is purely client-side — no extra API calls needed

---

## Phase 3 — Deployment

### 3.1 Backend (Render Web Service)
- [ ] Push repo to GitHub
- [ ] Create Render Web Service pointed at repo root
  - Build command: `npm install`
  - Start command: `node server.js`
- [ ] Add environment variables: `DB`, `PORT`
- [ ] Update `client/.env` `REACT_APP_API_URL` to point to live Render URL

### 3.2 Frontend (Render Static Site)
- [ ] Create Render Static Site pointed at `client/` folder in same repo
  - Build command: `npm run build`
  - Publish directory: `client/build`
- [ ] Add environment variable: `REACT_APP_API_URL`

---

## Phase 4 — Auth (Last Priority)
Add this only after core CRUD and deployment are working.

- [ ] Install: `passport passport-jwt passport-local jsonwebtoken bcrypt-nodejs`
- [ ] Add `Users.js` model (name, username, password)
- [ ] Add `auth_jwt.js` + `auth.js` Passport strategies (copy from prior assignment)
- [ ] Add `POST /signup` and `POST /signin` endpoints
- [ ] Add `isAuthenticated` middleware to all `/games` routes
- [ ] Add `userId` field to `Games.js`, set from JWT payload on create
- [ ] Frontend: add login/register components + authActions + authReducer
- [ ] Frontend: store JWT in localStorage, send as `Authorization: JWT <token>` header

---

## Build Order Checklist

```
[ ] 1.  npm init at repo root, install backend deps, create .env
[ ] 2.  Write Games.js Mongoose model
[ ] 3.  Write server.js: GET /games, POST /games (test with Postman)
[ ] 4.  Write server.js: GET /games/:id, PUT /games/:id, DELETE /games/:id (test with Postman)
[ ] 5.  npx create-react-app client, install frontend deps
[ ] 6.  Set up Redux store, gameReducer, actionTypes
[ ] 7.  Write gameActions.js (fetchGames, addGame, updateGame, deleteGame)
[ ] 8.  Build GameLibrary + GameCard components
[ ] 9.  Build AddGameModal + EditGameModal
[ ] 10. Build GameHeader
[ ] 11. Wire up routing in App.js
[ ] 12. Test full flow locally (add, edit, status filter, delete)
[ ] 13. Deploy backend to Render
[ ] 14. Deploy frontend to Render
[ ] 15. Smoke test on live URLs
[ ] 16. (Optional) Add auth — Phase 4 above
```

---
<br>
<br>

## Notes
- Status filter is done entirely client-side in Redux — no query params needed initially.
- Keep all backend routes in `server.js` for simplicity — same flat pattern as prior assignments.
- `REACT_APP_API_URL` must be set at build time for create-react-app; update it before deploying frontend.

<br>
<br>

## Additions Outside Original Scope

**`imageUrl` field (Games.js + AddGameModal + EditGameModal + GameCard)**
- Added `imageUrl: { type: String }` to the Mongoose schema
- Form field added to both AddGameModal and EditGameModal — accepts any public image URL
- GameCard displays the image on the right side of the card (fixed 140px wide column)
- If no image is provided, a placeholder with a game controller icon is shown instead to keep card layout consistent
- All cards are fixed at 160px height regardless of content

**`genre` changed from String to Array (Games.js)**
- Originally planned as a single string, changed to `[String]` to support multiple genres per game
- Form inputs accept comma-separated values and split them into an array on submit
- EditGameModal joins the array back to a comma-separated string for the form field on load

**Catppuccin Frappé color palette**
- Custom dark theme applied across all components using the Catppuccin Frappé palette
- Main bg: `#414559`, card/modal bg: `#292c3c`, text: `#f0f0f8`
- Status badge colors: wishlist `#babbf1`, playing `#8caaee`, completed `#a6d189`, dropped `#e78284`

---
<br>
<br>

## Bonus Features

All three features are client-side only — no new API endpoints needed. All changes go in `GameLibrary.js`.

### Architecture
Filters and sort stack on top of each other before rendering cards:
```
games (Redux)
  → status filter (Redux)
  → genre filter (local state)
  → search filter (local state)
  → sort (local state)
  → render GameCards
```

### Search Bar
- Local state: `searchQuery = ''`
- Filters games where `title` or `notes` includes the query (case-insensitive)
- UI: text input above or next to the status filters

### Sort
- Local state: `sortBy = 'none'` — options: `alphabetical`, `rating-high`, `rating-low`
- Applied after all filters via `.sort()` on the filtered array
- UI: `<Form.Select>` dropdown next to the Add Game button or search bar

### Genre Filter
- Local state: `selectedGenres = []`
- Available genres derived by flattening all `game.genre` arrays from Redux and deduplicating
- Clicking a genre badge toggles it in/out of `selectedGenres`
- If `selectedGenres` is empty, show all games; otherwise show games that match any selected genre
- UI: row of clickable genre badges below the status filters, auto-populated from library

### Build Order
```
[ ] 1. Search bar — state + filter logic + input UI in GameLibrary
[ ] 2. Sort — state + sort logic + select UI in GameLibrary
[ ] 3. Genre filter — derive genres, toggle logic + badge UI in GameLibrary
```
