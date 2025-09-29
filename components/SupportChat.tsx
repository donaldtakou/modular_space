'use client';

import { useState, useEffect, useRef } from 'react';
import { SUPPORT_CONFIG } from '@/lib/countries-config';

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  showContact?: boolean;
}

interface SupportChatProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
}

const QUICK_ACTIONS = [
  { id: 'payment', label: 'Problème de paiement', icon: '💳' },
  { id: 'card', label: 'Carte refusée', icon: '⚠️' },
  { id: 'agent', label: 'Parler à un agent', icon: '👨‍💼' },
  { id: 'info', label: 'Informations', icon: '💡' }
];

const BOT_RESPONSES = {
  greeting: "Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider ?",
  payment: "Je comprends votre problème de paiement. Voici les vérifications importantes :\n\n• Solde suffisant sur votre carte\n• Informations saisies correctement\n• Autorisation des achats en ligne\n\nSi le problème persiste, je peux vous mettre en contact avec un agent.",
  card_declined: "Votre carte a été refusée ? Les causes courantes :\n\n• Limite de dépense atteinte\n• Carte expirée\n• Code de sécurité incorrect\n• Restriction bancaire\n\nContactez votre banque ou essayez une autre carte.",
  agent_contact: "Je vous mets en contact avec un agent humain. Vous pouvez aussi nous joindre directement :",
  info: "Nos maisons modulaires :\n\n• Installation rapide (2-4 semaines)\n• Design personnalisable\n• Écologiques et économiques\n• Garantie complète\n\nQue souhaitez-vous savoir de plus spécifique ?",
  default: "Je comprends votre question. Pour une aide plus personnalisée, un de nos agents peut vous assister."
};

export default function SupportChat({ isOpen, onClose, initialMessage }: SupportChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: BOT_RESPONSES.greeting,
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (initialMessage && isOpen) {
      addUserMessage(initialMessage);
    }
  }, [initialMessage, isOpen]);

  const addUserMessage = (text: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    handleBotResponse(text);
  };

  const addBotMessage = (text: string, showContact = false) => {
    const botMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isBot: true,
      timestamp: new Date(),
      showContact
    };
    setMessages(prev => [...prev, botMessage]);
  };

  const handleBotResponse = (userInput: string) => {
    setIsTyping(true);
    
    setTimeout(() => {
      const lowerInput = userInput.toLowerCase();
      let response = BOT_RESPONSES.default;
      let showContact = false;

      if (lowerInput.includes('paiement') || lowerInput.includes('payment')) {
        response = BOT_RESPONSES.payment;
      } else if (lowerInput.includes('carte') || lowerInput.includes('refus') || lowerInput.includes('déclin')) {
        response = BOT_RESPONSES.card_declined;
      } else if (lowerInput.includes('agent') || lowerInput.includes('humain') || lowerInput.includes('contact')) {
        response = BOT_RESPONSES.agent_contact;
        showContact = true;
      } else if (lowerInput.includes('info') || lowerInput.includes('maison') || lowerInput.includes('produit')) {
        response = BOT_RESPONSES.info;
      }

      addBotMessage(response, showContact);
      setIsTyping(false);
    }, 1200);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    addUserMessage(inputValue);
    setInputValue('');
  };

  const handleQuickAction = (actionId: string) => {
    const action = QUICK_ACTIONS.find(a => a.id === actionId);
    if (!action) return;

    addUserMessage(action.label);
  };

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent('Bonjour, j\'ai besoin d\'aide concernant mon paiement sur votre site de maisons modulaires.');
    window.open(`https://wa.me/${SUPPORT_CONFIG.whatsapp.replace(/[^\d]/g, '')}?text=${message}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />
      
      {/* Chat Container */}
      <div className="fixed bottom-4 right-4 w-80 h-[500px] bg-white rounded-xl shadow-2xl z-50 flex flex-col border border-gray-200">
        {/* Header */}
        <div className="bg-gray-800 text-white p-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-sm">Assistant Support</h3>
              <div className="flex items-center text-xs text-gray-300">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-1.5"></div>
                En ligne
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`max-w-[80%] ${message.isBot ? '' : 'order-2'}`}>
                {message.isBot && (
                  <div className="flex items-center mb-1">
                    <div className="w-5 h-5 bg-gray-400 rounded-full mr-2 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-500">Assistant</span>
                  </div>
                )}
                
                <div
                  className={`px-3 py-2 rounded-lg text-sm ${
                    message.isBot
                      ? 'bg-white border border-gray-200 text-gray-800'
                      : 'bg-gray-800 text-white'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{message.text}</p>
                  
                  {message.showContact && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <button
                        onClick={handleWhatsAppContact}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.382z"/>
                        </svg>
                        <span>Continuer sur WhatsApp</span>
                      </button>
                    </div>
                  )}
                </div>
                
                <div className={`text-xs text-gray-400 mt-1 ${message.isBot ? 'text-left' : 'text-right'}`}>
                  {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center mb-1">
                <div className="w-5 h-5 bg-gray-400 rounded-full mr-2 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="bg-white border border-gray-200 px-3 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="p-3 bg-white border-t border-gray-100">
          <div className="text-xs text-gray-500 mb-2">Actions rapides :</div>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action.id)}
                className="flex items-center space-x-1.5 px-2 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md text-xs transition-colors"
              >
                <span className="text-sm">{action.icon}</span>
                <span className="text-gray-700">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white rounded-b-xl border-t border-gray-100">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Tapez votre message..."
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}