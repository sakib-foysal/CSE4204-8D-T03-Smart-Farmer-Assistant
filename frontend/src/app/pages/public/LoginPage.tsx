import { useState } from 'react';
import { useNavigate, Link } from '../../../router-shim';
import { useLanguage } from '../../contexts/LanguageContext';
import PageLayout from '../../components/layout/PageLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Eye, EyeOff, Leaf } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginPage() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError(t('requiredLogin'));
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const user = await login(email.trim(), password);
      toast.success(t('loginSuccessful'));
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('loginFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-600 p-3 rounded-full">
                <Leaf className="size-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">{t('login')}</CardTitle>
            <CardDescription>{t('appTitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder={t('email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-green-600">
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                  {error}
                </p>
              )}

              <Button type="submit" disabled={submitting} className="w-full bg-green-600 hover:bg-green-700">
                {submitting ? t('loading') : t('signIn')}
              </Button>

              <div className="text-center text-sm text-gray-600">
                {t('dontHaveAccount')}{' '}
                <Link to="/register" className="text-green-600 hover:underline font-medium">
                  {t('signUp')}
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
