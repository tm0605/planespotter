import { Router } from 'express';
import getLocations from '../controllers/photoLocationController.js';
const router = Router();

router.get('/locationsAll', getLocations); // Route to get flights

export default router;