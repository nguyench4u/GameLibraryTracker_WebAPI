// UI Item #2: GameLibrary.js
// GameLibrary is the main component that displays the list of games and allows users to add, update, and delete games

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Button, ButtonGroup } from 'react-bootstrap';
import { fetchGames } from '../actions/gameActions';
import GameCard from './GameCard';

const STATUS_FILTERS = ['all', 'wishlist', 'playing', 'completed', 'dropped'];

const GameLibrary = () => {
    const dispatch = useDispatch();
    const { games, statusFilter } = useSelector(state => state);

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
                <Button style={{ backgroundColor: '#a6d189', borderColor: '#a6d189', color: '#292c3c', fontWeight: 'bold' }}>
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
                    ? <p style={{ opacity: 0.6 }}>No games found.</p>
                    : filteredGames.map(game => (
                        <GameCard key={game._id} game={game} onEdit={() => {}} />
                    ))
                }
            </div>
        </Container>
    );
};

export default GameLibrary;
