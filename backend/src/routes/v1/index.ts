import express from 'express';
import notesRouter from './notes';
import usersRouter from './users';

const router = express.Router();

router.use('/notes', notesRouter);
router.use('/users', usersRouter);

export default router;