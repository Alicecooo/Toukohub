import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ base: '/Toukohub/', publicDir: 'content', plugins: [react()] });
