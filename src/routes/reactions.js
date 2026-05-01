import { Router } from 'express';
import { react } from '../controllers/reactions.js';

const router = Router({ mergeParams: true });

router.post('/', react);

export default router;
