# Theme Script Testing Guide

## Quick Tests

### 1. Check if Script is Loading
1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Reload the page
4. Look for `theme-init.js` - it should load with status 200
5. Check the **Timing** - it should load early (before other resources)

### 2. Check if Theme Class is Applied
1. Open DevTools (F12)
2. Go to **Elements/Inspector** tab
3. Select the `<html>` element
4. Check if it has `class="dark"` or `class="light"` **immediately** on page load
5. The class should be there BEFORE React hydrates

### 3. Test Theme Persistence
1. Use the theme toggle button to switch themes
2. Reload the page (Cmd/Ctrl + R)
3. The theme should persist - no flash of wrong theme
4. Check `localStorage.getItem('entarat-theme')` in Console

### 4. Test No Flash
1. Open DevTools
2. Go to **Network** tab
3. Enable **Slow 3G** throttling
4. Reload the page
5. Watch the page - you should NOT see a flash of wrong theme
6. The correct theme should be visible from the very first paint

### 5. Console Testing
Open browser Console and run:

```javascript
// Check current theme in localStorage
localStorage.getItem('entarat-theme')

// Check current theme class on HTML
document.documentElement.classList.contains('dark') // true or false
document.documentElement.classList.contains('light') // true or false

// Manually set theme
localStorage.setItem('entarat-theme', 'light')
location.reload() // Should apply light theme

localStorage.setItem('entarat-theme', 'dark')
location.reload() // Should apply dark theme
```

### 6. Performance Test
1. Open DevTools
2. Go to **Performance** tab
3. Record a page load
4. Check the timeline - `theme-init.js` should execute very early
5. The theme class should be applied before first paint

### 7. Test Script Execution
Add this to `theme-init.js` temporarily to verify it runs:

```javascript
console.log('Theme script executed!', new Date().getTime());
```

You should see this log in the console immediately on page load.

## Expected Behavior

✅ **Correct:**
- Theme class is on `<html>` element immediately
- No flash when reloading page
- Theme persists across page reloads
- Script loads before other resources

❌ **Incorrect:**
- Flash of wrong theme on reload
- Theme class appears after page renders
- Script doesn't load or loads late
- Theme doesn't persist

## Debugging

If it's not working:

1. **Check script is loading:**
   - Network tab → Look for `theme-init.js`
   - Check if it's 404 or blocked

2. **Check script execution:**
   - Add `console.log` to script
   - Check Console for errors

3. **Check localStorage:**
   - Console → `localStorage.getItem('entarat-theme')`
   - Should return 'dark' or 'light'

4. **Check HTML element:**
   - Elements tab → `<html>` should have theme class
   - Check if class is removed/added by React

5. **Check Next.js Script component:**
   - Verify `strategy="beforeInteractive"` is set
   - Check if script is in `<head>` in page source

