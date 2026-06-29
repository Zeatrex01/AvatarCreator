# 🎨 Avatar Creator

A modern, standalone React application for generating, customizing, managing, and exporting high-quality avatars. Built with Vite, Tailwind CSS, and powered by the DiceBear API. This project is fully open source and deployable to Vercel, or it can be compiled into a standalone desktop application via Electron.

![App Preview](https://via.placeholder.com/1200x600.png?text=Avatar+Creator+App) <!-- Add your screenshot here -->

## ✨ Features

- **Avatar Customization:** Instantly generate completely random avatars or customize their facial hair, clothing, eyes, and skin color based on your specific needs.
- **My Library:** A premium glassmorphic drawer to save your favorite avatars locally, search through them, and load them back at any time.
- **Batch Export:** Export all of your saved avatars at once in a `.zip` file using `JSZip` and `FileSaver`.
- **Sprite Tool:** A powerful overlay module that allows you to upload custom images, crop them precisely using `react-image-crop`, and combine them with your avatar to generate cohesive sprite sheets.
- **Desktop Ready (Electron):** Includes built-in support to run and package the application as a standalone `.exe` desktop application without needing any servers.
- **Premium UI:** Built with modern design principles (glassmorphism, subtle animations, custom SVG layouts, and Tailwind CSS).

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/avatar-creator.git
cd avatar-creator
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
You can simply use the built-in batch file on Windows:
```bash
server_manager.bat
```
*(Select option `[1]` to start the web server, or run `npm run dev` manually).*

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Avatars:** [@dicebear/core & @dicebear/collection](https://www.dicebear.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Image Editing:** [react-image-crop](https://github.com/DominicTobias/react-image-crop)
- **Desktop Bundler:** [Electron](https://www.electronjs.org/) + [Electron Builder](https://www.electron.build/)

## 📦 Electron Desktop Build

To compile this project into a standalone Windows executable (`.exe`):
1. Open `server_manager.bat`
2. Select `[6] Masaustu Icin .EXE Uret (Electron Build)`
3. Grab your compiled `.exe` inside the `dist-electron` folder!

Alternatively, you can manually run:
```bash
npm run build:electron
```

## 🌐 Deploy to Vercel

This repository is optimized for Vercel deployment. 
1. Push this code to your GitHub.
2. Log into [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import the repository. Vercel will automatically detect Vite and configure the build settings (`npm run build` to `dist/`).
4. Click **Deploy**.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
