import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  LayoutDashboard, BarChart3, FileText, Package, Users, Settings, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import logo from '@/assets/zoneticlab_logo.png';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: LayoutDashboard, en: 'Dashboard', cz: 'Přehled', exact: true },
  { to: '/analytics', icon: BarChart3, en: 'Analytics', cz: 'Analytika' },
  { to: '/invoices', icon: FileText, en: 'Invoices', cz: 'Fakturace' },
  { to: '/inventory', icon: Package, en: 'Inventory', cz: 'Sklad' },
  { to: '/customers', icon: Users, en: 'Customers', cz: 'Klienti' },
  { to: '/settings', icon: Settings, en: 'Settings', cz: 'Nastavení' },
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const { t } = useLanguage();
  const location = useLocation();

  return (
    <aside
      className={cn(
        'flex flex-col border-r border-border bg-card h-screen sticky top-0 transition-all duration-300 shrink-0 z-30',
        collapsed ? 'w-16' : 'w-56'
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center border-b border-border', collapsed ? 'justify-center p-3 h-16' : 'px-5 h-16 gap-3')}>
        <NavLink to="/">
          <img src={logo} alt="ZoneticLab" className={cn('object-contain cursor-pointer', collapsed ? 'h-8 w-8' : 'h-8')} />
        </NavLink>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, en, cz, exact }) => {
          const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);

          const linkContent = (
            <NavLink
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary/10 text-primary sidebar-active-indicator'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                collapsed && 'justify-center px-2'
              )}
            >
              <Icon className={cn('shrink-0', collapsed ? 'h-5 w-5' : 'h-4 w-4')} />
              {!collapsed && <span>{t(en, cz)}</span>}
            </NavLink>
          );

          if (collapsed) {
            return (
              <Tooltip key={to} delayDuration={0}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  {t(en, cz)}
                </TooltipContent>
              </Tooltip>
            );
          }

          return linkContent;
        })}
      </nav>

      {/* Version + Collapse toggle */}
      <div className="border-t border-border p-2 space-y-1">
        {!collapsed && (
          <div className="px-3 py-1.5 text-[10px] text-muted-foreground/60 font-mono">
            v2.4.0 — Demo
          </div>
        )}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <><ChevronLeft className="h-4 w-4" /><span>{t('Collapse', 'Skrýt')}</span></>}
        </button>
      </div>
    </aside>
  );
}
