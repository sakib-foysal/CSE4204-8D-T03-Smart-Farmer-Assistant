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
              Empowering farmers with AI-driven insights and real-time agricultural support
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Register Your Account</h3>
                  <p className="text-gray-600">Sign up with your basic information to get started with the platform.</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Crop Images or Ask Questions</h3>
                  <p className="text-gray-600">Take a photo of your crop or ask our AI chatbot any farming question.</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Get AI-Powered Recommendations</h3>
                  <p className="text-gray-600">Receive instant disease detection, treatment advice, fertilizer recommendations, and more.</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Your Farming History</h3>
                  <p className="text-gray-600">Review past detections and conversations to make better farming decisions.</p>
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
            <p className="text-lg text-gray-600 mb-6">
              Smart Farmer Assistant is an AI-powered platform designed to help Bangladeshi farmers make better agricultural decisions. 
              Agriculture accounts for a significant share of Bangladesh's GDP, yet farmers face persistent challenges — crop diseases 
              cause 20–30% annual yield loss, improper fertilizer use degrades soil quality, and access to qualified agricultural 
              extension officers remains limited in rural areas.
            </p>
            <p className="text-lg text-gray-600">
              Our platform integrates AI image classification, an SF AI-powered chatbot, real-time weather forecasting, flood alerts, 
              live market prices, and intelligent fertilizer recommendations into a single responsive platform accessible from any 
              smartphone or web browser.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of farmers already using AI to improve their crop yield and reduce losses.
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
