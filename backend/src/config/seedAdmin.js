const User = require("../models/User");

/**
 * Seed a default admin user on server startup (if one doesn't already exist).
 * Reads credentials from environment variables.
 */
async function seedAdmin() {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || "admin@genovax.app").toLowerCase();
    const adminPass = process.env.ADMIN_PASS || "admin123";
    const adminName = process.env.ADMIN_NAME || "Admin";

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log(`[Seed] Admin already exists: ${adminEmail}`);
      return;
    }

    await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPass,
      role: "admin",
    });

    console.log(`[Seed] Default admin created: ${adminEmail}`);
  } catch (err) {
    console.error("[Seed] Error seeding admin user:", err.message);
  }
}

module.exports = seedAdmin;
