import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { ForecastAssistant } from '../assistant/ForecastAssistant';
import { StageCoach } from '../assistant/StageCoach';
import { ToastHost } from '../ui/ToastHost';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppShell() {
  const [drawer, setDrawer] = useState(false);
  const theme = useAppStore((s) => s.theme);
  useEffect(() => {
    const resolved =
      theme === 'system'
        ? matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : theme;
    document.documentElement.dataset.theme = resolved;
  }, [theme]);

  return (
    <div className="min-h-screen">
      <Sidebar open={drawer} onClose={() => setDrawer(false)} />
      <div className="lg:pl-64">
        <Topbar onMenu={() => setDrawer(true)} />
        <main className="w-full px-4 pb-28 pt-4 md:px-7 md:pb-32 md:pt-6 md:pr-20 xl:px-9 xl:pr-24 2xl:px-12">
          <StageCoach />
          <div className="animate-fade-up">
            <Outlet />
          </div>
        </main>
      </div>
      <ForecastAssistant />
      <ToastHost />
    </div>
  );
}
