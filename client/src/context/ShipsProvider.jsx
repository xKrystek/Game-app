import { useState } from "react";
import { ShipsContext } from "./ShipsContext";

function ShipsProvider({ children }) {

  const [highlighted, setHighlighted] = useState({
    '1': [],
    '2': [],
    '3': [],
    '4': [],
    '5': [],
    '6': [],
  });

  return (
    <ShipsContext.Provider value={{ highlighted, setHighlighted }}>
      {children}
    </ShipsContext.Provider>
  );
}

export default ShipsProvider;