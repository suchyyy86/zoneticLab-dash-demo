import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Bell, ChevronDown, User, LogOut, Sun, Moon, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/hooks/use-toast';

const pageTitles: Record<string, { en: string; cz: string }> = {
  '/': { en: 'Dashboard', cz: 'Přehled' },
  '/analytics': { en: 'Analytics', cz: 'Analytika' },
  '/invoices': { en: 'Invoices', cz: 'Fakturace' },
  '/inventory': { en: 'Warehouse Management', cz: 'Správa skladu' },
  '/customers': { en: 'Customers', cz: 'Klienti' },
  '/settings': { en: 'Settings', cz: 'Nastavení' },
};

const notifications = [
  { id: 1, title: 'Invoice #112 is overdue', titleCz: 'Faktura #112 je po splatnosti', time: '2 min ago', timeCz: 'před 2 min', dot: 'bg-destructive', unread: true },
  { id: 2, title: 'New client: Tatra s.r.o.', titleCz: 'Nový klient: Tatra s.r.o.', time: '18 min ago', timeCz: 'před 18 min', dot: 'bg-green-500', unread: true },
  { id: 3, title: 'Low stock: HP Toner Cartridge', titleCz: 'Nízký sklad: HP Toner', time: '1h ago', timeCz: 'před 1h', dot: 'bg-yellow-500', unread: false },
  { id: 4, title: 'Payment received from Škoda Auto', titleCz: 'Platba přijata od Škoda Auto', time: '3h ago', timeCz: 'před 3h', dot: 'bg-primary', unread: false },
];

export function AppHeader() {
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const pageInfo = pageTitles[location.pathname] || { en: 'Dashboard', cz: 'Přehled' };

  const [notificationsList, setNotificationsList] = useState(notifications);
  const unreadCount = notificationsList.filter(n => n.unread).length;

  const handleLogout = () => {
    toast({ title: t('Logged out successfully', 'Odhlášení proběhlo úspěšně'), description: t('See you next time!', 'Nashledanou!') });
    setTimeout(() => navigate('/login'), 1000);
  };

  const handlePopoverOpen = (open: boolean) => {
    if (!open && unreadCount > 0) {
      setNotificationsList(prev => prev.map(n => ({ ...n, unread: false })));
    }
  };

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-foreground">
          {t(pageInfo.en, pageInfo.cz)}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleThemeToggle}
              className="h-9 w-9 text-muted-foreground hover:text-foreground"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t(theme === 'light' ? 'Dark mode' : 'Light mode', theme === 'light' ? 'Tmavý režim' : 'Světlý režim')}</TooltipContent>
        </Tooltip>

        {/* Language toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="font-medium text-xs h-9 px-2.5 text-muted-foreground hover:text-foreground"
            >
              {language === 'EN' ? '🇨🇿 CZ' : '🇬🇧 EN'}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t('Switch to Czech', 'Přepnout do angličtiny')}</TooltipContent>
        </Tooltip>

        {/* Notifications */}
        <Popover onOpenChange={handlePopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground hover:text-foreground">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center pulse-dot">
                  {unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="border-b border-border px-4 py-3 flex items-center justify-between">
              <p className="font-semibold text-sm">{t('Notifications', 'Oznámení')}</p>
              <span className="text-xs text-muted-foreground">{unreadCount} {t('unread', 'nepřečtených')}</span>
            </div>
            <div className="divide-y divide-border max-h-72 overflow-y-auto">
              {notificationsList.map((n) => (
                <div key={n.id} className={`flex items-start gap-3 px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors ${n.unread ? 'bg-primary/5' : ''}`}>
                  <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${n.dot}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${n.unread ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>{t(n.title, n.titleCz)}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t(n.time, n.timeCz)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border px-4 py-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-primary hover:text-primary"
                onClick={() => navigate('/notifications')}
              >
                {t('View all notifications', 'Zobrazit všechna oznámení')}
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 h-9 px-2 ml-1">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                JN
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-medium leading-none">Jan Novák</span>
                <span className="text-xs text-muted-foreground leading-none mt-0.5">Admin</span>
              </div>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-3 py-2 border-b border-border">
              <p className="text-sm font-medium">Jan Novák</p>
              <p className="text-xs text-muted-foreground">jan.novak@zoneticlab.cz</p>
            </div>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <User className="h-4 w-4 mr-2" />
              {t('Profile', 'Profil')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              {t('Logout', 'Odhlásit se')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
