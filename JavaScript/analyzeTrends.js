import { Pool } from "pg";
import dotenv from "dotenv";
import readline from 'node:readline';

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
    } catch (error) {
        console.error("Error querying Sales", error);
    }
}

// Takes in a theater_id to return the theater_name
export async function queryTheaters(theater_id) {
    try {
        const res = await pool.query(`SELECT theater_name FROM theaters WHERE theater_id = ${theater_id}`);
        return res?.rows[0]?.theater_name;
    } catch (error) {
        console.error("Error querying Theaters", error);
    }
}

async function inputScript(){
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => {
        rl.question("Enter a date in YYYY-MM-DD format: ", (date) => {
            resolve(date);
            rl.close();
        });
    });
}

async function validateDate(date) {
    const checkDate = new Date(date);
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(date) && !isNaN(checkDate.getTime());
}

async function main() {
    const selectedDate = await inputScript();
    const isValidDate = await validateDate(selectedDate);
    
    if (isValidDate) {
        try {
            const saleResult = await querySales(selectedDate);
            if (saleResult?.theater_id && saleResult?.salesTotal) {
                const theaterResult = await queryTheaters(saleResult?.theater_id);
                console.log(`The best selling theater on ${selectedDate} was ${theaterResult} with a revenue of $${saleResult?.salesTotal}.`);
            } else {
                throw new Error("No data for that particular date.");
            }
        } catch (error) {
            console.error("Exception while running main script: ", error);
        }
    } else {
        console.error("You entered an invalid date.");
    }
    process.exit(0);
}

export async function obtainSales(date) {
    const isValidDate = await validateDate(date);
    
    if (isValidDate) {
        try {
            const saleResult = await querySales(date);
            if (saleResult?.theater_id && saleResult?.salesTotal) {
                const theaterResult = await queryTheaters(saleResult?.theater_id);
                return(`The best selling theater on ${date} was ${theaterResult} with a revenue of $${saleResult?.salesTotal}.`);
            } else {
                throw new Error("No data for that particular date.");
            }
        } catch (error) {
            console.error("Exception while running main script: ", error);
        }
    } else {
        console.error("You entered an invalid date.");
    }
    process.exit(0);
}
