import { useState, useEffect } from "react";

function DraggableBox() {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    // Attach listeners to the whole window
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // Cleanup listeners when component unmounts or dragging stops
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, offset]);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <div
        onMouseDown={handleMouseDown}
        style={{
          width: 100,
          height: 100,
          backgroundColor: "tomato",
          position: "absolute",
          left: position.x,
          top: position.y,
          cursor: "grab",
        }}
      />
    </div>
  );
}

export default DraggableBox;
