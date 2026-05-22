import { Router } from 'express';
import {
  getAllEventTypes,
  getEventTypeById,
  createEventType,
  updateEventType,
  deleteEventType,
} from '../controllers/eventType.controller';
import {
  validateCreateEventType,
  validateUpdateEventType,
} from '../validators/eventType.validator';

const router = Router();

router.get('/', getAllEventTypes);
router.get('/:id', getEventTypeById);
router.post('/', validateCreateEventType, createEventType);
router.put('/:id', validateUpdateEventType, updateEventType);
router.delete('/:id', deleteEventType);

export default router;
