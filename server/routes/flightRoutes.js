import { Router } from 'express';
import getFlightsBoundingBox from '../controllers/flightDbController.js';
import streamDataToPostgres from '../models/flightDbUpdateHttp.js';
const router = Router();

router.get('/bbox', getFlightsBoundingBox); // Route to get flights

router.get('/update', streamDataToPostgres); // Delete Later

export default router;
