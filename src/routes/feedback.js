import { Router } from 'express';
import { submitFeedback } from '../controllers/feedback.js';

const router = Router({ mergeParams: true });

router.post('/', submitFeedback);
// GET is mounted separately in app.js with the secretKey middleware (Step 6).

export default router;
