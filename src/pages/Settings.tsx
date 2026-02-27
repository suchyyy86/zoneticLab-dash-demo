import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { CreditCard, Shield, User, Building2, Monitor, Lock, Palette, Bell, Sun, Moon, Laptop } from 'lucide-react';
import { useTheme, ACCENT_COLORS } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'profile', en: 'Profile', cz: 'Profil', icon: User },
  { id: 'company', en: 'Company', cz: 'Společnost', icon: Building2 },
  { id: 'appearance', en: 'Appearance', cz: 'Vzhled', icon: Palette },
  { id: 'notifications', en: 'Notifications', cz: 'Oznámení', icon: Bell },
  { id: 'security', en: 'Security', cz: 'Zabezpečení', icon: Shield },
  { id: 'billing', en: 'Billing', cz: 'Platby', icon: CreditCard },
];

const payments = [
  { date: '2024-01-01', desc: 'Pro Plan – Jan 2024', amount: 49 },
  { date: '2023-12-01', desc: 'Pro Plan – Dec 2023', amount: 49 },
  { date: '2023-11-01', desc: 'Pro Plan – Nov 2023', amount: 49 },
  { date: '2023-10-01', desc: 'Pro Plan – Oct 2023', amount: 49 },
  { date: '2023-09-01', desc: 'Pro Plan – Sep 2023', amount: 49 },
];

const sessions = [
  { device: 'Chrome on Windows', ip: '82.117.xxx.xx', location: 'Prague, CZ', current: true },
  { device: 'Safari on iPhone', ip: '31.30.xxx.xx', location: 'Brno, CZ', current: false },
];

