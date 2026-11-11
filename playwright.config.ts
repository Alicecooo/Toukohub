import { defineConfig, devices } from '@playwright/test';
export default defineConfig({ testDir: './e2e', webServer: { command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4173', url: 'http://127.0.0.1:4173/Toukohub/', reuseExistingServer: false }, use: { baseURL: 'http://127.0.0.1:4173/Toukohub/', ...devices['Desktop Chrome'] } });
