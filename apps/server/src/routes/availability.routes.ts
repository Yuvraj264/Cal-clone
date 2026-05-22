import { Router } from 'express';
import {
  getAllAvailabilities,
  getAvailabilityById,
  createAvailability,
  updateAvailability,
  deleteAvailability,
} from '../controllers/availability.controller';
import {
  validateCreateAvailability,
  validateUpdateAvailability,
} from '../validators/availability.validator';

const router = Router();

router.get('/', getAllAvailabilities);
router.get('/:id', getAvailabilityById);
router.post('/', validateCreateAvailability, createAvailability);
router.put('/:id', validateUpdateAvailability, updateAvailability);
router.delete('/:id', deleteAvailability);

export default router;
