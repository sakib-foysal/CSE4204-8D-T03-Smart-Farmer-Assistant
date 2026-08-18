import { useNavigate } from '../../../router-shim';
import { useLanguage } from '../../contexts/LanguageContext';
import PageLayout from '../../components/layout/PageLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Leaf, Scan, MessageSquare, Cloud, TrendingUp, Droplets, Clock } from 'lucide-react';

export default function LandingPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const features = [
    {
      icon: <Scan className="size-8 text-green-600" />,
      title: t('aiDisease'),
      description: t('aiDiseaseDesc'),
    },
    {
      icon: <MessageSquare className="size-8 text-green-600" />,
      title: t('smartChatbot'),
      description: t('smartChatbotDesc'),
    },
    {
      icon: <Cloud className="size-8 text-green-600" />,
      title: t('weatherAlerts'),
      description: t('weatherAlertsDesc'),
    },
    {
      icon: <TrendingUp className="size-8 text-green-600" />,
      title: t('livePrices'),
      description: t('livePricesDesc'),
    },
    {
      icon: <Droplets className="size-8 text-green-600" />,
      title: t('fertilizerGuide'),
      description: t('fertilizerGuideDesc'),
    },
    {
      icon: <Clock className="size-8 text-green-600" />,
      title: t('historyTracking'),
      description: t('historyTrackingDesc'),
    },
  ];

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-green-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6">
              <Leaf className="size-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">{t('tagline')}</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {t('heroTitle')}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                className="bg-green-600 hover:bg-green-700 text-lg px-8"
              >
                {t('getStarted')}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-lg px-8"
              >
                {t('learnMore')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('features')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('landingFeaturesDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('howItWorks')}</h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('step1Title')}</h3>
                  <p className="text-gray-600">{t('step1Description')}</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('step2Title')}</h3>
                  <p className="text-gray-600">{t('step2Description')}</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('step3Title')}</h3>
                  <p className="text-gray-600">{t('step3Description')}</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('step4Title')}</h3>
                  <p className="text-gray-600">{t('step4Description')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">{t('about')}</h2>
            <p className="text-lg text-gray-600 mb-6 text-justify">
              Smart Farmer Assistant is an AI-powered platform designed to help farmers around the world, including those in Bangladesh,
              make better agricultural decisions. Agriculture plays a vital role in economies and food security worldwide, yet farmers
              face persistent challenges — crop diseases, improper fertilizer use, climate change, extreme weather, fluctuating market
              prices, water scarcity, soil degradation, and limited access to qualified agricultural experts remain major challenges for
              farmers globally.
            </p>
            <p className="text-lg text-gray-600 mb-6 text-justify">
              Our platform integrates AI image classification, an SF AI-powered chatbot, real-time weather forecasting, flood alerts,
              live market prices, and intelligent fertilizer recommendations into a single responsive platform designed to support farmers
              across different regions, crops, and agricultural conditions, accessible from any smartphone or web browser.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            {t('ctaTitle')}
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            {t('ctaText')}
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/register')}
            className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8"
          >
            {t('getStarted')}
          </Button>
        </div>
      </section>
    </PageLayout>
  );
}
