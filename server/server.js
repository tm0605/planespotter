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
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 5000; // Backend port
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// // Create an HTTP server from the Express app
// const server = createServer(app);

// // Create a WebSocket server
// const wss = new WebSocket.Server({ server });

// wss.on('connection', (ws) => {
//   console.log('Client connected');

//   ws.on('message', (message) => {
//     console.log(`Received message: ${message}`);
//     // Here you can handle incoming messages, such as activity signals
//   });

//   ws.on('close', () => {
//     console.log('Client disconnected');
//   });

//   // You could also send messages to the client if needed
// });

app.use(cors()); // Enable CORS for frontend access
app.use(express.json());

app.use('/api/flights', flightRoutes);

app.use('/api/photo', locationRoutes);

app.use('/api/airport', airportRoutes);

app.use('/api/activity', activityRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// All remaining requests return the React app, so it can handle routing.
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
