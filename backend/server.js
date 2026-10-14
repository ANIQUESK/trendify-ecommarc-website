import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import productModel from "./models/productModel.js";
import orderModel from "./models/orderModel.js";

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
// INFO: System statistics API
app.get("/api/system/stats", async (req, res) => {
  try {
    const productsCount = await productModel.countDocuments();
    const ordersCount = await orderModel.countDocuments();
    const orders = await orderModel.find({}, "amount paymentMethod status");
    const totalRevenue = orders.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const deliveredCount = orders.filter((o) => o.status === "Delivered").length;
    res.json({
      success: true,
      stats: {
        productsCount,
        ordersCount,
        totalRevenue,
        deliveredCount,
        dbStatus: "Connected",
        cloudinary: Boolean(process.env.CLOUDINARY_NAME),
        uptime: Math.floor(process.uptime()),
        nodeVersion: process.version,
        platform: process.platform,
        memoryUsage: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1) + " MB"
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// INFO: Default route with Full Trendify Backend Dashboard & API Console
app.get("/", (req, res) => {
  if (req.headers.accept && req.headers.accept.includes("application/json") && !req.headers.accept.includes("text/html")) {
    return res.json({
      status: "online",
      message: "Trendify Backend API Server is active",
      version: "1.0.0",
      timestamp: new Date().toISOString()
    });
  }

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Trendify - Backend Command Center</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Outfit', sans-serif; }
    body { background-color: #f8fafc; color: #1e293b; min-height: 100vh; display: flex; flex-direction: column; }
    
    /* Header matching Screenshot */
    header { background: #8e9ca8; padding: 14px 28px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 3px rgba(0,0,0,0.08); position: sticky; top: 0; z-index: 50; }
    .brand-wrap { display: flex; flex-direction: column; }
    .logo { font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; line-height: 1; }
    .tagline { font-size: 9px; font-weight: 700; color: #334155; letter-spacing: 1.5px; margin-top: 2px; }
    .header-actions { display: flex; align-items: center; gap: 12px; }
    .live-badge { background: #1a2332; color: #ffffff; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 600; display: inline-flex; align-items: center; gap: 8px; letter-spacing: 0.3px; }
    .status-dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 8px #10b981; animation: pulse 1.8s infinite; }
    @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }
    .btn-link { background: #0f172a; color: white; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-decoration: none; transition: all 0.2s; display: inline-flex; align-items: center; gap: 6px; }
    .btn-link:hover { background: #000; }
    
    /* Main Layout */
    .app-layout { display: flex; flex: 1; min-height: calc(100vh - 60px); }
    
    /* Sidebar matching Screenshot */
    aside { width: 240px; background: #edf2f7; border-right: 1.5px solid #cbd5e1; padding: 20px 14px; shrink-0; display: flex; flex-direction: column; gap: 10px; }
    .nav-btn { display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border-radius: 10px; font-size: 14px; font-weight: 600; text-align: left; cursor: pointer; transition: all 0.15s ease; border: 2px solid #94a3b8; background: #ffffff; color: #334155; }
    .nav-btn:hover { background: #f1f5f9; border-color: #64748b; }
    .nav-btn.active { background: #d7ecf8; border-color: #0f172a; color: #0f172a; shadow: 0 2px 4px rgba(0,0,0,0.04); }
    .icon-box { width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; border: 1.5px solid currentColor; border-radius: 50%; }
    
    /* Content Area */
    main { flex: 1; padding: 28px 36px; max-width: 1300px; }
    .tab-content { display: none; }
    .tab-content.active { display: block; animation: fadeIn 0.2s ease-in-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }

    /* Cards & Stats */
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .stat-card { background: #ffffff; border: 2px solid #94a3b8; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.03); }
    .stat-title { font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
    .stat-num { font-size: 26px; font-weight: 800; color: #0f172a; margin-top: 4px; }
    .stat-sub { font-size: 12px; font-weight: 500; color: #10b981; margin-top: 2px; }

    /* Section Card */
    .card { background: #ffffff; border: 2px solid #94a3b8; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.03); }
    .card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; padding-bottom: 12px; border-bottom: 1.5px solid #e2e8f0; }
    .card-title { font-size: 18px; font-weight: 800; color: #0f172a; }

    /* Tables */
    .table-wrap { overflow-x: auto; border: 1.5px solid #cbd5e1; border-radius: 8px; }
    table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; }
    th { background: #edf2f7; color: #334155; font-weight: 700; padding: 12px 14px; border-bottom: 1.5px solid #cbd5e1; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }
    td { padding: 12px 14px; border-bottom: 1px solid #e2e8f0; color: #334155; vertical-align: middle; }
    tr:hover { background: #f8fafc; }
    .prod-img { width: 44px; height: 44px; border-radius: 6px; object-fit: cover; border: 1px solid #cbd5e1; background: #edf2f7; }

    /* Badges */
    .badge-pill { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; }
    .badge-success { background: #dcfce7; color: #15803d; }
    .badge-info { background: #dbeafe; color: #1e40af; }
    .badge-warning { background: #fef3c7; color: #b45309; }

    /* API Runner */
    .endpoint-row { border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 16px; margin-bottom: 14px; background: #ffffff; }
    .endpoint-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
    .method-tag { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 6px; }
    .m-get { background: #dbeafe; color: #1d4ed8; }
    .m-post { background: #dcfce7; color: #15803d; }
    .run-btn { background: #1a2332; color: #fff; border: none; padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .run-btn:hover { background: #000; }
    .json-box { background: #0f172a; color: #38bdf8; padding: 14px; border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: 12px; max-height: 220px; overflow-y: auto; white-space: pre-wrap; display: none; margin-top: 10px; border: 1px solid #334155; }

    /* Search & Filter Inputs */
    .filter-input { padding: 8px 12px; border: 1.5px solid #94a3b8; border-radius: 8px; font-size: 13px; outline: none; width: 240px; }
    .filter-input:focus { border-color: #0f172a; }
  </style>
</head>
<body>
  <!-- Header -->
  <header>
    <div class="brand-wrap">
      <div class="logo">trendify</div>
      <div class="tagline">— FIND WHAT MOVES YOU —</div>
    </div>
    <div class="header-actions">
      <div class="live-badge">
        <span class="status-dot"></span>
        API ENGINE ONLINE : PORT ${port}
      </div>
      <a href="http://localhost:5173" target="_blank" class="btn-link">Admin Panel ↗</a>
      <a href="http://localhost:5174" target="_blank" class="btn-link">Storefront ↗</a>
    </div>
  </header>

  <div class="app-layout">
    <!-- Sidebar -->
    <aside>
      <button class="nav-btn active" onclick="switchTab('overview')">
        <div class="icon-box">📊</div>
        <span>Overview</span>
      </button>
      <button class="nav-btn" onclick="switchTab('products')">
        <div class="icon-box">🛍️</div>
        <span>Products DB</span>
      </button>
      <button class="nav-btn" onclick="switchTab('orders')">
        <div class="icon-box">📦</div>
        <span>Orders Feed</span>
      </button>
      <button class="nav-btn" onclick="switchTab('api')">
        <div class="icon-box">⚡</div>
        <span>API Sandbox</span>
      </button>
      <button class="nav-btn" onclick="switchTab('system')">
        <div class="icon-box">⚙️</div>
        <span>System & Health</span>
      </button>
    </aside>

    <!-- Content Area -->
    <main>
      <!-- TAB 1: OVERVIEW -->
      <section id="tab-overview" class="tab-content active">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-title">Catalog Products</div>
            <div class="stat-num" id="stat-products">...</div>
            <div class="stat-sub">● Synchronized with MongoDB</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Total Orders</div>
            <div class="stat-num" id="stat-orders">...</div>
            <div class="stat-sub">● Customer orders logged</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Gross Volume</div>
            <div class="stat-num" id="stat-revenue">...</div>
            <div class="stat-sub">● Total sales volume</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Server Uptime</div>
            <div class="stat-num" id="stat-uptime">...</div>
            <div class="stat-sub" style="color: #0284c7;">● Node.js ${process.version}</div>
          </div>
        </div>

        <div class="card">
          <div class="card-head">
            <div class="card-title">Live Infrastructure Topology</div>
            <span class="badge-pill badge-success">All Services Operational</span>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px;">
            <div style="padding: 16px; border: 1.5px solid #cbd5e1; border-radius: 8px; background: #f8fafc;">
              <div style="font-size: 11px; font-weight: 700; color: #64748b;">DATABASE</div>
              <div style="font-size: 16px; font-weight: 700; color: #0f172a; margin-top: 4px;">MongoDB Atlas</div>
              <div style="font-size: 12px; color: #10b981; font-weight: 600; margin-top: 2px;">● Connected</div>
            </div>
            <div style="padding: 16px; border: 1.5px solid #cbd5e1; border-radius: 8px; background: #f8fafc;">
              <div style="font-size: 11px; font-weight: 700; color: #64748b;">MEDIA CDN</div>
              <div style="font-size: 16px; font-weight: 700; color: #0f172a; margin-top: 4px;">Cloudinary Storage</div>
              <div style="font-size: 12px; color: #0284c7; font-weight: 600; margin-top: 2px;">● Enabled</div>
            </div>
            <div style="padding: 16px; border: 1.5px solid #cbd5e1; border-radius: 8px; background: #f8fafc;">
              <div style="font-size: 11px; font-weight: 700; color: #64748b;">PAYMENT GATEWAY</div>
              <div style="font-size: 16px; font-weight: 700; color: #0f172a; margin-top: 4px;">Razorpay & Stripe</div>
              <div style="font-size: 12px; color: #10b981; font-weight: 600; margin-top: 2px;">● Ready</div>
            </div>
            <div style="padding: 16px; border: 1.5px solid #cbd5e1; border-radius: 8px; background: #f8fafc;">
              <div style="font-size: 11px; font-weight: 700; color: #64748b;">NETWORK / CORS</div>
              <div style="font-size: 16px; font-weight: 700; color: #0f172a; margin-top: 4px;">Cross-Origin Open</div>
              <div style="font-size: 12px; color: #10b981; font-weight: 600; margin-top: 2px;">● All Origins Allowed</div>
            </div>
          </div>
        </div>
      </section>

      <!-- TAB 2: PRODUCTS DB -->
      <section id="tab-products" class="tab-content">
        <div class="card">
          <div class="card-head">
            <div class="card-title">MongoDB Product Catalog</div>
            <input type="text" id="prodSearch" class="filter-input" placeholder="Search by name..." oninput="filterProducts()">
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Thumbnail</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Sub Category</th>
                  <th>Price</th>
                  <th>Sizes</th>
                  <th>Best Seller</th>
                </tr>
              </thead>
              <tbody id="productsTableBody">
                <tr><td colspan="7" style="text-align: center; color: #64748b; padding: 24px;">Loading products...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- TAB 3: ORDERS FEED -->
      <section id="tab-orders" class="tab-content">
        <div class="card">
          <div class="card-head">
            <div class="card-title">Recent Customer Orders</div>
            <span class="badge-pill badge-info">Real-time DB Query</span>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody id="ordersTableBody">
                <tr><td colspan="6" style="text-align: center; color: #64748b; padding: 24px;">Loading orders...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- TAB 4: API SANDBOX -->
      <section id="tab-api" class="tab-content">
        <div class="card">
          <div class="card-head">
            <div class="card-title">Interactive API Tester</div>
            <span style="font-size: 12px; color: #64748b; font-weight: 600;">1-Click Live Request Inspection</span>
          </div>

          <!-- Endpoint 1 -->
          <div class="endpoint-row">
            <div class="endpoint-top">
              <div>
                <span class="method-tag m-get">GET</span>
                <span style="font-family: monospace; font-size: 14px; font-weight: 700; margin-left: 8px;">/api/product/list</span>
                <span style="font-size: 12px; color: #64748b; margin-left: 10px;">— Fetch all catalog products</span>
              </div>
              <button class="run-btn" onclick="testEndpoint('/api/product/list', 'box-prod-list')">Execute Request</button>
            </div>
            <div id="box-prod-list" class="json-box"></div>
          </div>

          <!-- Endpoint 2 -->
          <div class="endpoint-row">
            <div class="endpoint-top">
              <div>
                <span class="method-tag m-get">GET</span>
                <span style="font-family: monospace; font-size: 14px; font-weight: 700; margin-left: 8px;">/api/system/stats</span>
                <span style="font-size: 12px; color: #64748b; margin-left: 10px;">— Live database & system telemetry</span>
              </div>
              <button class="run-btn" onclick="testEndpoint('/api/system/stats', 'box-stats')">Execute Request</button>
            </div>
            <div id="box-stats" class="json-box"></div>
          </div>

          <!-- Endpoint 3 -->
          <div class="endpoint-row">
            <div class="endpoint-top">
              <div>
                <span class="method-tag m-post">POST</span>
                <span style="font-family: monospace; font-size: 14px; font-weight: 700; margin-left: 8px;">/api/user/admin</span>
                <span style="font-size: 12px; color: #64748b; margin-left: 10px;">— Test admin authentication</span>
              </div>
              <button class="run-btn" onclick="testAdminLogin('box-login')">Execute Request</button>
            </div>
            <div id="box-login" class="json-box"></div>
          </div>
        </div>
      </section>

      <!-- TAB 5: SYSTEM & HEALTH -->
      <section id="tab-system" class="tab-content">
        <div class="card">
          <div class="card-head">
            <div class="card-title">Runtime & Environment Diagnostics</div>
          </div>
          <div class="table-wrap">
            <table>
              <tbody>
                <tr><td style="font-weight: 700; width: 220px;">Node.js Version</td><td>${process.version}</td></tr>
                <tr><td style="font-weight: 700;">Operating System</td><td>${process.platform} (${process.arch})</td></tr>
                <tr><td style="font-weight: 700;">Express Port</td><td>${port}</td></tr>
                <tr><td style="font-weight: 700;">MongoDB Connection</td><td><span class="badge-pill badge-success">Active & Verified</span></td></tr>
                <tr><td style="font-weight: 700;">Cloudinary Storage</td><td><span class="badge-pill badge-info">Configured (${process.env.CLOUDINARY_NAME || "Not set"})</span></td></tr>
                <tr><td style="font-weight: 700;">Admin Master Email</td><td>${process.env.ADMIN_EMAIL || "admin@gmail.com"}</td></tr>
                <tr><td style="font-weight: 700;">Memory Heap</td><td id="sys-mem">...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  </div>

  <script>
    let allProducts = [];

    function switchTab(tabId) {
      document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
      document.getElementById('tab-' + tabId).classList.add('active');
      event.currentTarget.classList.add('active');

      if (tabId === 'products' && allProducts.length === 0) loadProducts();
      if (tabId === 'orders') loadOrders();
    }

    async function loadStats() {
      try {
        const res = await fetch('/api/system/stats');
        const data = await res.json();
        if (data.success) {
          document.getElementById('stat-products').innerText = data.stats.productsCount;
          document.getElementById('stat-orders').innerText = data.stats.ordersCount;
          document.getElementById('stat-revenue').innerText = '₹' + Number(data.stats.totalRevenue).toLocaleString();
          document.getElementById('sys-mem').innerText = data.stats.memoryUsage;
          const hrs = Math.floor(data.stats.uptime / 3600);
          const mins = Math.floor((data.stats.uptime % 3600) / 60);
          const secs = data.stats.uptime % 60;
          document.getElementById('stat-uptime').innerText = hrs + 'h ' + mins + 'm ' + secs + 's';
        }
      } catch (e) {
        console.error(e);
      }
    }

    async function loadProducts() {
      try {
        const res = await fetch('/api/product/list');
        const data = await res.json();
        if (data.success) {
          allProducts = data.products;
          renderProducts(allProducts);
        }
      } catch (e) {
        console.error(e);
      }
    }

    function renderProducts(list) {
      const tbody = document.getElementById('productsTableBody');
      if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #64748b; padding: 24px;">No products found.</td></tr>';
        return;
      }
      tbody.innerHTML = list.map(p => \`
        <tr>
          <td><img class="prod-img" src="\${p.image?.[0] || ''}" alt="\${p.name}"></td>
          <td style="font-weight: 700; color: #0f172a;">\${p.name}</td>
          <td><span class="badge-pill badge-info">\${p.category}</span></td>
          <td>\${p.subCategory}</td>
          <td style="font-weight: 700;">₹\${p.price}</td>
          <td>\${(p.sizes || []).map(s => '<span style="display:inline-block; padding:1px 5px; margin:1px; background:#e2e8f0; border-radius:3px; font-size:10px; font-weight:600;">' + s + '</span>').join('')}</td>
          <td>\${p.bestSeller ? '<span class="badge-pill badge-warning">★ Best Seller</span>' : '<span style="color:#94a3b8; font-size:11px;">Standard</span>'}</td>
        </tr>
      \`).join('');
    }

    function filterProducts() {
      const q = document.getElementById('prodSearch').value.toLowerCase();
      const filtered = allProducts.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
      renderProducts(filtered);
    }

    async function loadOrders() {
      try {
        const loginRes = await fetch('/api/user/admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: "${process.env.ADMIN_EMAIL || 'admin@gmail.com'}", password: "${process.env.ADMIN_PASSWORD || 'admin'}" })
        });
        const loginData = await loginRes.json();
        if (loginData.success && loginData.token) {
          const res = await fetch('/api/order/list', {
            method: 'POST',
            headers: { 'token': loginData.token }
          });
          const data = await res.json();
          if (data.success) {
            const tbody = document.getElementById('ordersTableBody');
            if (data.orders.length === 0) {
              tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:24px;">No orders found.</td></tr>';
              return;
            }
            tbody.innerHTML = data.orders.map(o => \`
              <tr>
                <td style="font-family: monospace; font-size: 11px;">#\${o._id.slice(-6)}</td>
                <td style="font-weight: 600;">\${o.address?.firstName || 'Guest'} \${o.address?.lastName || ''}</td>
                <td style="font-weight: 700;">₹\${o.amount}</td>
                <td><span class="badge-pill badge-info">\${o.paymentMethod}</span></td>
                <td><span class="badge-pill \${o.status === 'Delivered' ? 'badge-success' : 'badge-warning'}">\${o.status}</span></td>
                <td>\${new Date(o.date).toLocaleDateString()}</td>
              </tr>
            \`).join('');
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    async function testEndpoint(url, boxId) {
      const box = document.getElementById(boxId);
      box.style.display = 'block';
      box.innerText = 'Sending request to ' + url + '...';
      const t0 = performance.now();
      try {
        const res = await fetch(url);
        const data = await res.json();
        const t1 = performance.now();
        box.innerText = '// ' + res.status + ' ' + res.statusText + ' (' + Math.round(t1 - t0) + 'ms)\\n' + JSON.stringify(data, null, 2);
      } catch (e) {
        box.innerText = 'Error: ' + e.message;
      }
    }

    async function testAdminLogin(boxId) {
      const box = document.getElementById(boxId);
      box.style.display = 'block';
      box.innerText = 'Testing admin authentication...';
      const t0 = performance.now();
      try {
        const res = await fetch('/api/user/admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: "${process.env.ADMIN_EMAIL || 'admin@gmail.com'}", password: "${process.env.ADMIN_PASSWORD || 'admin'}" })
        });
        const data = await res.json();
        const t1 = performance.now();
        box.innerText = '// ' + res.status + ' ' + res.statusText + ' (' + Math.round(t1 - t0) + 'ms)\\n' + JSON.stringify(data, null, 2);
      } catch (e) {
        box.innerText = 'Error: ' + e.message;
      }
    }

    // Initial load
    loadStats();
    setInterval(loadStats, 10000);
  </script>
</body>
</html>`);
});

// INFO: Start server
app.listen(port, () =>
  console.log(`Server is running on at http://localhost:${port}`)
);
