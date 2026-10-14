import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// INFO: Create express app mern stack
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// INFO: Middleware
app.use(express.json());
app.use(cors());

// INFO: API endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)
// INFO: Default route with sleek Trendify Backend UI
app.get("/", (req, res) => {
  // If client requests JSON, return JSON status
  if (req.headers.accept && req.headers.accept.includes("application/json")) {
    return res.json({
      status: "online",
      message: "Trendify Backend API is running smoothly",
      version: "1.0.0",
      timestamp: new Date().toISOString()
    });
  }

  // Otherwise serve the branded Trendify Server Dashboard UI
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Trendify - Backend API Server</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Outfit', sans-serif; }
        body { background: #f1f5f9; color: #1e293b; min-height: 100vh; display: flex; flex-direction: column; }
        header { background: #8e9ca8; padding: 16px 32px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .logo { font-size: 26px; font-weight: 700; color: #0f172a; letter-spacing: -0.5px; }
        .tagline { font-size: 10px; font-weight: 600; color: #334155; letter-spacing: 1.5px; margin-top: -3px; }
        .badge { background: #1a2332; color: #ffffff; padding: 6px 14px; border-radius: 9999px; font-size: 13px; font-weight: 500; display: inline-flex; align-items: center; gap: 8px; }
        .status-dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 10px #10b981; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
        main { flex: 1; max-width: 900px; width: 100%; margin: 40px auto; padding: 0 20px; }
        .hero-card { background: white; border: 2px solid #cbd5e1; border-radius: 14px; padding: 28px; margin-bottom: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .hero-title { font-size: 22px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
        .hero-desc { font-size: 14px; color: #64748b; line-height: 1.6; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-bottom: 24px; }
        .stat-card { background: white; border: 2px solid #cbd5e1; border-radius: 12px; padding: 20px; }
        .stat-label { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
        .stat-value { font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 6px; }
        .endpoints-card { background: white; border: 2px solid #cbd5e1; border-radius: 14px; padding: 24px; }
        .endpoints-title { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; }
        .endpoint-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; border: 1.5px solid #e2e8f0; border-radius: 8px; margin-bottom: 10px; transition: background 0.2s; }
        .endpoint-item:hover { background: #f8fafc; border-color: #cbd5e1; }
        .method { font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px; }
        .get { background: #dbeafe; color: #1e40af; }
        .post { background: #dcfce7; color: #166534; }
        .url { font-size: 13px; font-weight: 600; color: #334155; font-family: monospace; }
        .desc { font-size: 12px; color: #64748b; }
        footer { text-align: center; padding: 20px; font-size: 12px; color: #64748b; }
      </style>
    </head>
    <body>
      <header>
        <div>
          <div class="logo">trendify</div>
          <div class="tagline">— FIND WHAT MOVES YOU —</div>
        </div>
        <div class="badge">
          <span class="status-dot"></span>
          Backend API Live
        </div>
      </header>

      <main>
        <div class="hero-card">
          <div class="hero-title">🚀 Trendify Core Backend API</div>
          <div class="hero-desc">
            The Node.js Express server is active and serving request APIs for the Trendify E-Commerce Storefront and Admin Control Panel.
          </div>
        </div>

        <div class="grid">
          <div class="stat-card">
            <div class="stat-label">Database Status</div>
            <div class="stat-value" style="color: #059669;">● MongoDB Connected</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Media Cloud</div>
            <div class="stat-value" style="color: #0284c7;">● Cloudinary Active</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Port / Environment</div>
            <div class="stat-value">Port ${port}</div>
          </div>
        </div>

        <div class="endpoints-card">
          <div class="endpoints-title">
            <span>Core API Endpoints</span>
            <span style="font-size: 12px; font-weight: 500; color: #64748b;">REST v1</span>
          </div>

          <div class="endpoint-item">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span class="method get">GET</span>
              <a href="/api/product/list" target="_blank" class="url" style="color: #2563eb; text-decoration: none;">/api/product/list</a>
            </div>
            <span class="desc">Fetch all storefront products</span>
          </div>

          <div class="endpoint-item">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span class="method post">POST</span>
              <span class="url">/api/user/login</span>
            </div>
            <span class="desc">Customer authentication</span>
          </div>

          <div class="endpoint-item">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span class="method post">POST</span>
              <span class="url">/api/user/admin</span>
            </div>
            <span class="desc">Admin dashboard login</span>
          </div>

          <div class="endpoint-item">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span class="method post">POST</span>
              <span class="url">/api/order/list</span>
            </div>
            <span class="desc">List customer orders</span>
          </div>
        </div>
      </main>

      <footer>
        Trendify E-Commerce Engine &copy; ${new Date().getFullYear()} • Powered by Node.js, Express & MongoDB
      </footer>
    </body>
    </html>
  `);
});

// INFO: Start server
app.listen(port, () =>
  console.log(`Server is running on at http://localhost:${port}`)
);
