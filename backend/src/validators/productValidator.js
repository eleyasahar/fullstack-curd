import { body, param } from 'express-validator';

export const createProductValidation = [
  body('name').trim().notEmpty().withMessage('Product name zaroori hai'),

  body('description').trim().notEmpty().withMessage('Description zaroori hai'),

  body('price')
    .notEmpty()
    .withMessage('Price zaroori hai')
    .isFloat({ min: 0 })
    .withMessage('Price positive number honi chahiye'),

  body('stock')
    .notEmpty()
    .withMessage('Stock count zaroori hai')
    .isInt({ min: 0 })
    .withMessage('Stock non-negative integer hona chahiye'),
];

export const updateProductValidation = [
  param('id').isMongoId().withMessage('Invalid Product ID format'),

  body('name').optional().trim().notEmpty().withMessage('Name khali nahi ho sakta'),

  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Description khali nahi ho sakti'),

  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price positive number honi chahiye'),

  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock non-negative integer hona chahiye'),
];

export const productIdParamValidation = [
  param('id').isMongoId().withMessage('Invalid Product ID format'),
];