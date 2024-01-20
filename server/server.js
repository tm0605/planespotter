import express from 'express';
import cors from 'cors';
import flightRoutes from './routes/flightRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 5000; // Backend port

app.use(cors()); // Enable CORS for frontend access
app.use(express.json());

app.use('/api/flights', flightRoutes);

app.use('/api/locations', locationRoutes);

// app.get('/', (req: Request, res: Response) => {
app.get('/', (_req, res) => {
    res.send('Backend is Running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
