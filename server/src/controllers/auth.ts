import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { validationResult } from 'express-validator';
import User from '../models/User';
import { sendEmail, generatePasswordResetEmail, generateVerificationEmail, generatePasswordChangedEmail } from '../utils/email';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '30d';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      return res.status(400).json({ errors: [{ msg: 'User already exists and is verified. Please login instead.' }] });
    }

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpires = new Date(Date.now() + 4 * 60 * 1000); // 4 minutes

    if (user && !user.isVerified) {
      // Update existing unverified user with new verification code
      user.name = name;
      user.password = password;
      user.verificationCode = verificationCode;
      user.verificationExpires = verificationExpires;
    } else {
      // Create new user
      user = new User({
        name,
        email,
        password,
        verificationCode,
        verificationExpires
      });
    }

    await user.save();

    // Send verification email
    const htmlMessage = generateVerificationEmail(user.name, verificationCode);
    await sendEmail({
      email: user.email,
      subject: 'Vérification de votre compte - ModularHouse',
      message: htmlMessage
    });

    res.json({ 
      success: true, 
      message: 'Compte créé avec succès. Vérifiez votre email pour activer votre compte.',
      email: user.email 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Verify email
// @route   POST /api/auth/verify-email
// @access  Public
export const verifyEmail = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, code } = req.body;

  try {
    const user = await User.findOne({
      email,
      verificationCode: code,
      verificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid or expired verification code' }] });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationExpires = undefined;
    await user.save();

    // Create token after successful verification
    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    res.json({ 
      success: true,
      message: 'Email vérifié avec succès', 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    // Vérifier si l'utilisateur existe
    if (!user) {
      return res.status(404).json({ 
        errors: [{ msg: 'Aucun compte trouvé avec cette adresse email' }],
        errorType: 'USER_NOT_FOUND'
      });
    }

    // Vérifier si l'utilisateur est vérifié
    if (!user.isVerified) {
      // Générer un nouveau code de vérification
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const verificationExpires = new Date(Date.now() + 4 * 60 * 1000); // 4 minutes

      // Mettre à jour le code de vérification
      await User.findByIdAndUpdate(user._id, {
        verificationCode,
        verificationExpires
      });

      // Envoyer le nouvel email de vérification
      const htmlMessage = generateVerificationEmail(user.name, verificationCode);
      await sendEmail({
        email: user.email,
        subject: 'Nouveau code de vérification - ModularHouse',
        message: htmlMessage
      });

      console.log(`🔐 Nouveau code de vérification pour ${email}: ${verificationCode}`);

      return res.status(401).json({ 
        errors: [{ msg: 'Vous devez d\'abord vérifier votre email. Un nouveau code de vérification vient d\'être envoyé.' }],
        email: user.email,
        errorType: 'EMAIL_NOT_VERIFIED'
      });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ 
        errors: [{ msg: 'Mot de passe incorrect' }],
        errorType: 'WRONG_PASSWORD'
      });
    }

    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    res.json({ 
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
export const forgotPassword = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'User not found' }] });
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset url - point to frontend reset page
    const resetUrl = `http://localhost:3003/reset-password/${resetToken}`;

    // Use the beautiful HTML email template
    const htmlMessage = generatePasswordResetEmail(user.name, resetUrl);

    try {
      await sendEmail({
        email: user.email,
        subject: 'Réinitialisation de votre mot de passe - ModularHouse',
        message: htmlMessage
      });

      res.json({ success: true, data: 'Email sent' });
    } catch (err) {
      console.log(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ errors: [{ msg: 'Email could not be sent' }] });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
export const resetPassword = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid token' }] });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    // Envoyer email de confirmation du changement de mot de passe
    try {
      const confirmationEmail = generatePasswordChangedEmail(user.name);
      await sendEmail({
        email: user.email,
        subject: 'Mot de passe modifié avec succès - ModularHouse',
        message: confirmationEmail
      });
    } catch (emailError) {
      console.error('Erreur envoi email de confirmation:', emailError);
      // On continue même si l'email échoue
    }

    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    res.json({ 
      success: true,
      message: 'Mot de passe mis à jour avec succès. Un email de confirmation a été envoyé.',
      token 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
export const updateDetails = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Champs autorisés pour la mise à jour
  const allowedFields = ['name', 'email', 'phone', 'company', 'address', 'city', 'postalCode', 'country'];
  const fieldsToUpdate: any = {};

  // Ne garder que les champs autorisés et non vides
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      fieldsToUpdate[field] = req.body[field];
    }
  });

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'Utilisateur non trouvé' }] });
    }

    res.json(user);
  } catch (err) {
    console.error('Erreur mise à jour profil:', err.message);
    
    // Gestion des erreurs de validation MongoDB
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((error: any) => ({
        msg: error.message
      }));
      return res.status(400).json({ errors });
    }

    res.status(500).json({ errors: [{ msg: 'Erreur serveur' }] });
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
export const updatePassword = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ errors: [{ msg: 'Current password is incorrect' }] });
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.newPassword, salt);

    await user.save();

    // Envoyer email de confirmation du changement de mot de passe
    try {
      const confirmationEmail = generatePasswordChangedEmail(user.name);
      await sendEmail({
        email: user.email,
        subject: 'Mot de passe modifié avec succès - ModularHouse',
        message: confirmationEmail
      });
    } catch (emailError) {
      console.error('Erreur envoi email de confirmation:', emailError);
      // On continue même si l'email échoue
    }

    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    res.json({ 
      success: true,
      message: 'Mot de passe mis à jour avec succès. Un email de confirmation a été envoyé.',
      token 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
export const logout = async (req: Request, res: Response) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.json({ success: true, data: {} });
};