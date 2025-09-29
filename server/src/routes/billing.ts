import express from 'express';
import { check } from 'express-validator';
import { protect } from '../middleware/auth';
import {
  addBillingMethod,
  getBillingMethods,
  updateBillingMethod,
  deleteBillingMethod,
  setDefaultBillingMethod
} from '../controllers/billing';

const router = express.Router();

// Protect all routes
router.use(protect);

router.get('/', getBillingMethods);

router.post(
  '/',
  [
    check('cardNumber', 'Please provide a valid card number').isCreditCard(),
    check('expiryMonth', 'Please provide a valid expiry month').matches(/^(0[1-9]|1[0-2])$/),
    check('expiryYear', 'Please provide a valid expiry year').matches(/^20[2-9][0-9]$/),
    check('cvv', 'Please provide a valid CVV').matches(/^[0-9]{3,4}$/),
    check('billingName', 'Please provide the billing name').notEmpty(),
    check('billingAddress.street', 'Please provide the street address').notEmpty(),
    check('billingAddress.city', 'Please provide the city').notEmpty(),
    check('billingAddress.state', 'Please provide the state/province').notEmpty(),
    check('billingAddress.postalCode', 'Please provide the postal code').notEmpty(),
    check('billingAddress.country', 'Please provide the country').notEmpty()
  ],
  addBillingMethod
);

router.put(
  '/:id',
  [
    check('billingName', 'Please provide the billing name').optional().notEmpty(),
    check('billingAddress.street', 'Please provide the street address').optional().notEmpty(),
    check('billingAddress.city', 'Please provide the city').optional().notEmpty(),
    check('billingAddress.state', 'Please provide the state/province').optional().notEmpty(),
    check('billingAddress.postalCode', 'Please provide the postal code').optional().notEmpty(),
    check('billingAddress.country', 'Please provide the country').optional().notEmpty()
  ],
  updateBillingMethod
);

router.delete('/:id', deleteBillingMethod);

router.put('/:id/default', setDefaultBillingMethod);

export default router;