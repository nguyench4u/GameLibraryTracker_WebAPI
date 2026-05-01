const mongoose = require('mongoose');

// Define the Game Schema 
const GameSchema = new mongoose.Schema({
    title: { type: String, required: true },
    platform: { type: String, required: true },
    genre: [{ type: String }],
    status: { type: String, enum: ['wishlist', 'playing', 'completed', 'dropped'], default: 'wishlist' },
    rating: { type: Number, min: 1, max: 10 },
    notes: { type: String },
    imageUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Game', GameSchema);