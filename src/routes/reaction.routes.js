import { Router } from 'express';
import { ReactionController } from '../controllers/reaction.controller.js';
import { reactionLimiter } from '../middlewares/rateLimiter.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { addReactionSchema } from '../validators/reaction.validator.js';

const router = Router();

router.get('/blogs/:blogId/reactions', ReactionController.getReactions);
router.post('/blogs/:blogId/reactions', reactionLimiter, validate(addReactionSchema), ReactionController.addReaction);
router.delete('/blogs/:blogId/reactions/:reactionType', reactionLimiter, ReactionController.removeReaction);

export default router;