// server.js contains all the MAIN server code that runs the backend
// Include ALL packages
// Where Express App is created
// Where we connect to the database
// Where we set up our routes


// Package Imports
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const Game = require('./models/Games'); // import Game model


// Create Express App
const app = express();
app.use(cors());
app.use(bodyParser.json());


// Connect to MongoDB
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));


// Routes
// Get all games
app.get('/api/games', async (req, res) => {
    try {
        const games = await Game.find();
        res.json({ success: true, games });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get a single game
app.get('/api/games/:id', async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        // Check if game exists
        if (!game) return res.status(404).json({ success: false, error: 'Game not found' });
        res.json({ success: true, game });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Post a new game 
app.post('/api/games', async (req, res) => {
    try {
        const game = new Game(req.body);
        await game.save();
        res.status(201).json({ success: true, game });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Put (update) a game
app.put('/api/games/:id', async (req, res) => {
    try {
        const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
        // Check if game exists
        if (!game) return res.status(404).json({ success: false, error: 'Game not found' });
        res.json({ success: true, game });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Delete a game