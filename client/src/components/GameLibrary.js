// UI Item #2: GameLibrary.js
// GameLibrary is the main component that displays the list of games and allows users to add, update, and delete games

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Button, ButtonGroup } from 'react-bootstrap';
import { fetchGames } from '../actions/gameActions';
import GameCard from './GameCard';
import AddGameModal from './AddGameModal';
import EditGameModal from './EditGameModal';

const STATUS_FILTERS = ['all', 'wishlist', 'playing', 'completed', 'dropped'];

const GameLibrary = () => {
    const dispatch = useDispatch(); // send actions to the Redux store (fetching games on component mount)
    const { games, statusFilter } = useSelector(state => state);
    const [showAddModal, setShowAddModal] = useState(false); // local state to change modal visibility
    const [showEditModal, setShowEditModal] = useState(false); // local state to change edit modal visibility
    const [selectedGame, setSelectedGame] = useState(null); // local state to store the game being edited

    useEffect(() => {
        dispatch(fetchGames());
    }, [dispatch]);

    const filteredGames = statusFilter === 'all'
        ? games
        : games.filter(game => game.status === statusFilter);

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>My Game Library</h2>
                <Button style={{ backgroundColor: '#a6d189', borderColor: '#a6d189', color: '#292c3c', fontWeight: 'bold' }}
                    onClick={() => setShowAddModal(true)}
                >
                    + Add Game
                </Button>
            </div>

            <ButtonGroup className="mb-4">
                {STATUS_FILTERS.map(filter => (
                    <Button
                        key={filter}
                        style={{
                            backgroundColor: statusFilter === filter ? '#8caaee' : 'transparent',
                            borderColor: '#8caaee',
                            color: statusFilter === filter ? '#292c3c' : '#8caaee',
                            textTransform: 'capitalize'
                        }}
                    >
                        {filter}
                    </Button>
                ))}
            </ButtonGroup>

            <div>
                {filteredGames.length === 0
                    ? <p style={{ color: '#b5bfe2', opacity: 0.6 }}>No games found.</p>
                    : filteredGames.map(game => (
                        <GameCard 
                            key={game._id} 
                            game={game}
                            onEdit={(game) => { // Set selected game and show edit modal when Edit button is clicked in GameCard
                                setSelectedGame(game);
                                setShowEditModal(true);
                            }} />
                    ))
                }
            </div>

            <AddGameModal show={showAddModal} onHide={() => setShowAddModal(false)} /> {/* Show Add Game modal if showAddModal is true */}
            <EditGameModal show={showEditModal} onHide={() => setShowEditModal(false)} game={selectedGame} /> {/* Show Edit Game modal if showEditModal is true, pass selected game as prop */}
        </Container>
    );
};

export default GameLibrary;
