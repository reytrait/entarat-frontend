export function ThemeScript() {
  const codeToRunOnClient = `
(function() {
  const storageKey = 'entarat-theme';
  const defaultTheme = 'dark';
  
  function getTheme() {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored === 'dark' || stored === 'light') {
        return stored;
      }
    } catch (e) {
      // localStorage not available
    }
    return defaultTheme;
  }
  
  const theme = getTheme();
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
})();
  `.trim();

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: codeToRunOnClient,
      }}
    />
  );
}

