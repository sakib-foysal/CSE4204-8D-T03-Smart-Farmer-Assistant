import { useEffect, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import PageLayout from '../../components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { User, Mail, Phone, Lock, Camera, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../lib/api';

export default function ProfilePage() {
  const { t } = useLanguage();
  const { user, token, setUser } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!user) return;
    setProfileData({
      name: `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() || user.username,
      email: user.email ?? '',
      phone: user.phone ?? '',
      avatar: user.avatar ?? '',
    });
  }, [user]);

  const handleSave = async () => {
    if (!token) return;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!profileData.name.trim() || !profileData.email.trim()) {
      setError(t('nameEmailRequired'));
      return;
    }
    if (!emailPattern.test(profileData.email)) {
      setError(t('validEmail'));
      return;
    }

    const [firstName, ...lastNameParts] = profileData.name.trim().split(' ');
    setSaving(true);
    setError('');

    try {
      const response = await api.updateProfile(token, {
        first_name: firstName,
        last_name: lastNameParts.join(' '),
        email: profileData.email.trim(),
        phone: profileData.phone.replace(/[\s-]/g, ''),
        avatar: profileData.avatar,
      });
      setUser(response.user);
      setIsEditing(false);
      toast.success(t('profileUpdated'));
    } catch (err) {
      setError(err instanceof Error ? err.message : t('couldNotUpdateProfile'));
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      toast.error('Please select a PNG, JPG, or WEBP image that is 5 MB or smaller.');
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setProfileData(current => ({ ...current, avatar: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  return (
    <PageLayout className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('profile')}</h1>
            <p className="text-gray-600">{t('manageAccount')}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Summary */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Avatar className="size-24 mx-auto mb-4">
                    {profileData.avatar && <AvatarImage src={profileData.avatar} alt={profileData.name || t('profile')} />}
                    <AvatarFallback className="bg-green-600 text-white text-2xl">
                      {(profileData.name || user?.username || 'SF').slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && <label className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-green-700 hover:text-green-800"><Camera className="size-4" />Change photo<input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleAvatarChange} className="hidden" /></label>}
                  <h2 className="font-bold text-xl text-gray-900">{profileData.name}</h2>
                  <p className="text-sm text-gray-600 mt-1">{profileData.email}</p>
                  <Badge className="mt-3 bg-green-100 text-green-800 hover:bg-green-200">
                    {t('farmerAccount')}
                  </Badge>
                  <div className="mt-6 pt-6 border-t">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('memberSince')}</span>
                        <span className="font-medium">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('totalDetections')}</span>
                        <span className="font-medium">{t('live')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('totalChats')}</span>
                        <span className="font-medium">{t('live')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Edit Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('profileInformation')}</CardTitle>
                  <CardDescription>{t('manageAccount')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('name')}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t('email')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('phone')}</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    {error && (
                      <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3 flex-1">
                        {error}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    {isEditing ? (
                      <>
                        <Button onClick={handleSave} disabled={saving} className="flex-1 bg-green-600 hover:bg-green-700">
                          {saving ? t('loading') : t('save')}
                        </Button>
                        <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1">
                          {t('cancel')}
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => setIsEditing(true)} className="w-full bg-green-600 hover:bg-green-700">
                        {t('edit')} {t('profile')}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('changePassword')}</CardTitle>
                  <CardDescription>{t('passwordNotice')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t('currentPassword')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                      <Input type={showCurrentPassword ? 'text' : 'password'} placeholder="••••••••" className="pl-10 pr-10" />
                      <button type="button" onClick={() => setShowCurrentPassword(value => !value)} aria-label={showCurrentPassword ? 'Hide password' : 'Show password'} className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-green-600">
                        {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('newPassword')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                      <Input type={showNewPassword ? 'text' : 'password'} placeholder="••••••••" className="pl-10 pr-10" />
                      <button type="button" onClick={() => setShowNewPassword(value => !value)} aria-label={showNewPassword ? 'Hide password' : 'Show password'} className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-green-600">
                        {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('confirmPassword')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                      <Input type={showConfirmPassword ? 'text' : 'password'} placeholder="••••••••" className="pl-10 pr-10" />
                      <button type="button" onClick={() => setShowConfirmPassword(value => !value)} aria-label={showConfirmPassword ? 'Hide password' : 'Show password'} className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-green-600">
                        {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>

                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    {t('updatePassword')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
