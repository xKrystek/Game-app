import Board from "./board/board";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import SignUp from "./pages/sign-up";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignUp />} />
    </Routes>
  );
}

export default App;
