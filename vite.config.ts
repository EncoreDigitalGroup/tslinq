import {resolve} from "path";
import {defineConfig} from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, "src/index.ts"),
            name: "TSLinq",
            formats: ["es", "cjs"],
            fileName: format => `index.${format === "es" ? "js" : "cjs"}`,
        },
        sourcemap: true,
        minify: false,
        outDir: "dist",
        emptyOutDir: true,
    },
    plugins: [
        dts({
            rollupTypes: true,
            tsconfigPath: "./tsconfig.json",
        }),
    ],
});
