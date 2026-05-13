import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON
  app.use(express.json());

  // API Route for health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Proxy endpoint for Blogger to avoid CORS
  app.get("/api/proxy/blogger", async (req, res) => {
    const blogUrl = req.query.url as string;
    if (!blogUrl) {
      return res.status(400).json({ error: "Missing blog URL" });
    }

    // Clean the URL and ensure it ends with /feeds/posts/default?alt=json
    let feedUrl = blogUrl;
    if (!feedUrl.includes("/feeds/")) {
      feedUrl = feedUrl.replace(/\/$/, "");
      feedUrl = `${feedUrl}/feeds/posts/default?alt=json`;
    }

    try {
      const response = await fetch(feedUrl);
      if (!response.ok) {
        throw new Error(`Blogger responded with ${response.status}`);
      }
      const data = await response.json();
      res.json(data);
    } catch (err: any) {
      console.error("[Proxy Error]", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Handle SPA and assets
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    // Fallback for development mode to serve index.html
    app.get("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const fs = await import("fs/promises");
        let template = await fs.readFile(path.resolve(__dirname, "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
