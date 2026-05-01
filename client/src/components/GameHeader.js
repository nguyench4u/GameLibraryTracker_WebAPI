// UI Item #1: GameHeader.js
// GameHeader is a simple component that displays the title of the application

import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import { SlGameController } from "react-icons/sl";

const GameHeader = () => {
    return (
        <Navbar variant="dark" style={{ backgroundColor: '#292c3c', borderBottom: '2px solid #8caaee' }}>
            <Container>
                <Navbar.Brand style={{ color: '#8caaee', fontWeight: 'bold', fontSize: '1.4rem' }}>
                    <SlGameController size={35} style={{ color: '#ca9ee6' }} className="me-2"/>
                    Game Library Tracker
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
};

export default GameHeader;
