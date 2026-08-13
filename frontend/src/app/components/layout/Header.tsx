import { Link, useNavigate, useLocation } from '../../../router-shim';
import { Button } from '../ui/button';
import { useLanguage } from '../../contexts/LanguageContext';
import { Leaf, Menu, X, Globe } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { t, toggleLanguage } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = user?.role === 'admin' || location.pathname.startsWith('/admin');
  const navLinkClass = (path: string) =>
    `rounded-md px-3 py-2 text-sm font-medium transition-colors ${location.pathname === path ? 'bg-green-100 text-green-800' : 'text-gray-700 hover:bg-green-50 hover:text-green-700'}`;
  const mobileNavLinkClass = (path: string) =>
    `rounded-md px-3 py-2 font-medium transition-colors ${location.pathname === path ? 'bg-green-100 text-green-800' : 'text-gray-700 hover:bg-green-50 hover:text-green-700'}`;

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-green-600 p-2 rounded-lg">
              <Leaf className="size-6 text-white" />
            </div>
            <span className="font-bold text-xl text-green-800">{t('appTitle')}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {!isAuthenticated ? (
              <>
                <a href="#features" className="text-gray-700 hover:text-green-600 transition-colors">{t('features')}</a>
                <a href="#how-it-works" className="text-gray-700 hover:text-green-600 transition-colors">{t('howItWorks')}</a>
                <a href="#about" className="text-gray-700 hover:text-green-600 transition-colors">{t('about')}</a>
              </>
            ) : isAdmin ? (
              <>
                <Link to="/admin" className={navLinkClass('/admin')}>{t('dashboard')}</Link>
                <Link to="/admin/users" className={navLinkClass('/admin/users')}>{t('userManagement')}</Link>
                <Link to="/admin/market-prices" className={navLinkClass('/admin/market-prices')}>{t('marketPriceUpdate')}</Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className={navLinkClass('/dashboard')}>{t('dashboard')}</Link>
                <Link to="/disease-detection" className={navLinkClass('/disease-detection')}>{t('diseaseDetection')}</Link>
                <Link to="/chatbot" className={navLinkClass('/chatbot')}>{t('aiChatbot')}</Link>
                <Link to="/weather" className={navLinkClass('/weather')}>{t('weather')}</Link>
                <Link to="/market-prices" className={navLinkClass('/market-prices')}>{t('marketPrices')}</Link>
              </>
            )}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-2"
            >
              <Globe className="size-4" />
              {t('languageName')}
            </Button>
            
            {!isAuthenticated ? (
              <>
                <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                  {t('login')}
                </Button>
                <Button size="sm" onClick={() => navigate('/register')} className="bg-green-600 hover:bg-green-700">
                  {t('register')}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => navigate('/profile')}>
                  {t('profile')}
                </Button>
                <Button size="sm" onClick={handleLogout} variant="destructive">
                  {t('logout')}
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-3">
              {!isAuthenticated ? (
                <>
                  <a href="#features" className="py-2 text-gray-700 hover:text-green-600">{t('features')}</a>
                  <a href="#how-it-works" className="py-2 text-gray-700 hover:text-green-600">{t('howItWorks')}</a>
                  <a href="#about" className="py-2 text-gray-700 hover:text-green-600">{t('about')}</a>
                  <hr className="my-2" />
                  <Button variant="outline" size="sm" onClick={() => navigate('/login')} className="w-full">
                    {t('login')}
                  </Button>
                  <Button size="sm" onClick={() => navigate('/register')} className="w-full bg-green-600 hover:bg-green-700">
                    {t('register')}
                  </Button>
                </>
              ) : isAdmin ? (
                <>
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass('/admin')}>{t('dashboard')}</Link>
                  <Link to="/admin/users" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass('/admin/users')}>{t('userManagement')}</Link>
                  <Link to="/admin/market-prices" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass('/admin/market-prices')}>{t('marketPriceUpdate')}</Link>
                  <hr className="my-2" />
                  <Button size="sm" onClick={handleLogout} variant="destructive" className="w-full">
                    {t('logout')}
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass('/dashboard')}>{t('dashboard')}</Link>
                  <Link to="/disease-detection" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass('/disease-detection')}>{t('diseaseDetection')}</Link>
                  <Link to="/chatbot" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass('/chatbot')}>{t('aiChatbot')}</Link>
                  <Link to="/weather" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass('/weather')}>{t('weather')}</Link>
                  <Link to="/market-prices" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass('/market-prices')}>{t('marketPrices')}</Link>
                  <hr className="my-2" />
                  <Button variant="outline" size="sm" onClick={() => navigate('/profile')} className="w-full">
                    {t('profile')}
                  </Button>
                  <Button size="sm" onClick={handleLogout} variant="destructive" className="w-full">
                    {t('logout')}
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleLanguage}
                className="w-full flex items-center justify-center gap-2"
              >
                <Globe className="size-4" />
                {t('languageName')}
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
