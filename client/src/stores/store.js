// store.js
// Store is the central place where the state of the application is stored in Redux

import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import gameReducer from '../reducers/gameReducer';

// Create the Redux store with the gameReducer and apply thunk middleware for async actions
const store = createStore(gameReducer, applyMiddleware(thunk)); 

export default store;