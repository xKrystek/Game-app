import "./App.css";
import { Route, Routes } from "react-router-dom";
import Authpage from "./pages/auth";
import Games from "./pages/games";
import Board from "./board/board";

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Authpage />} />
      <Route path="/tic-tac-toe" element={<Board />} />
      <Route path="/games" element={<Games />} />
    </Routes>
  );
}

export default App;
