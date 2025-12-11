import { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
  };

  if (!showInstallPrompt) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '16px 24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        gap: 2,
        alignItems: 'center',
        zIndex: 1000,
        border: '1px solid rgba(0, 0, 0, 0.08)',
      }}
    >
      <GetAppIcon sx={{ color: '#4A90E2' }} />
      <Box sx={{ fontSize: '14px', color: '#333' }}>
        Skyleをホーム画面に追加しますか？
      </Box>
      <Button
        onClick={handleInstallClick}
        sx={{
          backgroundColor: '#4A90E2',
          color: 'white',
          borderRadius: '8px',
          padding: '6px 16px',
          fontSize: '13px',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: '#357ABD',
          },
        }}
      >
        追加
      </Button>
      <Button
        onClick={handleDismiss}
        sx={{
          color: '#666',
          borderRadius: '8px',
          padding: '6px 16px',
          fontSize: '13px',
          textTransform: 'none',
        }}
      >
        後で
      </Button>
    </Box>
  );
};
