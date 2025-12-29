import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import Authpage from './pages/auth';
import GamesMenu from './pages/games';
import TicTacToePage from './pages/tic-tac-toePage';
import ShipsPage from './pages/shipsPage';
import DraggableBox from './draggablebox';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={<Authpage />} />
      <Route path="/tic-tac-toe" element={<TicTacToePage />} />
      <Route path="/games" element={<GamesMenu />} />
      <Route path="/ships" element={<ShipsPage />} />
      <Route path='/draggable' element={<DraggableBox />}/>
    </Routes>
  );
}

export default App;
