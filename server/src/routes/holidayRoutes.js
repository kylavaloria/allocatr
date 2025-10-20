import express from 'express';
import {
  getAllHolidays,
  getHolidayById,
  getHolidaysByDateRange,
  createHoliday,
  updateHoliday,
  deleteHoliday
} from '../controllers/holidayController.js';

const router = express.Router();

// GET /api/holidays/range?start=YYYY-MM-DD&end=YYYY-MM-DD - Get holidays in date range
// IMPORTANT: This must come BEFORE /:id route to avoid conflict
router.get('/range', getHolidaysByDateRange);

// GET /api/holidays - Get all holidays
router.get('/', getAllHolidays);

// GET /api/holidays/:id - Get single holiday by ID
router.get('/:id', getHolidayById);

// POST /api/holidays - Create new holiday
router.post('/', createHoliday);

// PUT /api/holidays/:id - Update holiday
router.put('/:id', updateHoliday);

// DELETE /api/holidays/:id - Delete holiday
router.delete('/:id', deleteHoliday);

export default router;
