import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
// import { createServer } from 'http';
// import WebSocket from 'ws';
import flightRoutes from './routes/flightRoutes.js';
import locationRoutes from './routes/photoLocationRoutes.js';
import airportRoutes from './routes/airportRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import vhost from 'vhost';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const apiApp = express();
const PORT = parseInt(process.env.PORT, 10) || 5000; // Backend port
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors()); // Enable CORS for frontend access
apiApp.use(cors());
app.use(express.json());

apiApp.use('/flights', flightRoutes);

apiApp.use('/photo', locationRoutes);

apiApp.use('/airport', airportRoutes);

apiApp.use('/activity', activityRoutes);

apiApp.get('*', (_req, res) => {
  res.status(200).json({ message: 'This is the backend' });
})

app.use(vhost('api.plane-spotter.takuyamiyamoto.com', apiApp));
// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// All remaining requests return the React app, so it can handle routing.
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
