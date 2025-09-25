// server/config/database.js (or just database.js)
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Load DB config from .env or fallback values
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'task_tracker'
};

// Function to initialize database and tables
async function initializeDatabase() {
    try {
        // Step 1: Connect WITHOUT selecting a database
        const tempPool = mysql.createPool({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        const tempConnection = await tempPool.getConnection();

        // Step 2: Create database if it doesn't exist
        await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
        tempConnection.release();
        await tempPool.end();

        // Step 3: Connect WITH the database
        const pool = mysql.createPool({
            ...dbConfig,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        const connection = await pool.getConnection();

        // Step 4: Create 'users' table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Step 5: Create 'tasks' table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                due_date DATE,
                priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
                status ENUM('Pending', 'Completed') DEFAULT 'Pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // Step 6: Create 'task_logs' table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS task_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                task_id INT NOT NULL,
                user_id INT NOT NULL,
                action VARCHAR(50) NOT NULL,
                completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        connection.release();
        console.log('✅ Database initialized successfully');
        return pool; // ⬅️ Export the working pool
    } catch (error) {
        console.error('❌ Database initialization error:', error);
        process.exit(1);
    }
}

// Immediately run and export the initialized pool
module.exports = initializeDatabase();
