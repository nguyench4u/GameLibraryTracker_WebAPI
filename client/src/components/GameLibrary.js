// UI Item #2: GameLibrary.js
// GameLibrary is the main component that displays the list of games and allows users to add, update, and delete games

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Button, ButtonGroup } from 'react-bootstrap';
import { fetchGames } from '../actions/gameActions';

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
                <Button variant="success">+ Add Game</Button>
            </div>

            <ButtonGroup className="mb-4">
                {STATUS_FILTERS.map(filter => (
                    <Button
                        key={filter}
                        variant={statusFilter === filter ? 'dark' : 'outline-dark'}
                        style={{ textTransform: 'capitalize' }}
                    >
                        {filter}
                    </Button>
                ))}
            </ButtonGroup>

            <div>
                {filteredGames.length === 0
                    ? <p className="text-muted">No games found.</p>
                    : filteredGames.map(game => (
                        <div key={game._id}>{game.title}</div>
                    ))
                }
            </div>
        </Container>
    );
};

export default GameLibrary;
