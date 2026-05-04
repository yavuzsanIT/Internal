import pool from './mysql';

export async function setupTables() {
    const createOeCodesTable = `
        CREATE TABLE IF NOT EXISTS oe_codes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            oe VARCHAR(50) NOT NULL UNIQUE
        );
    `;

    const createOeYvMapTable = `
        CREATE TABLE IF NOT EXISTS oe_yv_map (
            id INT AUTO_INCREMENT PRIMARY KEY,
            oe_id INT NOT NULL,
            yv VARCHAR(50) NOT NULL,
            FOREIGN KEY (oe_id) REFERENCES oe_codes(id),
            INDEX (yv)
        );
    `;

    const conn = await pool.getConnection();
    try {
        console.log("Creating tables...");

        await conn.query(createOeCodesTable);
        await conn.query(createOeYvMapTable);

        console.log("Tables ready.");
    } finally {
        conn.release();
    }
}
