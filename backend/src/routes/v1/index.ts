import express from 'express';
import notesRouter from './notes';
import usersRouter from './users';
import { requiresAuth } from '../../middleware/auth';

const router = express.Router();

router.use('/notes', requiresAuth, notesRouter);
router.use('/users', usersRouter);

export default router;