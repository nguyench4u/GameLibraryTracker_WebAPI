// UI Item #1: GameHeader.js
// GameHeader is a simple component that displays the title of the application and a brief description

import React from 'react';
import { Navbar, Container } from 'react-bootstrap';

const GameHeader = () => {
    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand>Game Library Tracker</Navbar.Brand>
            </Container>
        </Navbar>
    );
};

export default GameHeader; 