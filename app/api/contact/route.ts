import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  country: string;
  subject: string;
  message: string;
  language: 'fr' | 'en';
}

const getCountryInfo = (countryCode: string) => {
  const countries: Record<string, { name: string; phone: string; whatsapp: string }> = {
    'FR': { name: 'France', phone: '+33', whatsapp: '33123456789' },
    'US': { name: 'United States', phone: '+1', whatsapp: '1234567890' },
    'UK': { name: 'United Kingdom', phone: '+44', whatsapp: '44123456789' },
    'DE': { name: 'Germany', phone: '+49', whatsapp: '49123456789' },
    'ES': { name: 'Spain', phone: '+34', whatsapp: '34123456789' },
    'IT': { name: 'Italy', phone: '+39', whatsapp: '39123456789' },
    'CA': { name: 'Canada', phone: '+1', whatsapp: '1987654321' },
  };
  return countries[countryCode] || countries['FR'];
};

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    const { name, email, phone, country, subject, message, language } = body;

    // Validation des données
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { message: language === 'fr' ? 'Tous les champs obligatoires doivent être remplis' : 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Vérifier les variables d'environnement
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.error('❌ Configuration email manquante:', { 
        hasUser: !!process.env.SMTP_USER, 
        hasPass: !!process.env.SMTP_PASSWORD 
      });
      return NextResponse.json(
        { message: 'Configuration email manquante sur le serveur' },
        { status: 500 }
      );
    }

    // Configuration du transporteur email simple pour Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      }
    });

    // Test de la connexion
    try {
      await transporter.verify();
      console.log('✅ Connexion SMTP vérifiée');
    } catch (verifyError) {
      console.error('❌ Erreur de vérification SMTP:', verifyError);
      return NextResponse.json(
        { message: 'Erreur de configuration email' },
        { status: 500 }
      );
    }

    // Email de notification à l'entreprise (envoi simple)
    const companyEmailSubject = language === 'fr' 
      ? `Nouveau contact: ${subject}` 
      : `New contact: ${subject}`;

    const companyEmailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">${language === 'fr' ? 'Nouveau message de contact' : 'New contact message'}</h2>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>${language === 'fr' ? 'Nom' : 'Name'}:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>${language === 'fr' ? 'Téléphone' : 'Phone'}:</strong> ${phone}</p>
          <p><strong>${language === 'fr' ? 'Pays' : 'Country'}:</strong> ${country}</p>
          <p><strong>${language === 'fr' ? 'Sujet' : 'Subject'}:</strong> ${subject}</p>
        </div>
        <div style="background: white; padding: 20px; border-left: 4px solid #2563eb; margin: 20px 0;">
          <h3>${language === 'fr' ? 'Message:' : 'Message:'}</h3>
          <p style="line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
        </div>
      </div>
    `;

    // Envoi de l'email principal
    await transporter.sendMail({
      from: `"${name}" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      replyTo: email,
      subject: companyEmailSubject,
      html: companyEmailBody,
    });

    console.log('✅ Email de notification envoyé');

    // Email de confirmation au client
    const clientEmailSubject = language === 'fr' 
      ? 'Confirmation - Modular House International' 
      : 'Confirmation - Modular House International';

    const clientEmailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Modular House International</h2>
        <p>Bonjour ${name},</p>
        <p>Nous avons bien reçu votre message concernant: <strong>${subject}</strong></p>
        <p>Notre équipe vous contactera dans les plus brefs délais.</p>
        <p>Cordialement,<br>L'équipe Modular House</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Modular House International" <${process.env.SMTP_USER}>`,
      to: email,
      subject: clientEmailSubject,
      html: clientEmailBody,
    });

    console.log('✅ Email de confirmation envoyé');

    return NextResponse.json({ 
      message: language === 'fr' ? 'Message envoyé avec succès!' : 'Message sent successfully!',
      success: true
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi du message:', error);
    
    return NextResponse.json(
      { 
        message: 'Erreur lors de l\'envoi du message / Error sending message',
        success: false,
        error: process.env.NODE_ENV === 'development' ? String(error) : 'Internal server error'
      },
      { status: 500 }
    );
  }
}