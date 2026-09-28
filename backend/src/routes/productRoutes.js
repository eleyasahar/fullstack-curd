import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import {
  createProductValidation,
  updateProductValidation,
  productIdParamValidation,
} from '../validators/productValidator.js';
import { validate } from '../middlewares/validate.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public Read Routes
router.get('/', getProducts);
router.get('/:id', productIdParamValidation, validate, getProductById);

// Protected Write Routes (Token Required)
router.post('/', authenticate, createProductValidation, validate, createProduct);
router.put('/:id', authenticate, updateProductValidation, validate, updateProduct);
router.delete('/:id', authenticate, productIdParamValidation, validate, deleteProduct);

export default router;