export default function SettingsPage() {
  const { t, formatCurrency } = useLanguage();
  const { theme, setTheme, accentColor, setAccentColor, fontSize, setFontSize } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState(tabParam && tabs.some(t => t.id === tabParam) ? tabParam : 'profile');
  const [twoFA, setTwoFA] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [notifications, setNotifications] = useState({ email: true, push: true, slack: false, sms: false });

  useEffect(() => {
    if (tabParam && tabs.some(t => t.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    setSearchParams({ tab: id });
  };

  const handleSave = () => {
    toast({ title: t('Changes saved!', 'Změny uloženy!'), description: t('Your profile has been updated.', 'Váš profil byl aktualizován.') });
  };

  return (
    <div className="flex gap-6">
      {/* Vertical tabs sidebar */}
      <div className="w-44 shrink-0 space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-left',
              activeTab === tab.id
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <tab.icon className="h-4 w-4 shrink-0" />
            {t(tab.en, tab.cz)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <Card className="border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">{t('Profile Settings', 'Nastavení profilu')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                  JN
                </div>
                <div>
                  <Button variant="outline" size="sm">{t('Upload Photo', 'Nahrát foto')}</Button>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 2MB</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>{t('First Name', 'Jméno')}</Label>
                  <Input defaultValue="Jan" />
                </div>
                <div className="space-y-1.5">
                  <Label>{t('Last Name', 'Příjmení')}</Label>
                  <Input defaultValue="Novák" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>{t('Email', 'E-mail')}</Label>
                <Input type="email" defaultValue="jan.novak@zoneticlab.cz" />
              </div>
              <div className="space-y-1.5">
                <Label>{t('Bio', 'Bio')}</Label>
                <Textarea defaultValue="Head of Digital at ZoneticLab. Passionate about UX and data-driven marketing." className="resize-none h-20" />
              </div>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleSave}>{t('Save Changes', 'Uložit změny')}</Button>
            </CardContent>
          </Card>
        )}

        {/* Company Tab */}
        {activeTab === 'company' && (
          <Card className="border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">{t('Company Settings', 'Nastavení společnosti')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-1.5">
                <Label>{t('Company Name', 'Název společnosti')}</Label>
                <Input defaultValue="ZoneticLab s.r.o." />
              </div>
              <div className="space-y-1.5">
                <Label>{t('Website', 'Web')}</Label>
                <Input defaultValue="https://zoneticlab.cz" />
              </div>
              <div className="space-y-1.5">
                <Label>{t('Address', 'Adresa')}</Label>
                <Input defaultValue="Václavské náměstí 1, 110 00 Praha 1" />
              </div>
              <div className="space-y-1.5">
                <Label>{t('VAT Number', 'DIČ')}</Label>
                <Input defaultValue="CZ12345678" />
              </div>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleSave}>{t('Save Changes', 'Uložit změny')}</Button>
            </CardContent>
          </Card>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{t('Security Settings', 'Nastavení zabezpečení')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{t('Two-Factor Authentication', 'Dvoufaktorové ověření')}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t('Add an extra layer of security to your account', 'Přidejte extra vrstvu zabezpečení')}</p>
                  </div>
                  <Switch checked={twoFA} onCheckedChange={(v) => {
                    setTwoFA(v);
                    toast({ title: v ? t('2FA Enabled', '2FA povoleno') : t('2FA Disabled', '2FA zakázáno') });
                  }} />
                </div>

                <div className="border-t border-border pt-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{t('Password', 'Heslo')}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t('Last changed 3 months ago', 'Naposledy změněno před 3 měsíci')}</p>
                  </div>
                  <Dialog open={pwOpen} onOpenChange={setPwOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2"><Lock className="h-3.5 w-3.5" />{t('Change', 'Změnit')}</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-sm">
                      <DialogHeader><DialogTitle>{t('Change Password', 'Změnit heslo')}</DialogTitle></DialogHeader>
                      <div className="space-y-4 pt-2">
                        <div className="space-y-1.5"><Label>{t('Current Password', 'Současné heslo')}</Label><Input type="password" /></div>
                        <div className="space-y-1.5"><Label>{t('New Password', 'Nové heslo')}</Label><Input type="password" /></div>
                        <div className="space-y-1.5"><Label>{t('Confirm Password', 'Potvrdit heslo')}</Label><Input type="password" /></div>
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" onClick={() => setPwOpen(false)}>{t('Cancel', 'Zrušit')}</Button>
                          <Button className="bg-primary text-primary-foreground" onClick={() => { setPwOpen(false); toast({ title: t('Password updated', 'Heslo aktualizováno') }); }}>{t('Update', 'Uložit')}</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  {t('Active Sessions', 'Aktivní relace')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {sessions.map((s, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {s.device}{' '}
                        {s.current && (
                          <span className="text-xs text-green-600 font-semibold ml-1">
                            ({t('Current', 'Aktuální')})
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">{s.ip} · {s.location}</p>
                    </div>
                    {!s.current && (
                      <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => toast({ title: t('Session revoked', 'Relace zrušena') })}>
                        {t('Revoke', 'Odvolat')}
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Appearance Tab */}
        {activeTab === 'appearance' && (
          <div className="space-y-4">
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{t('Appearance', 'Vzhled')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <Label className="text-sm font-medium">{t('Theme', 'Motiv')}</Label>
                  <p className="text-xs text-muted-foreground mb-3">{t('Choose your preferred color scheme', 'Vyberte preferované barevné schéma')}</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'light', label: t('Light', 'Světlý'), icon: Sun, preview: 'bg-white border-gray-200' },
                      { id: 'dark', label: t('Dark', 'Tmavý'), icon: Moon, preview: 'bg-gray-900 border-gray-700' },
                      { id: 'system', label: t('System', 'Systém'), icon: Laptop, preview: 'bg-gradient-to-r from-white to-gray-900 border-gray-300' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setTheme(opt.id as 'light' | 'dark' | 'system')}
                        className={cn(
                          'flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all',
                          theme === opt.id ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/30'
                        )}
                      >
                        <div className={`h-10 w-full rounded-md border ${opt.preview}`} />
                        <div className="flex items-center gap-1.5 text-xs font-medium">
                          <opt.icon className="h-3 w-3" />
                          {opt.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <Label className="text-sm font-medium">{t('Accent Color', 'Barva akcentu')}</Label>
                  <p className="text-xs text-muted-foreground mb-3">{t('Customize the primary color of the interface', 'Upravte hlavní barvu rozhraní')}</p>
                  <div className="flex gap-2">
                    {ACCENT_COLORS.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setAccentColor(c)}
                        className={cn(
                          'h-8 w-8 rounded-full border-2 transition-transform hover:scale-110',
                          accentColor.name === c.name ? 'border-foreground ring-2 ring-offset-2 ring-primary' : 'border-transparent'
                        )}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <Label className="text-sm font-medium">{t('Font Size', 'Velikost písma')}</Label>
                  <p className="text-xs text-muted-foreground mb-3">{t('Adjust the interface font size', 'Upravte velikost písma rozhraní')}</p>
                  <div className="flex items-center gap-3">
                    {(['S', 'M', 'L'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => setFontSize(size)}
                        className={cn(
                          'h-9 w-12 rounded-md border text-xs font-bold transition-colors',
                          fontSize === size ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{t('Notification Preferences', 'Předvolby oznámení')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {[
                  { key: 'email' as const, label: t('Email Notifications', 'E-mailová oznámení'), desc: t('Receive updates and reports via email', 'Dostávejte aktualizace a reporty e-mailem') },
                  { key: 'push' as const, label: t('Push Notifications', 'Push oznámení'), desc: t('Get real-time alerts in your browser', 'Dostávejte upozornění v reálném čase v prohlížeči') },
                  { key: 'slack' as const, label: t('Slack Integration', 'Integrace Slack'), desc: t('Forward notifications to your Slack workspace', 'Přeposílejte oznámení do vašeho Slack workspace') },
                  { key: 'sms' as const, label: t('SMS Alerts', 'SMS upozornění'), desc: t('Receive critical alerts via SMS', 'Dostávejte kritická upozornění přes SMS') },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    <Switch
                      checked={notifications[item.key]}
                      onCheckedChange={(v) => {
                        setNotifications(prev => ({ ...prev, [item.key]: v }));
                        toast({ title: v ? t('Enabled', 'Povoleno') : t('Disabled', 'Zakázáno'), description: item.label });
                      }}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">{t('Notification Schedule', 'Plán oznámení')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{t('Quiet Hours', 'Klidové hodiny')}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t('Pause notifications during set hours', 'Pozastavit oznámení v nastavených hodinách')}</p>
                  </div>
                  <Switch />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">{t('From', 'Od')}</Label>
                    <Input type="time" defaultValue="22:00" className="h-9" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">{t('To', 'Do')}</Label>
                    <Input type="time" defaultValue="07:00" className="h-9" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === 'billing' && (
          <div className="space-y-4">
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{t('Billing & Plan', 'Platby a plán')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center justify-between p-4 rounded-lg bg-accent border border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">{t('Current Plan', 'Aktuální plán')}</p>
                    <p className="font-bold text-lg text-primary">Pro</p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground">Pro Plan</span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{t('Payment Method', 'Platební metoda')}</p>
                      <p className="text-xs text-muted-foreground font-mono">Visa •••• •••• •••• 4242</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">{t('Update', 'Aktualizovat')}</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">{t('Payment History', 'Historie plateb')}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground">{t('Date', 'Datum')}</th>
                      <th className="text-left px-3 py-2.5 text-xs font-medium text-muted-foreground">{t('Description', 'Popis')}</th>
                      <th className="text-right px-5 py-2.5 text-xs font-medium text-muted-foreground">{t('Amount', 'Částka')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p, i) => (
                      <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30">
                        <td className="px-5 py-3 text-xs text-muted-foreground">{p.date}</td>
                        <td className="px-3 py-3 text-sm">{p.desc}</td>
                        <td className="px-5 py-3 text-right font-semibold">{formatCurrency(p.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
