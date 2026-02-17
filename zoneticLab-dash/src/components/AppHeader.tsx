import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Bell, ChevronDown, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
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
  { id: 1, title: 'Invoice #112 is overdue', time: '2 min ago', dot: 'bg-destructive' },
  { id: 2, title: 'New client: Tatra s.r.o.', time: '18 min ago', dot: 'bg-success' },
  { id: 3, title: 'Low stock: HP Toner Cartridge', time: '1h ago', dot: 'bg-warning' },
  { id: 4, title: 'Payment received from Škoda Auto', time: '3h ago', dot: 'bg-primary' },
];

export function AppHeader() {
  const { language, toggleLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const pageInfo = pageTitles[location.pathname] || { en: 'Dashboard', cz: 'Přehled' };

  const handleLogout = () => {
    toast({ title: t('Logged out successfully', 'Odhlášení proběhlo úspěšně'), description: t('See you next time!', 'Nashledanou!') });
    setTimeout(() => navigate('/login'), 1000);
  };

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
      <h1 className="text-lg font-semibold text-foreground">
        {t(pageInfo.en, pageInfo.cz)}
      </h1>

      <div className="flex items-center gap-3">
        {/* Language toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={toggleLanguage}
          className="font-semibold text-xs h-8 px-3 border-border"
        >
          {language === 'EN' ? 'CZ' : 'EN'}
        </Button>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="border-b border-border px-4 py-3">
              <p className="font-semibold text-sm">{t('Notifications', 'Oznámení')}</p>
            </div>
            <div className="divide-y divide-border">
              {notifications.map((n) => (
                <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-muted/50 cursor-pointer">
                  <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${n.dot}`} />
                  <div>
                    <p className="text-sm text-foreground">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 h-9 px-2">
              <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                JN
              </div>
              <span className="text-sm font-medium hidden sm:block">Jan Novák</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem>
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
