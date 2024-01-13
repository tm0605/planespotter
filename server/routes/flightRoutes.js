import { Router } from 'express';
import getFlightsAll from '../controllers/flightController.js';
console.log('flightRoutes');
const router = Router();

router.get('/all', getFlightsAll); // Route to get flights

export default router;
