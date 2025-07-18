import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import TaskManagerProvider from "./context/index.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <TaskManagerProvider>
      <App />
    </TaskManagerProvider>
  </BrowserRouter>
);
