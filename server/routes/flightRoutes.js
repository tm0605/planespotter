import { Router } from 'express';
import getFlightsBoundingBox from '../controllers/flightDbController.js';
const router = Router();

router.get('/', getFlightsBoundingBox); // Route to get flights

export default router;
