// gameActions.js
// Actions are functions that return an object that contains a type and an optional payload
// These objects are dispatched to the Redux store to trigger state changes
// AKA the actual API calls: addGame, updateGame, deleteGame, fetchGames

import { FETCH_GAMES, SET_FILTER } from '../constants/actionTypes';

const API_URL = process.env.REACT_APP_API_URL; // Get the API URL from environment variables

// fetchGames
export const fetchGames = () => async (dispatch) => {
    try {
        const response = await fetch(`${API_URL}/api/games`); // Get fetch data
        const data = await response.json(); // Parse the JSON response
        dispatch({ type: FETCH_GAMES, payload: data.games }); // Dispatch the action with the games data
    } catch (err) {
        console.error('Error fetching games: ', err);
    }
}; 
// setFilter 
export const setFilter = (filter) => (dispatch) => {
    dispatch({ type: SET_FILTER, payload: filter });
}

// addGame
export const addGame = (gameData) => async (dispatch) => {
    try {
        await fetch(`${API_URL}/api/games`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gameData),
        });
        dispatch(fetchGames()); // Refresh the games list after adding a new game
    } catch (err) {
        console.error('Error adding game: ', err)
    }
};


// updateGame
export const updateGame = (id, gameData) => async (dispatch) => {
    try {
        await fetch(`${API_URL}/api/games/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gameData),
        });
        dispatch(fetchGames()); // Refresh the games list after updating a game
    } catch (err) {
        console.error('Error updating game: ', err);
    }
};


// deleteGame
export const deleteGame = (id) => async (dispatch) => {
    try {
        await fetch (`${API_URL}/api/games/${id}`, {
            method: 'DELETE',
        });
        dispatch(fetchGames()); // Refresh the games list after deleting a game
    } catch (err) {
        console.error('Error deleting game: ', err);
    }
};