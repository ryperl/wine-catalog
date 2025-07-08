import { Router } from 'express';
import { body } from 'express-validator';
import {
  getWines,
  getWine,
  createWine,
  updateWine,
  deleteWine,
} from '../controllers/wineController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all wine routes
router.use(authenticate);

// Validation rules for wine data
const wineValidation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Wine name is required and must be less than 200 characters'),
  body('producer')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Producer is required and must be less than 200 characters'),
  body('vintage')
    .isInt({ min: 1800, max: new Date().getFullYear() })
    .withMessage('Vintage must be a valid year between 1800 and current year'),
  body('region.country')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Country is required'),
  body('region.area')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Area is required'),
  body('grapes')
    .isArray({ min: 1 })
    .withMessage('At least one grape variety is required'),
  body('grapes.*')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Grape variety cannot be empty'),
  body('style')
    .isIn(['red', 'white', 'rosé', 'sparkling', 'dessert'])
    .withMessage('Style must be one of: red, white, rosé, sparkling, dessert'),
  body('alcohol')
    .isFloat({ min: 0, max: 50 })
    .withMessage('Alcohol content must be between 0 and 50%'),
  body('tastingNotes.aroma')
    .isArray({ min: 1 })
    .withMessage('At least one aroma note is required'),
  body('tastingNotes.taste')
    .isArray({ min: 1 })
    .withMessage('At least one taste note is required'),
  body('cellar.quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  body('cellar.purchaseDate')
    .isISO8601()
    .withMessage('Purchase date must be a valid date'),
];

// Validation rules for wine updates (optional fields)
const wineUpdateValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Wine name must be less than 200 characters'),
  body('producer')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Producer must be less than 200 characters'),
  body('vintage')
    .optional()
    .isInt({ min: 1800, max: new Date().getFullYear() })
    .withMessage('Vintage must be a valid year between 1800 and current year'),
  body('region.country')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Country cannot be empty'),
  body('region.area')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Area cannot be empty'),
  body('grapes')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one grape variety is required'),
  body('grapes.*')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Grape variety cannot be empty'),
  body('style')
    .optional()
    .isIn(['red', 'white', 'rosé', 'sparkling', 'dessert'])
    .withMessage('Style must be one of: red, white, rosé, sparkling, dessert'),
  body('alcohol')
    .optional()
    .isFloat({ min: 0, max: 50 })
    .withMessage('Alcohol content must be between 0 and 50%'),
  body('tastingNotes.aroma')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one aroma note is required'),
  body('tastingNotes.taste')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one taste note is required'),
  body('cellar.quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  body('cellar.purchaseDate')
    .optional()
    .isISO8601()
    .withMessage('Purchase date must be a valid date'),
];

// Routes
router.get('/', getWines);
router.get('/:id', getWine);
router.post('/', wineValidation, createWine);
router.put('/:id', wineUpdateValidation, updateWine);
router.delete('/:id', deleteWine);

export default router;
