const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");
const seedAdmin = require("./config/seedAdmin");

dotenv.config();

const app = express();

// Accept multiple allowed origins (comma-separated in CORS_ORIGINS env var,
// or fall back to the two standard Vite dev-server ports).
const ALLOWED_ORIGINS = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:3000", "http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, Postman, server-to-server)
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin "${origin}" not allowed.`));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Routes
const projectRoutes = require("./routes/projectRoutes");
const aiRoutes = require("./routes/aiRoutes");
const authRoutes = require("./routes/authRoutes");

app.get("/", (req, res) => {
  res.send("GenovaX Backend Running");
});

app.use("/api/projects", projectRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

// Try to connect to MongoDB and seed admin.
// If MongoDB is unavailable, the server still starts but auth features won't work.
async function startServer() {
  try {
    await connectDB();
    console.log("[Server] MongoDB connected successfully.");
    await seedAdmin();
  } catch (err) {
    console.warn("============================================");
    console.warn("[Server] WARNING: MongoDB is not available!");
    console.warn(`[Server] Reason: ${err.message}`);
    console.warn("[Server] Auth features will NOT work until MongoDB is running.");
    console.warn("[Server] AI generation (without auth) may still work.");
    console.warn("============================================");
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Allowed CORS origins: ${ALLOWED_ORIGINS.join(", ")}`);
  });
}

startServer();