import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.post("/api/feedback", (req, res) => {
    const { name, email, message } = req.body;
    
    // In a real production app, you would use a service like SendGrid, Mailgun, or AWS SES
    // to send the email to the address stored in process.env.FEEDBACK_EMAIL.
    const recipientEmail = process.env.FEEDBACK_EMAIL || "yvonnemrtnz@gmail.com";
    
    console.log(`Feedback received for ${recipientEmail}:`, { name, email, message });
    
    // Simulate successful email sending
    res.json({ success: true, message: "Feedback sent privately." });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
