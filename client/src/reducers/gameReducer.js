// gameReducer.js
// Reducers are for managing state changes in response to actions dispatched in Redux

import { FETCH_GAMES, SET_FILTER, AUTH_SUCCESS, LOGOUT } from '../constants/actionTypes';

const initialState = {
    games: [],
    statusFilter: 'all', // Default filter to show all games
    token: localStorage.getItem('token') || null, // Persist token across page refreshes
};

// gameReducer takes current state and action, then returns new state based on action type
const gameReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_GAMES:
            return { ...state, games: action.payload };
        case SET_FILTER:
            return { ...state, statusFilter: action.payload };
        case AUTH_SUCCESS:
            return { ...state, token: action.payload };
        case LOGOUT:
            return { ...state, token: null, games: [] };
        default:
            return state;
    }
};

export default gameReducer;