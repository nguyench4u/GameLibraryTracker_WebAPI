import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import GameHeader from './components/GameHeader';
import GameLibrary from './components/GameLibrary';

const App = () => {
  return (
    <Router>
      <GameHeader />
      <Routes>
        <Route path="/" element={<GameLibrary />} />
      </Routes>
    </Router>
  )
}

export default App;