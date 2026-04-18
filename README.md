# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Browser Extension

This workspace includes an unpacked browser extension in the `extension/` folder.
The site also serves a downloadable ZIP at `/downloads/cybercoach-extension.zip`.

To use it:

1. Start the backend API on `http://localhost:5000`.
2. Download the ZIP from the website or use the `extension/` folder directly.
3. Open `chrome://extensions/` in Chrome or Edge.
4. Enable Developer mode.
5. Click Load unpacked and choose the `extension/` folder, or extract the ZIP first.
6. Open the extension popup and scan a URL or the current tab.

## Running the backend locally

1. Open a terminal in `SpamMailModel`.
2. Activate the workspace virtual environment if needed.
3. Install dependencies with `pip install -r requirements.txt`.
4. Run `python url_api.py` from the `SpamMailModel` folder.
5. The API will be available at `http://localhost:5000`.

The React app and the extension popup both call the same `/api/classify` endpoint.
