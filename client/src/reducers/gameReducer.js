// gameReducer.js
// Reducers are for managing state changes in response to actions dispatched in Redux

import { FETCH_GAMES } from '../constants/actionTypes';

const initialState = {
    games: [],
    statusFilter: 'all', // Default filter to show all games
};

// gameReducer takes current state and action, then returns new state based on action type
const gameReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_GAMES:
            return { ...state, games: action.payload };
        default:
            return state;
    }
};

export default gameReducer;