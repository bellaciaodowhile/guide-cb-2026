import React, { useState } from 'react';
import { Mail, MessageCircle, X, Youtube, Instagram, Facebook } from 'lucide-react';

// CONFIGURACIÓN DE REDES SOCIALES
const SOCIAL_LINKS = {
  youtube: 'https://www.youtube.com/@GuiaConexionBiblica',
  instagram: 'https://instagram.com/guiaconexionbiblica',
  facebook: 'https://facebook.com/profile.php?id=61587070436182',
  tiktok: 'https://tiktok.com/@guiaconexionbiblica26'
};

const Footer: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const handleCodezardiClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('¿Sientes que el papeleo y los procesos lentos frenan tu crecimiento? Es momento de transformar tu administración. Desarrollo sistemas personalizados para: Automatizar tareas repetitivas, Digitalizar toda tu información, Tener el control de tu negocio en un solo lugar. Pídeme una asesoría por mensaje directo.');
    window.open(`https://api.whatsapp.com/send/?phone=584122974011&text=${message}&type=phone_number&app_absent=0`, '_blank');
    setShowModal(false);
  };

  const handleEmailClick = () => {
    window.open('mailto:codezardi@gmail.com', '_blank');
    setShowModal(false);
  };

  return (
    <>
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            {/* Redes sociales */}
            <div className="flex items-center justify-center space-x-6">
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 border border-gray-200 dark:border-gray-700"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5 text-red-600 group-hover:text-red-700 transition-colors duration-200" />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 border border-gray-200 dark:border-gray-700"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 text-pink-600 group-hover:text-pink-700 transition-colors duration-200" />
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 border border-gray-200 dark:border-gray-700"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 text-blue-600 group-hover:text-blue-700 transition-colors duration-200" />
              </a>
              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 border border-gray-200 dark:border-gray-700"
                aria-label="TikTok"
              >
                <svg 
                  className="h-5 w-5 text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-200" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>

            {/* Texto de desarrollador */}
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Desarrollado con{' '}
              <span className="inline-block animate-heartbeat text-red-500">❤️</span>
              {' '}por{' '}
              <button 
                onClick={handleCodezardiClick}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200 hover:underline cursor-pointer"
              >
                Codezardi
              </button>
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-xs">
              © 2024 Explorador Bíblico Interactivo - Libro de Daniel
            </p>
          </div>
        </div>
      </footer>

      {/* Modal de contacto */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl mx-4 max-w-sm w-full animate-modal-appear">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Contactar a Codezardi
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                <p className="mb-3">¿Sientes que el papeleo y los procesos lentos frenan tu crecimiento? Es momento de transformar tu administración.</p>
                <p className="mb-3">Desarrollo sistemas personalizados para:</p>
                <ul className="list-disc list-inside space-y-1 mb-3 ml-4">
                  <li>Automatizar tareas repetitivas</li>
                  <li>Digitalizar toda tu información</li>
                  <li>Tener el control de tu negocio en un solo lugar</li>
                </ul>
                <p className="font-medium">Envíame un mensaje y te cuento cómo empezar.</p>
              </div>

              {/* WhatsApp Button */}
              <button
                onClick={handleWhatsAppClick}
                className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <MessageCircle className="h-6 w-6" />
                <span>WhatsApp</span>
              </button>

              {/* Email Button */}
              <button
                onClick={handleEmailClick}
                className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Mail className="h-6 w-6" />
                <span>codezardi@gmail.com</span>
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;