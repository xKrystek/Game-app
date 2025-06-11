import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import TaskManagerProvider from "./context/index.jsx";

createRoot(document.getElementById("root")).render(
  <TaskManagerProvider>
    <App />
  </TaskManagerProvider>
);
