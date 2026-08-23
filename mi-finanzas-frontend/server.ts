import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createProxyMiddleware } from "http-proxy-middleware";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT ?? 3000);
  const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8080";

  // Parse JSON bodies EXCEPT for API routes, which need the raw stream for the proxy
  const jsonParser = express.json({ limit: "10mb" });
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      next();
    } else {
      jsonParser(req, res, next);
    }
  });

  // Proxy /api al backend en dev Y producción (el proxy de vite.config.ts solo existe en dev)
  app.use(createProxyMiddleware({
    pathFilter: '/api',
    target: BACKEND_URL,
    changeOrigin: true,
  }));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    // Fallback for SPA in development
    app.use("*", async (req, res, next) => {
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
        template = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Mi Salud Financiera Server running on port ${PORT} (backend proxy → ${BACKEND_URL})`);
  });
}

startServer();
