import { Router } from 'express';
import { createIdea, getIdea } from '../controllers/ideas.js';

const router = Router();

router.post('/', createIdea);
router.get('/:id', getIdea);

export default router;
