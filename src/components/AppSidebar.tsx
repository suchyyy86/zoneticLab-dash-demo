import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  LayoutDashboard, BarChart3, FileText, Package, Users, Settings, ChevronLeft, ChevronRight
} from 'lucide-react';
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
        <img src={logo} alt="ZoneticLab" className={cn('object-contain', collapsed ? 'h-8 w-8' : 'h-8')} />
        {!collapsed && (
          <span className="font-bold text-sm text-foreground tracking-tight">ZoneticLab</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, en, cz, exact }) => {
          const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className={cn('shrink-0', collapsed ? 'h-5 w-5' : 'h-4 w-4')} />
              {!collapsed && <span>{t(en, cz)}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-border p-2">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <><ChevronLeft className="h-4 w-4" /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}
