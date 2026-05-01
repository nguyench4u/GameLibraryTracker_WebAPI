// UI Item #4: AddGameModal.js
// AddGameModal provides a popup form to add a new game to the library

import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addGame } from '../actions/gameActions';

const AddGameModal = ({ show, onHide }) => {
    const dispatch = useDispatch(); // send action to the Redux store (adding new game)
    const [formData, setFormData] = useState({
        title: '',
        platform: '',
        genre: '',
        status: 'wishlist',
        rating: '',
        notes: '',
        imageUrl: ''
    });


    const handleChange = (e) => { // update form data state on input change 
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => { // dispatch addGame action 
        e.preventDefault(); // prevent default form submission behavior
        const newGame = {
            ...formData, 
            genre: formData.genre ? formData.genre.split(',').map(g => g.trim()) : [], // convert comma-separate genres
            rating: formData.rating ? Number(formData.rating) : undefined // convert to number or undefined if empty
        };
        dispatch(addGame(newGame)); // Reset form and close after dispatching action
        setFormData({ title: '', platform: '', genre: '', status: 'wishlist', rating: '', notes: '', imageUrl: '' });
        onHide();
    };



    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton style={{ backgroundColor: '#292c3c', color: '#f0f0f8', borderColor: '#8caaee' }}>
                <Modal.Title>Add New Game</Modal.Title>
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
                            Add Game
                        </Button>
                    </div>

                </Form>
            </Modal.Body>

        </Modal>
    )
};

export default AddGameModal;