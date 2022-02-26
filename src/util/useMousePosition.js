import { useState, useEffect } from "react";

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ y: null });

  const updateMousePosition = (ev) => {
    setMousePosition({ y: ev.clientY + window.scrollY });
  };

  useEffect(() => {
    window.addEventListener("mousemove", updateMousePosition);

    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", updateMousePosition);

    return () => window.removeEventListener("scroll", updateMousePosition);
  }, []);

  return mousePosition;
};

export default useMousePosition;
