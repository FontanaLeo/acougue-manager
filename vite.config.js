import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Só no site gerado: o modo de desenvolvimento precisa de script em linha e WebSocket.
function politicaDeSeguranca(urlSupabase) {
    const destinos = ["'self'", urlSupabase && new URL(urlSupabase).origin].filter(Boolean).join(' ');
    const politica = [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self'",
        "img-src 'self' data:",
        `connect-src ${destinos}`,
        "object-src 'none'",
        "base-uri 'none'",
        "form-action 'self'",
    ].join('; ');

    return {
        name: 'politica-de-seguranca',
        apply: 'build',
        transformIndexHtml: () => [
            { tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: politica }, injectTo: 'head-prepend' },
        ],
    };
}

export default defineConfig(({ mode }) => ({
    plugins: [react(), politicaDeSeguranca(loadEnv(mode, process.cwd(), 'VITE_').VITE_SUPABASE_URL)],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
}));
