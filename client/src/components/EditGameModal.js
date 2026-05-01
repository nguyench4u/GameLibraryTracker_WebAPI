// UI Item #4: EditGameModal.js
// EditGameModal provides a popup form to edit an existing game in the library

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import {updateGame } from '../actions/gameActions';

const EditGameModal = ({ show, onHide, game }) => {
    const dispatch = useDispatch(); // send action to the Redux store (editing game)
    const [formData, setFormData] = useState({
        title: '',
        platform: '',
        genre: '', 
        status: '', 
        rating: '',
        notes: '',
        imageUrl: ''
    });

    useEffect(() => { // Check
        if (game) {
            setFormData({
                title: game.title || '',
                platform: game.platform || '',
                genre: game.genre ? game.genre.join(', ') : '', // Convert genre array to comma-separated string for form input
                status: game.status || 'wishlist',
                rating: game.rating || '',
                notes: game.notes || '',
                imageUrl: game.imageUrl || ''
            })
        }
    }, [game]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedGame = {
            ...formData, 
            genre: formData.genre ? formData.genre.split(',').map(g => g.trim()) : [], // convert comma-separate genres
            rating: formData.rating ? Number(formData.rating) : undefined // convert to number or undefined if empty
        };
        dispatch(updateGame(game._id, updatedGame)); // Dispatch updateGame action with game ID and updated data
        setFormData({ title: game.title || '', platform: game.platform || '', genre: game.genre || '', status: game.status || '', rating: game.rating || '', notes: game.notes || '', imageUrl: game.imageUrl || '' }); // Reset form data to current selected game data
        onHide(); // Close the modal after submitting
    };


    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton className="btn-close-white" style={{ backgroundColor: '#292c3c', color: '#f0f0f8', borderColor: '#8caaee' }}>
                <Modal.Title>Edit Game Details </Modal.Title>
            </Modal.Header>        

            <Modal.Body style={{ backgroundColor: '#292c3c', color: '#f0f0f8' }}>
                <Form onSubmit={handleSubmit}>

                    <Form.Group className='mb-3'>
                        <Form.Label className='mb-3'>Title *</Form.Label>
                        <Form.Control name="title" value={formData.title} onChange={handleChange} placeholder="Enter game title" required 
                        style={{ backgroundColor: '#414559', color: '#f0f0f8', borderColor: '#8caaee' }}/>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label className='mb-3'>Platform *</Form.Label>
                        <Form.Control name="platform" value={formData.platform} onChange={handleChange} placeholder="e.g. PC, PS5, Nintendo Switch" required 
                        style={{ backgroundColor: '#414559', color: '#f0f0f8', borderColor: '#8caaee' }}/>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label className='mb-3'>Genre</Form.Label>
                        <Form.Control name="genre" value={formData.genre} onChange={handleChange} placeholder="e.g. Action, RPG, Adventure (comma-separated)" 
                        style={{ backgroundColor: '#414559', color: '#f0f0f8', borderColor: '#8caaee' }}/>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label className='mb-3'>Status *</Form.Label>
                        <Form.Select name="status" value={formData.status} onChange={handleChange} required
                        style={{ backgroundColor: '#414559', color: '#c6d0f5', borderColor: '#8caaee' }}>
                            <option value="wishlist">Wishlist</option>
                            <option value="playing">Playing</option>
                            <option value="completed">Completed</option>
                            <option value="dropped">Dropped</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label className='mb-3'>Rating</Form.Label>
                        <Form.Control name="rating" value={formData.rating} onChange={handleChange} type="number" min="1" max="10" step="1" placeholder="Rate the game (0-10)" 
                        style={{ backgroundColor: '#414559', color: '#f0f0f8', borderColor: '#8caaee' }}/>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label className='mb-3'>Notes</Form.Label>
                        <Form.Control name="notes" value={formData.notes} onChange={handleChange} as="textarea" rows={2} placeholder="Additional notes about the game"
                        style={{ backgroundColor: '#414559', color: '#f0f0f8', borderColor: '#8caaee' }}/>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label className='mb-3'>Image URL</Form.Label>
                        <Form.Control name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Paste a public image URL"
                        style={{ backgroundColor: '#414559', color: '#f0f0f8', borderColor: '#8caaee' }}/>
                    </Form.Group>

                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="secondary" onClick={onHide}>
                            Cancel
                        </Button>
                        <Button style={{ backgroundColor: '#8caaee', color: '#292c3c' }} type="submit">
                            Save Changes
                        </Button>
                    </div>

                </Form>
            </Modal.Body>

        </Modal>
    )


};

export default EditGameModal;
