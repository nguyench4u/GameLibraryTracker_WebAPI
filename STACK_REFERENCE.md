# CSC3916 Movie API - Stack Reference

## Project Overview
A full-stack Movie Review application. Users can sign up, log in, browse top-rated movies, view movie details with reviews, and submit their own reviews. Built across two repositories — a REST API backend and a React frontend.

## Architecture
```
React Frontend (CSC3916_REACT19)
        ↓ HTTP requests with JWT
Express REST API (WebAPI_Assignment4)
        ↓ Mongoose ODM
MongoDB Atlas
```

---

## Backend (`WebAPI_Assignment4`)

### Stack
- **Runtime:** Node.js
- **Framework:** Express
- **Database:** MongoDB Atlas via Mongoose 5.x
- **Authentication:** Passport.js + JWT (`passport-jwt`, `jsonwebtoken`)
- **Password Hashing:** bcrypt-nodejs
- **Deployment:** Render (`https://webapi-assignment4.onrender.com`)

### File Structure
```
server.js       — all routes and controllers in one file
Movies.js       — Mongoose model (title, releaseDate, genre, actors, imageUrl)
Reviews.js      — Mongoose model (movieId, username, review, rating)
Users.js        — Mongoose model (name, username, password)
auth_jwt.js     — JWT Passport strategy
auth.js         — Basic auth strategy
```

### API Endpoints
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/signup` | No | Register a new user |
| POST | `/signin` | No | Sign in, returns JWT token |
| POST | `/movies` | JWT | Add a new movie |
| GET | `/movies` | JWT | Get all movies (add `?reviews=true` to include reviews sorted by avgRating) |
| POST | `/movies/search` | JWT | Search movies by partial title or actor name |
| GET | `/movies/:id` | JWT | Get movie by ObjectId or title (add `?reviews=true` for reviews + avgRating) |
| PUT | `/movies/:id` | JWT | Update a movie by title |
| DELETE | `/movies/:id` | JWT | Delete a movie by title |
| GET | `/reviews` | JWT | Get all reviews |
| POST | `/reviews` | JWT | Post a review (username pulled from JWT token) |

### Key Patterns
- All protected routes use `authJwtController.isAuthenticated` middleware
- JWT token format: `JWT <token>` in Authorization header
- `GET /movies?reviews=true` uses MongoDB `$lookup` + `$addFields` + `$sort` aggregation to join reviews and compute `avgRating`
- `POST /reviews` extracts username from `req.user.username` (JWT payload) — never from request body
- `/movies/:id` supports both ObjectId and title lookup via regex detection

### Environment Variables
```
DB=mongodb+srv://...        — MongoDB Atlas connection string
SECRET_KEY=...              — JWT signing secret
```

---

## Frontend (`CSC3916_REACT19`)

### Stack
- **Framework:** React 19
- **State Management:** Redux + Redux Thunk
- **UI Components:** React Bootstrap
- **Routing:** React Router v6 (HashRouter)
- **Icons:** react-icons (BsStarFill)
- **Deployment:** Render (`https://webapi-assignment3-react-site.onrender.com`)

### File Structure
```
src/
  actions/
    authActions.js      — signup, signin, logout actions
    movieActions.js     — fetchMovies, fetchMovie, submitReview, searchMovies
  components/
    authentication.js   — wraps login + register tabs
    login.js            — login form
    register.js         — signup form (name, username, password)
    movieheader.js      — navbar with links + logout
    movielist.js        — carousel of top-rated movies
    moviedetail.js      — movie detail, reviews grid, review submission form
    movie.js            — wrapper that dispatches fetchMovie by ID
    search.js           — search input + results grid
  constants/
    actionTypes.js      — Redux action type constants
  reducers/
    authReducer.js      — loggedIn, username state
    movieReducer.js     — movies, selectedMovie, searchResults state
  stores/
    store.js            — Redux store setup
  App.js                — routes: /, /movielist, /movie/:movieId, /signin, /search
```

### Key Patterns
- JWT token stored in `localStorage` as `token`, sent as `Authorization` header on every API call
- `fetchMovies` always fetches with `?reviews=true` so `avgRating` is available on the main screen
- After `submitReview`, the action re-fetches the movie to refresh the reviews list
- Route uses `HashRouter` (URLs use `#/` prefix) — important for Render static deployments

### Environment Variables
```
REACT_APP_API_URL=https://webapi-assignment4.onrender.com
```
