import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { restrictTo } from '../middlewares/auth.middleware.js';
import {
  getStats,
  getUsers,
  updateUser,
  deleteUser,
  getListings,
  toggleListing,
  deleteAnyListing
} from '../controllers/admin.controller.js';

const router = Router();

router.use(protect, restrictTo('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/listings', getListings);
router.patch('/listings/:id/toggle', toggleListing);
router.delete('/listings/:id', deleteAnyListing);

export default router;
