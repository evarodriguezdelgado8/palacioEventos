import express from 'express';
import { getAllSalas, getSalaById } from '../controllers/salasController.js';

const router = express.Router();

router.get('/', getAllSalas);
router.get('/:id', getSalaById);

export default router;
