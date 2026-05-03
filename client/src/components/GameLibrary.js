// UI Item #2: GameLibrary.js
// GameLibrary is the main component that displays the list of games and allows users to add, update, and delete games

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Button, ButtonGroup, Form } from 'react-bootstrap';
import { fetchGames, setFilter } from '../actions/gameActions';
import GameCard from './GameCard';
import AddGameModal from './AddGameModal';
import EditGameModal from './EditGameModal';

const STATUS_FILTERS = ['all', 'wishlist', 'playing', 'completed', 'dropped'];

const GameLibrary = () => {
    const dispatch = useDispatch(); // send actions to the Redux store (fetching games on component mount)
    const { games, statusFilter, token } = useSelector(state => state);
    const [showAddModal, setShowAddModal] = useState(false); // local state to change modal visibility
    const [showEditModal, setShowEditModal] = useState(false); // local state to change edit modal visibility
    const [selectedGame, setSelectedGame] = useState(null); // local state to store the game being edited
    const [searchQuery, setSearchQuery] = useState(''); // local state to store search query
    const [sortBy, setSortBy] = useState('none'); // local state for sort option
    const [selectedGenres, setSelectedGenres] = useState([]); // local state for genre filter
    const [showGenres, setShowGenres] = useState(false); // local state for genre collapse


    useEffect(() => {
        if (token) dispatch(fetchGames());
    }, [dispatch, token]);

    // For Status Button Group and Search Bar
    const filteredGames = (statusFilter === 'all' ? games : games.filter(game => game.status === statusFilter))
        .filter(game => { // Filter by search query (title, notes, and genre)
            if (!searchQuery) return true; // If search query is empty, include all games
            const query = searchQuery.toLowerCase();
            return (
                game.title.toLowerCase().includes(query) ||
                (game.notes && game.notes.toLowerCase().includes(query)) ||
                (game.genre && game.genre.join(', ').toLowerCase().includes(query))
            );
        });

    // For Sort Dropdown
    const sortedGames = [...filteredGames].sort((a, b) => {
        if (sortBy === 'alphabetical') return a.title.localeCompare(b.title);
        if (sortBy === 'rating-high') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'rating-low') return (a.rating || 0) - (b.rating || 0);
        return 0; // 'none' — keep original order
    });

    // Derive unique genres from all games in the library
    const availableGenres = [...new Set(games.flatMap(game => game.genre || []))].sort();

    // Toggle a genre in/out of selectedGenres
    const toggleGenre = (genre) => {
        setSelectedGenres(prev =>
            prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
        );
    };

    // Apply genre filter on top of sortedGames
    const displayedGames = selectedGenres.length === 0
        ? sortedGames
        : sortedGames.filter(game => game.genre && selectedGenres.some(g => game.genre.includes(g)));


    if (!token) return (
        <Container className="mt-5 text-center">
            <p style={{ color: '#b5bfe2', fontSize: '1.1rem' }}>Please log in to view your game library.</p>
        </Container>
    );

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>My Game Library</h2>
                <div className="d-flex gap-2">
                    <Form.Control
                        id="search-input"
                        type="text"
                        placeholder="Search by title or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ backgroundColor: '#f0f0f8', color: '#292c3c', borderColor: '#8caaee', width: '350px', caretColor: '#292c3c' }}
                    />
                    <Button style={{ backgroundColor: '#a6d189', borderColor: '#a6d189', color: '#292c3c', fontWeight: 'bold', whiteSpace: 'nowrap' }}
                        onClick={() => setShowAddModal(true)}
                    >
                        + Add Game
                    </Button>
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <ButtonGroup>
                    {STATUS_FILTERS.map(filter => (
                        <Button
                            key={filter}
                            onClick={() => dispatch(setFilter(filter))}
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

                <div className="d-flex gap-2 align-items-center position-relative">
                    {/* Genre Selection collapsible */}
                    {availableGenres.length > 0 && (
                        <div style={{ position: 'relative' }}>
                            <div
                                className="d-flex align-items-center justify-content-between px-3 py-2"
                                onClick={() => setShowGenres(prev => !prev)}
                                style={{
                                    cursor: 'pointer', userSelect: 'none',
                                    backgroundColor: '#292c3c', borderRadius: '6px',
                                    border: '1px solid #ca9ee6', color: '#ca9ee6',
                                    fontWeight: 'bold', width: '200px',
                                    height: '38px', padding: '6px 10px'
                                }}
                            >
                                Genre Selection {selectedGenres.length > 0 && `(${selectedGenres.length})`}
                                <span>{showGenres ? '▲' : '▼'}</span>
                            </div>
                            {showGenres && (
                                <div
                                    className="d-flex flex-wrap gap-2 p-3"
                                    style={{
                                        position: 'absolute', right: 0, top: '110%',
                                        backgroundColor: '#292c3c', border: '1px solid #414559',
                                        borderRadius: '8px', zIndex: 100, minWidth: '200px'
                                    }}
                                >
                                    {availableGenres.map(genre => (
                                        <span
                                            key={genre}
                                            onClick={() => toggleGenre(genre)}
                                            style={{
                                                cursor: 'pointer', padding: '4px 12px',
                                                borderRadius: '20px', fontSize: '0.85rem',
                                                backgroundColor: selectedGenres.includes(genre) ? '#ca9ee6' : '#35394d',
                                                color: selectedGenres.includes(genre) ? '#292c3c' : '#b5bfe2',
                                                border: '1px solid #ca9ee6', userSelect: 'none'
                                            }}
                                        >
                                            {genre}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Sort dropdown */}
                    <Form.Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{ backgroundColor: '#292c3c', color: '#f0f0f8', borderColor: '#8caaee', width: '160px', padding: '6px 10px', height: '38px', borderRadius: '6px' }}
                    >
                        <option value="none">Sort by...</option>
                        <option value="alphabetical">A to Z</option>
                        <option value="rating-high">Rating: High to Low</option>
                        <option value="rating-low">Rating: Low to High</option>
                    </Form.Select>
                </div>
            </div>

            <div>
                {displayedGames.length === 0
                    ? <p style={{ color: '#b5bfe2', opacity: 0.6 }}>No games found.</p>
                    : displayedGames.map(game => (
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
