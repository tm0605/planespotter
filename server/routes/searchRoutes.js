import { Router } from 'express';
import getSearchResults from '../controllers/searchController.js';
const router = Router();

router.get('/', getSearchResults);

export default router;