import './App.css';
import { Route, Routes } from 'react-router-dom';
import Authpage from './pages/auth';
import GamesMenu from './pages/games';
import BoardPage from './pages/boardPage';

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Authpage />} />
      <Route path="/tic-tac-toe" element={<BoardPage />} />
      <Route path="/games" element={<GamesMenu />} />
    </Routes>
  );
}

export default App;
