import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import flightRoutes from './routes/flightRoutes.js';
import locationRoutes from './routes/photoLocationRoutes.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 5000; // Backend port
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors()); // Enable CORS for frontend access
app.use(express.json());

app.use('/api/flights', flightRoutes);

app.use('/api/photo', locationRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// All remaining requests return the React app, so it can handle routing.
app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
