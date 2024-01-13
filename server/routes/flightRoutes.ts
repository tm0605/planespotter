import { Router } from 'express';
import getFlights from '../controllers/flightController';
console.log('flightRoutes')
const router = Router();

router.get('/flights', getFlights); // Route to get flights

export default router;