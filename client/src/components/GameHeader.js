// UI Item #1: GameHeader.js
// GameHeader is a simple component that displays the title of the application

import React, { useState } from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { SlGameController } from "react-icons/sl";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../actions/gameActions';
import AuthModal from './AuthModal';

const GameHeader = () => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.token);
    const [showAuthModal, setShowAuthModal] = useState(false);

    return (
        <>
            <Navbar variant="dark" style={{ backgroundColor: '#292c3c', borderBottom: '2px solid #8caaee' }}>
                <Container className="d-flex justify-content-between align-items-center">
                    <Navbar.Brand style={{ color: '#8caaee', fontWeight: 'bold', fontSize: '1.4rem' }}>
                        <SlGameController size={35} style={{ color: '#ca9ee6' }} className="me-2"/>
                        Game Library Tracker
                    </Navbar.Brand>
                    {token ? (
                        <Button
                            size="sm"
                            onClick={() => dispatch(logout())}
                            style={{ backgroundColor: 'transparent', borderColor: '#e78284', color: '#e78284' }}
                        >
                            Logout
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            onClick={() => setShowAuthModal(true)}
                            style={{ backgroundColor: 'transparent', borderColor: '#8caaee', color: '#8caaee' }}
                        >
                            Login
                        </Button>
                    )}
                </Container>
            </Navbar>

            <AuthModal show={showAuthModal} onHide={() => setShowAuthModal(false)} />
        </>
    );
};

export default GameHeader;
