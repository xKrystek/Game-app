import Board from "./board/board";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import SignUp from "./pages/sign-up";
import SignIn from "./pages/sign-in";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/tic-tac-toe" element={<Board/>} />
    </Routes>
  );
}

export default App;
