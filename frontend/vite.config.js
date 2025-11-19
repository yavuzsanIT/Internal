import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// https://vitejs.dev/config/
export default defineConfig(function (_a) {
    var _b, _c;
    var mode = _a.mode;
    // load env variables for current mode (development/production)
    var env = loadEnv(mode, ((_c = (_b = globalThis.process) === null || _b === void 0 ? void 0 : _b.cwd) === null || _c === void 0 ? void 0 : _c.call(_b)) || '.', '');
    var base = env.VITE_BASE || '/';
    return {
        base: base,
        plugins: [react()],
        server: {
            port: 5173,
            open: true,
        },
        build: {
            outDir: 'dist',
            sourcemap: false,
        },
    };
});
