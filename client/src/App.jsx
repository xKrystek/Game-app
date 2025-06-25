import Board from "./board/board";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Authpage from "./pages/auth";

function App() {
  return (
    <Routes>
      <Route path={"/auth"} element={<Authpage />} />
      <Route path="/tic-tac-toe" element={<Board />} />
    </Routes>
  );
}

export default App;
