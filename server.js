// server.js contains all the MAIN server code that runs the backend
// Include ALL packages
// Where Express App is created
// Where we connect to the database
// Where we set up our routes
// Where we start the server (at the bottom)


// Package Imports
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const passport = require('passport');
const jwt = require('jsonwebtoken');
const Game = require('./Games.js'); // import Game model
const User = require('./User');
const auth = require('./auth'); // load passport JWT strategy


// Create Express App
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());


// Connect to MongoDB
mongoose.connect(process.env.DB)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));


// =============================== Auth Routes ===============================
// Sign up
app.post('/api/signup', async (req, res) => {
    try {
        const { name, username, password } = req.body;
        const existing = await User.findOne({ username });
        if (existing) return res.status(400).json({ success: false, error: 'Username already taken' });
        const user = new User({ name, username, password });
        await user.save();
        res.status(201).json({ success: true, message: 'User created' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Sign in
app.post('/api/signin', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username }).select('+password');
        if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials' });
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ success: false, error: 'Invalid credentials' });
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '7d' });
        res.json({ success: true, token });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});


// =============================== Game Routes ===============================
// Get all games
app.get('/api/games', auth.isAuthenticated, async (req, res) => {
    try {
        const games = await Game.find({ userId: req.user._id });
        res.json({ success: true, games });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get a single game
app.get('/api/games/:id', auth.isAuthenticated, async (req, res) => {
    try {
        // Ensure the game belongs to the authenticated user before returning
        const game = await Game.findOne({ _id: req.params.id, userId: req.user._id });
        if (!game) return res.status(404).json({ success: false, error: 'Game not found' });
        res.json({ success: true, game });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Post a new game
app.post('/api/games', auth.isAuthenticated, async (req, res) => {
    try {
        // Create a new game with the userId of the authenticated user
        const game = new Game({ ...req.body, userId: req.user._id });
        await game.save();
        res.status(201).json({ success: true, game });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Put (update) a game
app.put('/api/games/:id', auth.isAuthenticated, async (req, res) => {
    try {
        // Ensure the game belongs to the authenticated user before updating
        const game = await Game.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, req.body, { new: true });
        if (!game) return res.status(404).json({ success: false, error: 'Game not found' });
        res.json({ success: true, game });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Delete a game
app.delete('/api/games/:id', auth.isAuthenticated, async (req, res) => {
    try {
        // Ensure the game belongs to the authenticated user before deleting
        const game = await Game.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!game) return res.status(404).json({ success: false, error: 'Game not found' });
        res.json({ success: true, message: 'Game deleted' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});


// Start the server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});