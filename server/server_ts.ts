import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import flightRoutes from './routes/flightRoutes';

const app: Express = express();
const PORT: number = parseInt(process.env.PORT as string, 10) || 5000; // Backend port

app.use(cors()); // Enable CORS for frontend access
app.use(express.json())

app.use('/api', flightRoutes);

// app.get('/', (req: Request, res: Response) => {
app.get('/', (_req: Request, res: Response) => {
    res.send('Backend is Running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});