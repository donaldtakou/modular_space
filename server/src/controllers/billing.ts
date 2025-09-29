import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Billing from '../models/Billing';
import Stripe from 'stripe';

// Initialize stripe only if we have a secret key
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16'
    })
  : null;

// @desc    Get user's billing methods
// @route   GET /api/billing
// @access  Private
export const getBillingMethods = async (req: Request, res: Response) => {
  try {
    const billingMethods = await Billing.find({ user: req.user.id });

    res.json({
      success: true,
      count: billingMethods.length,
      data: billingMethods
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Add new billing method
// @route   POST /api/billing
// @access  Private
export const addBillingMethod = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      cardNumber,
      expiryMonth,
      expiryYear,
      cvv,
      billingName,
      billingAddress,
      isDefault = false
    } = req.body;

    // Create or get Stripe customer
    let customer;
    if (!req.user.stripeCustomerId) {
      customer = await stripe.customers.create({
        email: req.user.email,
        name: billingName
      });

      // Update user with Stripe customer ID
      await req.user.update({ stripeCustomerId: customer.id });
    } else {
      customer = await stripe.customers.retrieve(req.user.stripeCustomerId);
    }

    // Add card to Stripe
    const token = await stripe.tokens.create({
      card: {
        number: cardNumber,
        exp_month: expiryMonth,
        exp_year: expiryYear,
        cvc: cvv
      }
    });

    const card = await stripe.customers.createSource(customer.id, {
      source: token.id
    });

    // Create billing method in database
    const billingMethod = await Billing.create({
      user: req.user.id,
      cardLast4: cardNumber.slice(-4),
      cardType: (card as Stripe.Card).brand,
      expiryMonth,
      expiryYear,
      billingName,
      billingAddress,
      isDefault,
      stripeCustomerId: customer.id
    });

    res.status(201).json({
      success: true,
      data: billingMethod
    });
  } catch (err) {
    if (err.type === 'StripeCardError') {
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update billing method
// @route   PUT /api/billing/:id
// @access  Private
export const updateBillingMethod = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let billingMethod = await Billing.findById(req.params.id);

    if (!billingMethod) {
      return res.status(404).json({
        success: false,
        error: 'Billing method not found'
      });
    }

    // Make sure user owns billing method
    if (billingMethod.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized'
      });
    }

    billingMethod = await Billing.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      data: billingMethod
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Delete billing method
// @route   DELETE /api/billing/:id
// @access  Private
export const deleteBillingMethod = async (req: Request, res: Response) => {
  try {
    const billingMethod = await Billing.findById(req.params.id);

    if (!billingMethod) {
      return res.status(404).json({
        success: false,
        error: 'Billing method not found'
      });
    }

    // Make sure user owns billing method
    if (billingMethod.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized'
      });
    }

    // Delete card from Stripe
    if (billingMethod.stripeCustomerId) {
      await stripe.customers.deleteSource(
        billingMethod.stripeCustomerId,
        billingMethod.cardLast4
      );
    }

    await billingMethod.deleteOne();

    res.json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Set billing method as default
// @route   PUT /api/billing/:id/default
// @access  Private
export const setDefaultBillingMethod = async (req: Request, res: Response) => {
  try {
    let billingMethod = await Billing.findById(req.params.id);

    if (!billingMethod) {
      return res.status(404).json({
        success: false,
        error: 'Billing method not found'
      });
    }

    // Make sure user owns billing method
    if (billingMethod.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized'
      });
    }

    // Update all user's billing methods to not default
    await Billing.updateMany(
      { user: req.user.id },
      { isDefault: false }
    );

    // Set this one as default
    billingMethod = await Billing.findByIdAndUpdate(
      req.params.id,
      { isDefault: true },
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      data: billingMethod
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};