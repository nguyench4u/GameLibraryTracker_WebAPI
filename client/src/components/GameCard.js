// UI Item #3: GameCard.js
// GameCard displays the details of a game in a card format

import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { deleteGame } from '../actions/gameActions';

const STATUS_COLORS = {
    wishlist:  { bg: '#babbf1', text: '#292c3c' },
    playing:   { bg: '#8caaee', text: '#292c3c' },
    completed: { bg: '#a6d189', text: '#292c3c' },
    dropped:   { bg: '#e78284', text: '#292c3c' }
};

const GameCard = ({ game, onEdit }) => {
    const dispatch = useDispatch();
    const statusColor = STATUS_COLORS[game.status] || { bg: '#b5bfe2', text: '#292c3c' };

    return (
        <Card className="mb-3" style={{ backgroundColor: '#292c3c', borderColor: '#414559', color: '#b5bfe2' }}>
            <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <Card.Title>{game.title}</Card.Title>
                        <Card.Subtitle className="mb-2" style={{ color: '#8caaee' }}>
                            {game.platform}{game.genre && game.genre.length > 0 && ` — ${game.genre.join(', ')}`}
                        </Card.Subtitle>
                        <span
                            className="mb-2 d-inline-block px-2 py-1 rounded"
                            style={{ backgroundColor: statusColor.bg, color: statusColor.text, fontSize: '0.8rem', textTransform: 'capitalize' }}
                        >
                            {game.status}
                        </span>
                        {game.rating && <p className="mb-1 mt-2">Rating: <strong style={{ color: '#ca9ee6' }}>{game.rating} / 10</strong></p>}
                        {game.notes && <p className="mb-0 mt-1" style={{ opacity: 0.8 }}>{game.notes}</p>}
                    </div>
                    <div className="d-flex gap-2">
                        <Button
                            size="sm"
                            style={{ backgroundColor: 'transparent', borderColor: '#ca9ee6', color: '#ca9ee6' }}
                            onClick={() => onEdit(game)}
                        >
                            Edit
                        </Button>
                        <Button
                            size="sm"
                            style={{ backgroundColor: 'transparent', borderColor: '#e78284', color: '#e78284' }}
                            onClick={() => dispatch(deleteGame(game._id))}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default GameCard;
