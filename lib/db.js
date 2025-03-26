import { Sequelize } from "sequelize";

// Load environment variables
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT || "3306";
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

if (!DB_HOST || !DB_NAME || !DB_USER || !DB_PASSWORD) {
    throw new Error("Database environment variables are missing.");
}

// Initialize Sequelize instance
export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: "mariadb", // Specify MariaDB
    logging: false, // Disable logging (set to `console.log` for debugging)
    define: {
        underscored: true, // Automatically converts camelCase to snake_case
    },
});

// Test connection
export async function testDbConnection() {
    try {
        await sequelize.authenticate();
        console.log("✅ Database connection successful!");
    } catch (error) {
        console.error("❌ Database connection failed:", error.message);
    }
}
