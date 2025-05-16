import express from 'express';
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { obtainSales } from './analyzeTrends.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(dirname, 'www')));

app.post("/api/bestSeller", async (req, res) => {
    const { date } = req.body;
    if (!date) {
        return res.status(404).json({ error: "Did not receive a date." });
    }
    const response = await obtainSales(date.toString());
    res.json({ message: response });
});

app.listen(3000, () => {
    console.log("App started on port 3000.");
});
