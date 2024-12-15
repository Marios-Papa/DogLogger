import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { createDog, updateDog, deleteDog, getDogs } from '../controllers/dog.controller';
import cookieParser from 'cookie-parser';

const router = Router();

// Public endpoint to list dogs
router.get('/', getDogs);
// Private endpoints to create, update, and delete dogs
router.use(cookieParser());
router.use(authMiddleware);
router.post('/', createDog);
router.put('/:id', updateDog);
router.delete('/:id', deleteDog);

export default router;
