import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Cloud, CloudLightning, CloudRain, Droplets, Sun, Wind, XCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import PageLayout from '../../components/layout/PageLayout';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { api, LiveWeatherForecast, WeatherForecastDay } from '../../lib/api';

function WeatherIcon({ code }: { code: number }) {
  if ([95, 96, 99].includes(code)) return <CloudLightning className="size-7 text-amber-600" />;
  if (code >= 51) return <CloudRain className="size-7 text-blue-500" />;
  if (code >= 1) return <Cloud className="size-7 text-gray-500" />;
  return <Sun className="size-7 text-yellow-500" />;
}

export default function WeatherPage() {
  const { t, locale, language } = useLanguage();
  const { token } = useAuth();
  const [data, setData] = useState<LiveWeatherForecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAlerts, setShowAlerts] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true); setError('');
    api.weatherForecast(token, language)
      .then(result => { setData(result); setSelectedDate(current => current && result.forecast.some(day => day.date === current) ? current : result.forecast[0]?.date ?? null); })
      .catch(err => setError(err instanceof Error ? err.message : t('weatherUnavailable')))
      .finally(() => setLoading(false));
  }, [token, language, t]);

  const forecast = useMemo(() => data?.forecast ?? [], [data]);
  const selectedDay = forecast.find(day => day.date === selectedDate) ?? forecast[0];
  const hourly = data?.hourly.filter(item => item.date === selectedDay?.date) ?? [];
  const condition = (day: WeatherForecastDay) => [95, 96, 99].includes(day.weather_code) ? t('thunderstorm') : day.rainfall > 0 || day.rain_probability >= 40 ? t('rainExpected') : day.weather_code >= 1 ? t('cloudy') : t('clearWeather');
  const date = (value: string, options: Intl.DateTimeFormatOptions) => new Date(`${value}T00:00:00`).toLocaleDateString(locale, options);
  const time = (value: string) => new Date(value).toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' });
  const alertName = (type: string) => ({ flood: language === 'bn' ? 'বন্যা বা জলাবদ্ধতা' : 'Flooding or waterlogging', rain: language === 'bn' ? 'ভারী বৃষ্টি' : 'Heavy rain', lightning: language === 'bn' ? 'বজ্রঝড়' : 'Lightning', wind: language === 'bn' ? 'দমকা হাওয়া' : 'Strong wind', heat: language === 'bn' ? 'তাপপ্রবাহ' : 'Heatwave' }[type] ?? type);

  return <PageLayout className="bg-gray-50"><div className="container mx-auto px-4 py-8"><div className="mx-auto max-w-6xl">
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h1 className="mb-2 text-3xl font-bold text-gray-900">{t('weather')}</h1><p className="text-gray-600">{t('liveForecast')}</p></div><button type="button" onClick={() => setShowAlerts(value => !value)} className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 font-semibold text-white ${showAlerts ? 'bg-sky-600 hover:bg-sky-700' : 'bg-red-600 hover:bg-red-700'}`}>{showAlerts ? <Cloud className="size-5" /> : <AlertTriangle className="size-5" />}{showAlerts ? 'Weather' : 'Alert'}</button></div>
    {error && <Alert className="mb-8 border-red-500 bg-red-50"><AlertTriangle className="size-4 text-red-600" /><AlertTitle>{t('weatherUnavailable')}</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
    {showAlerts ? <section><div className="mb-6"><h2 className="text-2xl font-bold">{t('weatherAlertsTitle')}</h2><p className="mt-1 text-gray-600">{t('weatherAlertsDescription')}</p></div>{loading ? <p>{t('preparingAlerts')}</p> : data?.alerts.length ? <div className="space-y-5">{data.alerts.map(alert => <Card key={`${alert.type}-${alert.start_date}`} className="border-red-200"><CardHeader className="bg-red-50"><CardTitle className="text-red-800"><AlertTriangle className="mr-2 inline size-5" />{alertName(alert.type)}: {t('floodAlert')}</CardTitle><CardDescription>{date(alert.start_date, { day: 'numeric', month: 'long' })} — {date(alert.end_date, { day: 'numeric', month: 'long' })}: {alert.message}</CardDescription></CardHeader><CardContent className="grid gap-5 pt-6 md:grid-cols-2"><div><h3 className="mb-3 font-semibold text-green-800"><CheckCircle2 className="mr-2 inline size-5" />{t('do')}</h3>{alert.do.map(item => <p key={item} className="mb-2 text-sm">• {item}</p>)}</div><div><h3 className="mb-3 font-semibold text-red-800"><XCircle className="mr-2 inline size-5" />{t('avoid')}</h3>{alert.avoid.map(item => <p key={item} className="mb-2 text-sm">• {item}</p>)}</div></CardContent></Card>)}</div> : <Card><CardContent className="py-12 text-center"><CheckCircle2 className="mx-auto mb-3 size-10 text-green-600" />{t('noAlerts')}</CardContent></Card>}</section> : <section>
      <Card className="mb-8 border-sky-200"><CardHeader className="bg-sky-50"><CardTitle><Cloud className="mr-2 inline size-6 text-sky-600" />{t('currentWeather')}{data ? ` — ${data.location}` : ''}</CardTitle><CardDescription>{data ? `${t('updated')}: ${new Date(data.updated_at).toLocaleString(locale)}` : t('loadingWeather')}</CardDescription></CardHeader><CardContent>{loading ? <p>{t('loadingWeather')}</p> : data?.current ? <div className="grid grid-cols-2 gap-6 md:grid-cols-4">{[[Cloud, t('temperature'), `${data.current.temperature}°C`], [Droplets, t('humidity'), `${data.current.humidity}%`], [CloudRain, t('rainfall'), `${data.current.rainfall} mm`], [Wind, t('wind'), `${data.current.wind_speed} km/h`]].map(([Icon, label, value]) => { const MetricIcon = Icon as typeof Cloud; return <div key={String(label)} className="rounded-lg bg-sky-50 p-4 text-center"><MetricIcon className="mx-auto mb-2 size-8 text-sky-600" /><p className="text-sm">{String(label)}</p><p className="text-2xl font-bold">{String(value)}</p></div>; })}</div> : <p>{t('noWeatherData')}</p>}</CardContent></Card>
      <Card><CardHeader><CardTitle>{t('forecast')}</CardTitle><CardDescription>{t('dailyForecastDescription')}</CardDescription></CardHeader><CardContent><div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">{forecast.map(day => <button type="button" key={day.date} onClick={() => setSelectedDate(day.date)} className={`rounded-lg border p-4 text-center transition ${selectedDay?.date === day.date ? 'border-sky-600 bg-sky-100 ring-2 ring-sky-200' : 'border-transparent bg-gray-50 hover:border-sky-300 hover:bg-sky-50'}`}><p className="mb-2 text-sm font-medium">{date(day.date, { weekday: 'short' })}</p><span className="mx-auto block w-fit"><WeatherIcon code={day.weather_code} /></span><p className="mt-2 font-bold">{day.temperature_max}° / {day.temperature_min}°</p><p className="mt-1 text-xs">{condition(day)}</p></button>)}</div></CardContent></Card>
      {selectedDay && <Card className="mt-6 border-sky-200 bg-sky-50"><CardHeader><CardTitle className="text-sky-900">{date(selectedDay.date, { weekday: 'long', day: 'numeric', month: 'long' })} — {t('details')}</CardTitle><CardDescription>{condition(selectedDay)}</CardDescription></CardHeader><CardContent className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4"><p><strong>{t('temperature')}:</strong> {selectedDay.temperature_min}° – {selectedDay.temperature_max}°C</p><p><strong>{t('rainfall')}:</strong> {selectedDay.rainfall} mm</p><p><strong>{t('rain')}:</strong> {selectedDay.rain_probability}%</p><p><strong>{t('wind')}:</strong> {selectedDay.wind_speed} km/h</p></CardContent><CardContent className="border-t pt-5"><h3 className="mb-4 font-semibold text-sky-900">{language === 'bn' ? 'সময়ভিত্তিক বৃষ্টির সম্ভাবনা' : 'Hourly rain probability'}</h3><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">{hourly.map(item => <div key={item.time} className={`rounded-lg border p-3 text-center ${item.rain_probability >= 60 ? 'border-blue-300 bg-blue-100' : 'border-sky-100 bg-white'}`}><p className="font-semibold">{time(item.time)}</p><p className="mt-1 text-lg font-bold text-blue-700">{item.rain_probability}%</p><p className="text-xs text-gray-600">{t('rain')}</p><p className="mt-1 text-xs text-gray-500">{item.rainfall} mm</p></div>)}</div></CardContent></Card>}
    </section>}
  </div></div></PageLayout>;
}
