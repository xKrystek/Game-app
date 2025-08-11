import { createContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { callUserAuthApi } from "../services";

export const TaskManagerContext = createContext(null);

function TaskManagerProvider({ children }) {
  const [board, setBoard] = useState({
    one: "",
    two: "",
    three: "",
    four: "",
    five: "",
    six: "",
    seven: "",
    eight: "",
    nine: "",
  });

  const formData = useForm({
    defaultValues: {
      name: "",
      label: "",
      placeholder: "",
      componentType: "",
      type: "",
    },
  });

  const [LoggingView, setLoggingView] = useState(true);

  const [player, setPlayer] = useState(true);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const verifyCookie = async () => {
      const response = await callUserAuthApi();

      if (response?.userCredentials) setUser(response?.userCredentials);
      // console.log(location);

      return response?.success
        ? navigate(
            location.pathname === "/" || location.pathname === "/auth"
              ? "/games"
              : `${location.pathname}`
          )
        : navigate("/auth")
    };
    verifyCookie();
  }, [location.pathname, navigate]);

  return (
    <TaskManagerContext.Provider
      value={{ board, setBoard, player, setPlayer, user, loading, setLoading, LoggingView, setLoggingView, location }}
    >
      {children}
    </TaskManagerContext.Provider>
  );
}

export default TaskManagerProvider;
