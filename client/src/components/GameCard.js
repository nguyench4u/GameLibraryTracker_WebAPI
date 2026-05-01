// UI Item #3: GameCard.js
// GameCard displays the details of a game in a card format

import React, { useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { BsController } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { deleteGame } from '../actions/gameActions';

const STATUS_COLORS = {
    wishlist:  { bg: '#babbf1', text: '#292c3c' },
    playing:   { bg: '#8caaee', text: '#292c3c' },
    completed: { bg: '#a6d189', text: '#292c3c' },
    dropped:   { bg: '#e78284', text: '#292c3c' }
};

// GameCard Object passed for GameLibrary to display each game with edit and delete options
// Accepts game object (MongoDB doc) and onEdit function (selected/edit mode) as props
const GameCard = ({ game, onEdit }) => {
    const dispatch = useDispatch(); // send actions to the Redux store (delete button)
    const statusColor = STATUS_COLORS[game.status] || { bg: '#b5bfe2', text: '#292c3c' };
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <>
        <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
            <Modal.Header closeButton className="btn-close-white" style={{ backgroundColor: '#292c3c', borderColor: '#8caaee', color: '#f0f0f8' }}>
                <Modal.Title>Delete Game</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: '#292c3c', color: '#f0f0f8' }}>
                Are you sure you want to delete <strong>{game.title}</strong>?
            </Modal.Body>
            <Modal.Footer style={{ backgroundColor: '#292c3c', borderColor: '#414559' }}>
                <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
                <Button style={{ backgroundColor: '#e78284', borderColor: '#e78284', color: '#292c3c' }}
                    onClick={() => { dispatch(deleteGame(game._id)); setShowConfirm(false); }}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>

        <Card className="mb-3" style={{ backgroundColor: '#292c3c', borderColor: '#414559', color: '#b5bfe2', height: '160px' }}>
            <div className="d-flex" style={{ height: '100%' }}> {/* Force full height set by 160px*/}
                <Card.Body className="flex-grow-1 d-flex justify-content-between" style={{ overflow: 'hidden' }}>
                    <div>
                        <Card.Title>{game.title}</Card.Title> {/* Minecraft */}
                        <Card.Subtitle className="mb-2" style={{ color: '#8caaee' }}>
                            {game.platform}{game.genre && game.genre.length > 0 && ` - ${game.genre.join(', ')}`} {/* PC - Adventure, Sandbox */}
                        </Card.Subtitle>
                        {game.rating && <p className="mb-1">★ Rating: <strong style={{ color: '#f4b8e4' }}>{game.rating} / 10</strong></p>}
                        {game.notes && <p className="mb-0" style={{ opacity: 0.8, fontSize: '0.85rem' }}>{game.notes}</p>}
                    </div>
                    <div className="d-flex flex-column justify-content-between align-items-end">
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
                                onClick={() => setShowConfirm(true)}
                            >
                                Delete
                            </Button>
                        </div>
                        <span
                            className="px-2 py-1 rounded"
                            style={{ backgroundColor: statusColor.bg, color: statusColor.text, fontSize: '0.8rem', textTransform: 'capitalize' }}
                        >
                            {game.status}
                        </span>
                    </div>
                </Card.Body>
                {game.imageUrl ? (
                    <img
                        src={game.imageUrl}
                        alt={game.title}
                        style={{ width: '140px', objectFit: 'cover', borderRadius: '0 4px 4px 0', flexShrink: 0 }}
                    />
                ) : (
                    <div style={{
                        width: '140px', flexShrink: 0, borderRadius: '0 4px 4px 0',
                        backgroundColor: '#35394d', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <BsController size={40} style={{ color: '#626880', opacity: 0.6 }} />
                    </div>
                )}
            </div>
        </Card>
        </>
    );
};

export default GameCard;
