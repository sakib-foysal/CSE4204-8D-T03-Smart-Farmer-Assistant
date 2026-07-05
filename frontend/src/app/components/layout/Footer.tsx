import { Link } from '../../../router-shim';
import { useLanguage } from '../../contexts/LanguageContext';
import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-green-600 p-2 rounded-lg">
                <Leaf className="size-6 text-white" />
              </div>
              <span className="font-bold text-xl text-white">{t('appTitle')}</span>
            </div>
            <p className="text-sm mb-4">
              {t('tagline')}
            </p>
            <div className="flex gap-3">
              <a href="#" className="hover:text-green-500 transition-colors">
                <Facebook className="size-5" />
              </a>
              <a href="#" className="hover:text-green-500 transition-colors">
                <Twitter className="size-5" />
              </a>
              <a href="#" className="hover:text-green-500 transition-colors">
                <Linkedin className="size-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('features')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/disease-detection" className="hover:text-green-500 transition-colors">{t('diseaseDetection')}</Link></li>
              <li><Link to="/chatbot" className="hover:text-green-500 transition-colors">{t('aiChatbot')}</Link></li>
              <li><Link to="/weather" className="hover:text-green-500 transition-colors">{t('weather')}</Link></li>
              <li><Link to="/market-prices" className="hover:text-green-500 transition-colors">{t('marketPrices')}</Link></li>
              <li><Link to="/fertilizer" className="hover:text-green-500 transition-colors">{t('fertilizer')}</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('about')}</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-green-500 transition-colors">{t('footerAbout')}</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">{t('footerContact')}</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">{t('footerPrivacy')}</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">{t('footerTerms')}</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footerContact')}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="size-4 mt-1 flex-shrink-0" />
                <span>Northern University of Business & Technology, Khulna, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 flex-shrink-0" />
                <a href="mailto:support@smartfarmer.com" className="hover:text-green-500 transition-colors">
                  support@smartfarmer.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 flex-shrink-0" />
                <a href="tel:+8801700000000" className="hover:text-green-500 transition-colors">
                  +880 1700-000000
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>© {currentYear} {t('appTitle')}. {t('footerRights')}.</p>
          <p className="mt-2 text-xs text-gray-500">
            CSE4204-8D-T03 - Software Engineering Project
          </p>
        </div>
      </div>
    </footer>
  );
}
