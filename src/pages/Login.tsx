import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import logo from '@/assets/zoneticlab_logo.png';
import { Sun, Moon, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { t, language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: t('Welcome back!', 'Vítejte zpět!'), description: t('Redirecting to dashboard...', 'Přesměrování na dashboard...') });
    setTimeout(() => navigate('/'), 1000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50 dark:from-slate-950 dark:via-blue-950/50 dark:to-slate-900" />
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/20 to-blue-400/20 blur-3xl mesh-blob" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-sky-400/15 to-indigo-400/15 blur-3xl mesh-blob-2" />
      <div className="absolute top-[30%] right-[10%] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-violet-400/10 to-blue-400/10 blur-3xl mesh-blob-3" />

      {/* Top right controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9 glass rounded-full">
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="sm" onClick={toggleLanguage} className="h-9 glass rounded-full font-semibold text-xs px-3">
          {language === 'EN' ? '🇨🇿 CZ' : '🇬🇧 EN'}
        </Button>
      </div>

      {/* Login card */}
      <div className="w-full max-w-sm space-y-6 relative z-10 animate-fade-in-up">
        <div className="text-center space-y-2">
          <img src={logo} alt="ZoneticLab" className="h-10 mx-auto" />
          <p className="text-sm text-muted-foreground">{t('Sign in to your admin dashboard', 'Přihlaste se do administrace')}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 glass rounded-2xl p-6 shadow-xl shadow-primary/5">
          <div className="space-y-1.5">
            <Label>{t('Email', 'E-mail')}</Label>
            <Input type="email" defaultValue="jan.novak@zoneticlab.cz" className="bg-background/50" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>{t('Password', 'Heslo')}</Label>
              <button type="button" className="text-xs text-primary hover:underline">{t('Forgot password?', 'Zapomenuté heslo?')}</button>
            </div>
            <Input type="password" defaultValue="••••••••" className="bg-background/50" />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="remember" defaultChecked />
            <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
              {t('Remember me', 'Zapamatovat si mě')}
            </label>
          </div>
          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2 group">
            {t('Sign In', 'Přihlásit se')}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground/60">
          {t('Demo credentials are pre-filled', 'Demo přihlašovací údaje jsou předvyplněny')}
        </p>
      </div>
    </div>
  );
}
