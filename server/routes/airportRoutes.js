import { Router } from 'express';
import getAirport from '../controllers/airportController.js';
const router = Router();

router.get('/', getAirport); // Route to get flights

export default router;