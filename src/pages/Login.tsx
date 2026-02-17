import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import logo from '@/assets/zoneticlab_logo.png';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Welcome back!', description: 'Redirecting to dashboard...' });
    setTimeout(() => navigate('/'), 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <img src={logo} alt="ZoneticLab" className="h-10 mx-auto" />
          <p className="text-sm text-muted-foreground">Sign in to your admin dashboard</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4 bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" defaultValue="jan.novak@zoneticlab.cz" />
          </div>
          <div className="space-y-1.5">
            <Label>Password</Label>
            <Input type="password" defaultValue="••••••••" />
          </div>
          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
