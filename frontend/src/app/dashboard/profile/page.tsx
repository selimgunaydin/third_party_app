'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, CardFooter } from '@nextui-org/card';
import { Avatar } from '@nextui-org/avatar';
import { Chip } from '@nextui-org/chip';
import { Divider } from '@nextui-org/divider';
import { Button } from '@nextui-org/button';
import { Tooltip } from '@nextui-org/tooltip';
import { toast } from 'react-hot-toast';
import { User } from '@/types';
import { 
  HiOutlineOfficeBuilding,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineBriefcase,
  HiOutlineIdentification,
  HiOutlineClock,
  HiOutlineCalendar,
  HiOutlineKey,
  HiOutlineClipboardCopy,
  HiOutlineCheck
} from 'react-icons/hi';
import { useProfile } from '@/hooks/queries';

export default function ProfilePage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const { data: user, isLoading } = useProfile();

  const handleCopyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    toast.success('API anahtarı kopyalandı');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Üst Profil Kartı */}
      <Card className="w-full shadow-lg">
        <CardBody className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar
              className="w-32 h-32 text-2xl"
              src={`https://ui-avatars.com/api/?name=${user?.name}&background=random&size=128`}
              showFallback
            />
            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <h1 className="text-2xl font-bold">{user?.name}</h1>
                <div className="flex gap-2 justify-center md:justify-start">
                  <Chip
                    size="sm"
                    color={user?.isVerified ? 'success' : 'warning'}
                    variant="flat"
                  >
                    {user?.isVerified ? 'Doğrulanmış' : 'Doğrulanmamış'}
                  </Chip>
                  <Chip
                    size="sm"
                    color={user?.status === 'active' ? 'success' : 'danger'}
                  >
                    {user?.status === 'active' ? 'Aktif' : 'Pasif'}
                  </Chip>
                  {user?.isAdmin && (
                    <Chip size="sm" color="primary">Yönetici</Chip>
                  )}
                </div>
              </div>
              <p className="text-default-500">{user?.title} @ {user?.company}</p>
              <p className="text-sm text-default-400">{user?.bio}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* İletişim Bilgileri */}
        <Card className="shadow-md">
          <CardHeader className="flex gap-3">
            <h2 className="text-xl font-semibold">İletişim Bilgileri</h2>
          </CardHeader>
          <Divider/>
          <CardBody className="gap-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <HiOutlineMail className="w-5 h-5 text-default-400" />
                <div>
                  <p className="text-sm text-default-400">E-posta</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <HiOutlinePhone className="w-5 h-5 text-default-400" />
                <div>
                  <p className="text-sm text-default-400">Telefon</p>
                  <p className="font-medium">{user?.phone || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <HiOutlineLocationMarker className="w-5 h-5 text-default-400" />
                <div>
                  <p className="text-sm text-default-400">Adres</p>
                  <p className="font-medium">{user?.address || '-'}</p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Tercihler */}
        <Card className="shadow-md">
          <CardHeader className="flex gap-3">
            <h2 className="text-xl font-semibold">Tercihler</h2>
          </CardHeader>
          <Divider/>
          <CardBody className="gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-default-400">Dil</p>
                <Chip size="sm" variant="flat">
                  {user?.preferences.language === 'tr' ? 'Türkçe' : 'English'}
                </Chip>
              </div>
              <div>
                <p className="text-sm text-default-400">Tema</p>
                <Chip size="sm" variant="flat">
                  {user?.preferences.theme === 'light' ? 'Açık' : 'Koyu'}
                </Chip>
              </div>
              <div>
                <p className="text-sm text-default-400">Bildirimler</p>
                <Chip size="sm" color={user?.preferences.notifications ? 'success' : 'default'}>
                  {user?.preferences.notifications ? 'Açık' : 'Kapalı'}
                </Chip>
              </div>
              <div>
                <p className="text-sm text-default-400">E-posta Bildirimleri</p>
                <Chip size="sm" color={user?.preferences.emailNotifications ? 'success' : 'default'}>
                  {user?.preferences.emailNotifications ? 'Açık' : 'Kapalı'}
                </Chip>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Zaman Bilgileri */}
        <Card className="shadow-md">
          <CardHeader className="flex gap-3">
            <h2 className="text-xl font-semibold">Zaman Bilgileri</h2>
          </CardHeader>
          <Divider/>
          <CardBody className="gap-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <HiOutlineClock className="w-5 h-5 text-default-400" />
                <div>
                  <p className="text-sm text-default-400">Son Giriş</p>
                  <p className="font-medium">
                    {new Date(user?.lastLogin || '').toLocaleString('tr-TR')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <HiOutlineCalendar className="w-5 h-5 text-default-400" />
                <div>
                  <p className="text-sm text-default-400">Kayıt Tarihi</p>
                  <p className="font-medium">
                    {new Date(user?.createdAt || '').toLocaleString('tr-TR')}
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* API Anahtarları */}
        <Card className="shadow-md">
          <CardHeader className="flex gap-3">
            <h2 className="text-xl font-semibold">API Anahtarları</h2>
          </CardHeader>
          <Divider/>
          <CardBody className="gap-4">
            {user?.apiKeys.map((apiKey) => (
              <div key={apiKey._id} className="flex items-center justify-between p-2 rounded-lg bg-default-50">
                <div className="flex items-center gap-2">
                  <HiOutlineKey className="w-5 h-5 text-default-400" />
                  <div>
                    <p className="font-mono text-sm">{apiKey.key.slice(0, 8)}...{apiKey.key.slice(-8)}</p>
                    <Chip size="sm" color={apiKey.isActive ? 'success' : 'danger'} variant="flat">
                      {apiKey.isActive ? 'Aktif' : 'Pasif'}
                    </Chip>
                  </div>
                </div>
                <Tooltip content={copiedKey === apiKey.key ? 'Kopyalandı!' : 'Kopyala'}>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onClick={() => handleCopyApiKey(apiKey.key)}
                  >
                    {copiedKey === apiKey.key ? (
                      <HiOutlineCheck className="w-4 h-4" />
                    ) : (
                      <HiOutlineClipboardCopy className="w-4 h-4" />
                    )}
                  </Button>
                </Tooltip>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  );
} 