// server/index.js
require('dotenv').config();

const express      = require('express');
const mongoose     = require('mongoose');
const cors         = require('cors');
const cookieParser = require('cookie-parser');
const path         = require('path');

/* -------------------------- Routes -------------------------- */
const authRoutes       = require('./routes/auth');
const productsRoutes   = require('./routes/products');
const ordersRoutes     = require('./routes/orders');
const categoriesRoutes = require('./routes/categories');
const wishlistRoutes   = require('./routes/wishlist');
const reviewsRoutes    = require('./routes/reviews');
const settingsRoutes   = require('./routes/settings');
const uploadsRoutes    = require('./routes/uploads');
const adminRoutes      = require('./routes/admin');
const supportRoutes    = require('./routes/support');
const invoicesRoutes   = require('./routes/invoices');

const app  = express();
const PORT = Number(process.env.PORT || 5001);

/* -------------------- IMPORTANT ORDER -------------------- */
app.set('trust proxy', 1);

// (optional) request log
app.use((req, _res, next) => {
  console.log(req.method, req.path);
  next();
});

// parsers BEFORE routes
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ---------------------------- CORS ---------------------------- */
const allowList = new Set([
  'https://uni10.in',
  'https://www.uni10.in',
  'http://uni10.in',
  'http://www.uni10.in',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:8080',
  'https://ff8d2ba85401451bad453bb609262d07-vortex-hub.projects.builder.my',
]);
if (process.env.CLIENT_URL) allowList.add(process.env.CLIENT_URL);

app.use(
  cors({
    origin(origin, cb) {
      // server-to-server / curl (no Origin) => allow
      if (!origin) return cb(null, true);
      try {
        const url  = new URL(origin);
        const host = url.host;

        if (
          allowList.has(origin) ||
          /\.builder\.my$/.test(host) ||
          /\.builder\.codes$/.test(host) ||
          /\.projects\.builder\.codes$/.test(host) ||
          /localhost|127\.0\.0\.1/.test(host)
        ) {
          return cb(null, true);
        }
      } catch (_) {
        /* bad Origin => fallthrough to block */
      }
      console.warn('Blocked CORS for origin:', origin);
      return cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// NOTE (Express v5): koi explicit app.options('*')/app.options('(.*)') mat lagana.
// cors() preflight ko khud handle kar leta hai.

/* ------------------------- STATIC UPLOADS ------------------------- */
const uploadsDir = path.join(__dirname, 'uploads');
// Direct path (https://uni10.in/uploads/..)
app.use('/uploads', express.static(uploadsDir));
// Same folder via /api base (https://uni10.in/api/uploads/..)
app.use('/api/uploads', express.static(uploadsDir));
// Uploads POST/DELETE endpoints
app.use('/api/uploads', uploadsRoutes);

/* --------------------------- HEALTH CHECK ------------------------- */
app.get('/api/health', (_req, res) =>
  res.json({ ok: true, message: 'API running' })
);

/* ------------------------------ ROUTES ---------------------------- */
app.use('/api/auth',       authRoutes);
app.use('/api/products',   productsRoutes);
app.use('/api/orders',     ordersRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/wishlist',   wishlistRoutes);
app.use('/api/reviews',    reviewsRoutes);
app.use('/api/settings',   settingsRoutes);
app.use('/api/invoices',   invoicesRoutes);
app.use('/api/admin',      adminRoutes);
app.use('/api/support',    supportRoutes);

/* ------------------------- ERROR HANDLERS ------------------------- */
// Normalize CORS error to JSON (nahi to 500 HTML aata)
app.use((err, _req, res, next) => {
  if (err && err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'CORS: origin not allowed' });
  }
  return next(err);
});

// Last-resort error (JSON)
app.use((err, _req, res, _next) => {
  console.error('UNCAUGHT_ERROR:', err);
  res.status(500).json({ error: 'Internal error' });
});

/* ------------------------------- START ---------------------------- */
async function start() {
  const uri = process.env.MONGODB_URI;

  // DB optional boot (no hard crash if env missing)
  const listen = (note) =>
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}${note ? ' ' + note : ''}`);
      console.log('Static uploads at /uploads and /api/uploads');
    });

  if (!uri) {
    console.warn('MONGODB_URI not set; starting without DB.');
    return listen('(without DB)');
  }

  try {
    await mongoose.connect(uri, { dbName: 'UNI10' });
    console.log('Connected to MongoDB (UNI10)');

    // Seed admin/demo (fire-and-forget)
    (async () => {
      try {
        const User   = require('./models/User');
        const bcrypt = require('bcrypt');

        const adminEmail = 'uni10@gmail.com';
        const adminPwd   = '12345678';
        const demoEmail  = 'sachin@gmail.com';
        const demoPwd    = '123456';

        const admin = await User.findOne({ email: adminEmail.toLowerCase() });
        if (!admin) {
          const hash = await bcrypt.hash(adminPwd, 10);
          await User.create({
            name: 'UNI10 Admin',
            email: adminEmail.toLowerCase(),
            passwordHash: hash,
            role: 'admin',
          });
          console.log('Admin user created:', adminEmail);
        } else if (admin.role !== 'admin') {
          admin.role = 'admin';
          await admin.save();
          console.log('Existing user promoted to admin:', adminEmail);
        } else {
          console.log('Admin user already exists');
        }

        const demo = await User.findOne({ email: demoEmail.toLowerCase() });
        if (!demo) {
          const hash2 = await bcrypt.hash(demoPwd, 10);
          await User.create({
            name: 'Sachin',
            email: demoEmail.toLowerCase(),
            passwordHash: hash2,
            role: 'user',
          });
          console.log('Demo user created:', demoEmail);
        } else {
          console.log('Demo user already exists');
        }
      } catch (e) {
        console.error('Failed to seed users', e);
      }
    })();

    listen();
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    listen('(without DB)');
  }
}

start();
