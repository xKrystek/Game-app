import { createContext, useState } from "react";
import { useForm } from "react-hook-form";

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

  const [player, setPlayer] = useState(true);

  return (
    <TaskManagerContext.Provider value={{ board, setBoard, player, setPlayer }}>
      {children}
    </TaskManagerContext.Provider>
  );
}

export default TaskManagerProvider;
