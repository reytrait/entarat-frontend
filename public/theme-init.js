(() => {
  console.log("🎨 Theme script executing at:", Date.now());

  const STORAGE_KEY = "entarat-theme";
  const DEFAULT_THEME = "dark";
  const VALID_THEMES = ["dark", "light"];

  function getStoredTheme() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) ?? "";
      console.log("📦 Stored theme:", stored);
      return VALID_THEMES.includes(stored) ? stored : null;
    } catch {
      return null;
    }
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    // Tailwind only uses 'dark' class - remove it for light mode
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    console.log("✅ Theme applied:", theme, "Classes:", root.className);
  }

  const theme = getStoredTheme() || DEFAULT_THEME;
  applyTheme(theme);
})();
