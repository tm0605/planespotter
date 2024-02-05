import { Router } from 'express';
import updateActivity from '../controllers/activityController.js';
const router = Router();

router.post('/', updateActivity);

export default router;