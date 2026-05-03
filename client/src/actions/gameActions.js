// gameActions.js
// Actions are functions that return an object that contains a type and an optional payload
// These objects are dispatched to the Redux store to trigger state changes
// AKA the actual API calls: addGame, updateGame, deleteGame, fetchGames

import { FETCH_GAMES, SET_FILTER, AUTH_SUCCESS, LOGOUT } from '../constants/actionTypes';

const API_URL = process.env.REACT_APP_API_URL; // Get the API URL from environment variables

// fetchGames
export const fetchGames = () => async (dispatch, getState) => {
    try {
        const token = getState().token;
        const response = await fetch(`${API_URL}/api/games`, {
            headers: { 'Authorization': `JWT ${token}` }
        });
        const data = await response.json();
        dispatch({ type: FETCH_GAMES, payload: data.games });
    } catch (err) {
        console.error('Error fetching games: ', err);
    }
};

// setFilter
export const setFilter = (filter) => (dispatch) => {
    dispatch({ type: SET_FILTER, payload: filter });
}

// addGame
export const addGame = (gameData) => async (dispatch, getState) => {
    try {
        const token = getState().token;
        await fetch(`${API_URL}/api/games`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `JWT ${token}` },
            body: JSON.stringify(gameData),
        });
        dispatch(fetchGames()); // Refresh the games list after adding a new game
    } catch (err) {
        console.error('Error adding game: ', err)
    }
};

// updateGame
export const updateGame = (id, gameData) => async (dispatch, getState) => {
    try {
        const token = getState().token;
        await fetch(`${API_URL}/api/games/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `JWT ${token}` },
            body: JSON.stringify(gameData),
        });
        dispatch(fetchGames()); // Refresh the games list after updating a game
    } catch (err) {
        console.error('Error updating game: ', err);
    }
};

// deleteGame
export const deleteGame = (id) => async (dispatch, getState) => {
    try {
        const token = getState().token;
        await fetch(`${API_URL}/api/games/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `JWT ${token}` },
        });
        dispatch(fetchGames()); // Refresh the games list after deleting a game
    } catch (err) {
        console.error('Error deleting game: ', err);
    }
};

// signIn
export const signIn = (credentials) => async (dispatch) => {
    try {
        const response = await fetch(`${API_URL}/api/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        const data = await response.json();
        if (data.success) {
            localStorage.setItem('token', data.token);
            dispatch({ type: AUTH_SUCCESS, payload: data.token });
            dispatch(fetchGames());
            return { success: true };
        }
        return { success: false, error: data.error };
    } catch (err) {
        console.error('Error signing in: ', err);
        return { success: false, error: 'Network error' };
    }
};

// signUp
export const signUp = (userData) => async (dispatch) => {
    try {
        const response = await fetch(`${API_URL}/api/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        const data = await response.json();
        return data.success ? { success: true } : { success: false, error: data.error };
    } catch (err) {
        console.error('Error signing up: ', err);
        return { success: false, error: 'Network error' };
    }
};

// logout
export const logout = () => (dispatch) => {
    localStorage.removeItem('token');
    dispatch({ type: LOGOUT });
};
