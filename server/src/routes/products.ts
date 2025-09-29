import express from 'express';
import { check } from 'express-validator';
import { protect, authorize } from '../middleware/auth';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/products';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProduct);

// Protect and authorize all routes after this middleware
router.use(protect);
router.use(authorize('admin'));

router.post(
  '/',
  [
    check('name', 'Name is required').notEmpty(),
    check('description', 'Description is required').notEmpty(),
    check('price', 'Price must be a positive number').isFloat({ min: 0 }),
    check('category', 'Category must be either folding or capsule').isIn(['folding', 'capsule']),
    check('stock', 'Stock must be a positive integer').isInt({ min: 0 })
  ],
  createProduct
);

router.put(
  '/:id',
  [
    check('name', 'Name is required').optional().notEmpty(),
    check('price', 'Price must be a positive number').optional().isFloat({ min: 0 }),
    check('stock', 'Stock must be a positive integer').optional().isInt({ min: 0 })
  ],
  updateProduct
);

router.delete('/:id', deleteProduct);

export default router;