# Desktop App Build Guide (Optional)

This project has been optimized for web deployment (Vercel) and uses Progressive Web App (PWA) features for lightweight desktop usage. 

However, if a developer wishes to wrap this React application into a standalone `.exe` offline application using Electron, follow these steps:

### 1. Install Electron Dependencies
Run the following command in your terminal to install the necessary packages for Electron:
```bash
npm install --save-dev electron electron-builder concurrently cross-env wait-on
```

### 2. Add Configuration to `package.json`
Add the following blocks to your `package.json`:

**Add to "scripts":**
```json
"dev:electron": "concurrently \"vite\" \"cross-env IS_DEV=true wait-on http://localhost:5173 && electron .\"",
"build:electron": "vite build && electron-builder"
```

**Add to root:**
```json
"main": "electron.cjs",
"build": {
  "appId": "com.avatarcreator.app",
  "productName": "Avatar Creator",
  "directories": {
    "output": "dist-electron"
  },
  "files": [
    "dist/**/*",
    "electron.cjs"
  ],
  "win": {
    "target": "nsis"
  }
}
```

### 3. Create `electron.cjs`
Create a file named `electron.cjs` in the root directory and paste the standard Electron window initialization code inside it (pointing to `dist/index.html` on production and `localhost:5173` on development).

### 4. Build
- Run `npm run dev:electron` to test the desktop app.
- Run `npm run build:electron` to compile an `.exe` file into the `dist-electron` folder.
