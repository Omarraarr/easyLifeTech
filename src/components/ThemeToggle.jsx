import { useState, useEffect } from "react";
import { FaMoon } from "react-icons/fa";
import { LuSunMedium } from "react-icons/lu";
const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) return storedTheme;

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: light)"
    ).matches;
    return prefersDark ? "dark" : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className=" p-2 rounded transition-colors duration-300"
    >
      {theme === "dark" ? (
        <LuSunMedium className="text-yellow-500 w-5 h-5" />
      ) : (
        <FaMoon className="text-white w-5 h-5" />
      )}
    </button>
  );
};

export default ThemeToggle;
