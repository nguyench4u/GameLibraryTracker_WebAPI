// AuthModal.js
// Modal with Sign In / Sign Up tabs for user authentication

import React, { useState } from 'react';
import { Modal, Button, Form, Nav } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { signIn, signUp } from '../actions/gameActions';

const AuthModal = ({ show, onHide }) => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('signin');
    const [error, setError] = useState('');

    const [signInForm, setSignInForm] = useState({ username: '', password: '' });
    const [signUpForm, setSignUpForm] = useState({ name: '', username: '', password: '' });

    const handleSignIn = async (e) => {
        e.preventDefault();
        setError('');
        const result = await dispatch(signIn(signInForm));
        if (result.success) {
            setSignInForm({ username: '', password: '' });
            onHide();
        } else {
            setError(result.error);
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        const result = await dispatch(signUp(signUpForm));
        if (result.success) {
            setSignUpForm({ name: '', username: '', password: '' });
            setActiveTab('signin'); // Switch to sign in tab after successful registration
        } else {
            setError(result.error);
        }
    };

    const handleTabSwitch = (tab) => {
        setActiveTab(tab);
        setError('');
    };

    const inputStyle = { backgroundColor: '#414559', color: '#f0f0f8', borderColor: '#8caaee' };
    const tabStyle = (tab) => ({
        color: activeTab === tab ? '#292c3c' : '#8caaee',
        backgroundColor: activeTab === tab ? '#8caaee' : 'transparent',
        border: '1px solid #8caaee',
        borderRadius: '6px 6px 0 0',
        cursor: 'pointer',
        padding: '6px 20px',
        fontWeight: 'bold',
        marginRight: '4px',
    });

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton className="btn-close-white" style={{ backgroundColor: '#292c3c', borderColor: '#8caaee', color: '#f0f0f8' }}>
                <Modal.Title>Welcome to Game Library Tracker</Modal.Title>
            </Modal.Header>

            <Modal.Body style={{ backgroundColor: '#292c3c', color: '#f0f0f8' }}>
                {/* Tabs */}
                <Nav className="mb-3" style={{ borderBottom: '1px solid #8caaee' }}>
                    <span style={tabStyle('signin')} onClick={() => handleTabSwitch('signin')}>Sign In</span>
                    <span style={tabStyle('signup')} onClick={() => handleTabSwitch('signup')}>Sign Up</span>
                </Nav>

                {/* Error message */}
                {error && (
                    <p style={{ color: '#e78284', fontSize: '0.875rem', marginBottom: '12px' }}>{error}</p>
                )}

                {/* Sign In Form */}
                {activeTab === 'signin' && (
                    <Form onSubmit={handleSignIn}>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text" placeholder="Enter username" required
                                value={signInForm.username}
                                onChange={(e) => setSignInForm({ ...signInForm, username: e.target.value })}
                                style={inputStyle}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password" placeholder="Enter password" required
                                value={signInForm.password}
                                onChange={(e) => setSignInForm({ ...signInForm, password: e.target.value })}
                                style={inputStyle}
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={onHide}>Cancel</Button>
                            <Button style={{ backgroundColor: '#8caaee', borderColor: '#8caaee', color: '#292c3c' }} type="submit">
                                Sign In
                            </Button>
                        </div>
                    </Form>
                )}

                {/* Sign Up Form */}
                {activeTab === 'signup' && (
                    <Form onSubmit={handleSignUp}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text" placeholder="Enter your name" required
                                value={signUpForm.name}
                                onChange={(e) => setSignUpForm({ ...signUpForm, name: e.target.value })}
                                style={inputStyle}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text" placeholder="Choose a username" required
                                value={signUpForm.username}
                                onChange={(e) => setSignUpForm({ ...signUpForm, username: e.target.value })}
                                style={inputStyle}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password" placeholder="Choose a password" required
                                value={signUpForm.password}
                                onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                                style={inputStyle}
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={onHide}>Cancel</Button>
                            <Button style={{ backgroundColor: '#a6d189', borderColor: '#a6d189', color: '#292c3c' }} type="submit">
                                Create Account
                            </Button>
                        </div>
                    </Form>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default AuthModal;
