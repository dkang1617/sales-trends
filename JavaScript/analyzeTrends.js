import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
    user: process.env.DBUSER,
    host: process.env.HOST,
    database: process.env.DBNAME,
    password: process.env.PASSWORD,
    port: process.env.PORT,
});

// Takes in a selectedDate, and returns an object containing the theater_id and sales of the best selling theater
export async function querySales(selectedDate) {
    try {
        const res = await pool.query(`SELECT theater_id, SUM(sales) AS sales_total FROM sales WHERE date = '${selectedDate}' GROUP BY theater_id ORDER BY sales_total DESC LIMIT 1;`);
        return {theater_id: res?.rows[0]?.theater_id, salesTotal: res?.rows[0]?.sales_total};
    } catch (err) {
        console.error("Error executing query:", err);
    }
}
const selectedDate = "2025-05-09";
const res = await querySales(selectedDate);

console.log(res);

process.exit(0);