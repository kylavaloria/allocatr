import express from 'express';
import {
  getAllResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  getResourceWithCalculations
} from '../controllers/resourceController.js';

const router = express.Router();

// GET /api/resources - Get all resources with calculated fields
router.get('/', getAllResources);

// GET /api/resources/:id - Get single resource by ID
router.get('/:id', getResourceById);

// GET /api/resources/:id/details - Get resource with all calculations and tasks
router.get('/:id/details', getResourceWithCalculations);

// POST /api/resources - Create new resource
router.post('/', createResource);

// PUT /api/resources/:id - Update resource
router.put('/:id', updateResource);

// DELETE /api/resources/:id - Delete resource
router.delete('/:id', deleteResource);

export default router;
