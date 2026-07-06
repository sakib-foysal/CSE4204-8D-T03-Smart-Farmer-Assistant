import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import PageLayout from '../../components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Cloud, Droplets, Wind, AlertTriangle, CloudRain, Sun } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { api, WeatherData } from '../../lib/api';

export default function WeatherPage() {
  const { t } = useLanguage();
  const { token } = useAuth();
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;

    api.weather(token)
      .then(setWeatherData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load weather data.'))
      .finally(() => setLoading(false));
  }, [token]);

  const currentWeather = weatherData[0];
  const floodRisk = currentWeather?.flood_risk ?? 'low';
  const condition = floodRisk === 'high' ? 'Heavy Rain Risk' : floodRisk === 'medium' ? 'Cloudy' : 'Stable';

  const forecast = useMemo(() => weatherData.slice(0, 7).map((item) => {
    const riskCondition = item.flood_risk === 'high' ? 'Rainy' : item.flood_risk === 'medium' ? 'Cloudy' : 'Sunny';
    const icon = riskCondition === 'Rainy'
      ? <CloudRain className="size-6 text-blue-500" />
      : riskCondition === 'Cloudy'
        ? <Cloud className="size-6 text-gray-500" />
        : <Sun className="size-6 text-yellow-500" />;

    return {
      day: new Date(item.date).toLocaleDateString(undefined, { weekday: 'long' }),
      temp: Number(item.temperature),
      condition: riskCondition,
      icon,
    };
  }), [weatherData]);

  return (
    <PageLayout className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('weather')}</h1>
            <p className="text-gray-600">{t('weatherAlertsDesc')}</p>
          </div>

          {error && (
            <Alert className="mb-8 border-red-500 bg-red-50">
              <AlertTriangle className="size-4 text-red-600" />
              <AlertTitle className="text-red-800">Error</AlertTitle>
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          {currentWeather && floodRisk !== 'low' && (
            <Alert className="mb-8 border-orange-500 bg-orange-50">
              <AlertTriangle className="size-4 text-orange-600" />
              <AlertTitle className="text-orange-800">{t('floodAlert')}</AlertTitle>
              <AlertDescription className="text-orange-700">
                {floodRisk.toUpperCase()} flood risk detected. Rainfall recorded: {currentWeather.rainfall}mm.
              </AlertDescription>
            </Alert>
          )}

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="size-6" />
                {t('currentWeather')} - Khulna, Bangladesh
              </CardTitle>
              <CardDescription>
                {currentWeather ? `Last updated: ${new Date(currentWeather.date).toLocaleString()}` : 'Live backend weather data'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-gray-500">Loading weather data...</p>
              ) : currentWeather ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Cloud className="size-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">{t('temperature')}</p>
                    <p className="text-3xl font-bold text-gray-900">{Number(currentWeather.temperature)}°C</p>
                    <p className="text-xs text-gray-500 mt-1">{condition}</p>
                  </div>

                  <div className="text-center p-4 bg-cyan-50 rounded-lg">
                    <Droplets className="size-8 text-cyan-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">{t('humidity')}</p>
                    <p className="text-3xl font-bold text-gray-900">{Number(currentWeather.humidity)}%</p>
                  </div>

                  <div className="text-center p-4 bg-indigo-50 rounded-lg">
                    <CloudRain className="size-8 text-indigo-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">{t('rainfall')}</p>
                    <p className="text-3xl font-bold text-gray-900">{Number(currentWeather.rainfall)}mm</p>
                  </div>

                  <div className="text-center p-4 bg-gray-100 rounded-lg">
                    <Wind className="size-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Flood Risk</p>
                    <p className="text-3xl font-bold text-gray-900 capitalize">{currentWeather.flood_risk}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No weather data found in database.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('forecast')}</CardTitle>
              <CardDescription>Weather records from backend database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {forecast.length > 0 ? forecast.map((day, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <p className="text-sm font-medium text-gray-900 mb-2">{day.day}</p>
                    {day.icon}
                    <p className="text-2xl font-bold text-gray-900 mt-2">{day.temp}°C</p>
                    <p className="text-xs text-gray-600 mt-1">{day.condition}</p>
                  </div>
                )) : (
                  <p className="text-gray-500 col-span-full">No forecast records available.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
