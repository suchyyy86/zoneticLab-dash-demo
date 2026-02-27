import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Trash2, Bell, Download, Filter, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

// Extended initial notifications
const initialNotifications = [
    { id: 1, title: 'Invoice #112 is overdue', titleCz: 'Faktura #112 je po splatnosti', desc: 'Please contact the client to resolve this payment issue.', descCz: 'Prosím kontaktujte klienta pro vyřešení této platby.', time: '2 min ago', timeCz: 'před 2 min', type: 'error', unread: true },
    { id: 2, title: 'New client: Tatra s.r.o.', titleCz: 'Nový klient: Tatra s.r.o.', desc: 'Client onboarding completed successfully.', descCz: 'Registrace klienta proběhla úspěšně.', time: '18 min ago', timeCz: 'před 18 min', type: 'success', unread: true },
    { id: 3, title: 'Low stock: HP Toner Cartridge', titleCz: 'Nízký sklad: HP Toner', desc: 'Less than 5 items remaining in stock. Consider reordering.', descCz: 'Skladem zbývá méně než 5 kusů. Zvažte doobjednání.', time: '1h ago', timeCz: 'před 1h', type: 'warning', unread: false },
    { id: 4, title: 'Payment received from Škoda Auto', titleCz: 'Platba přijata od Škoda Auto', desc: 'Amount: 15,200 CZK has been credited to your account.', descCz: 'Částka: 15,200 CZK byla připsána na váš účet.', time: '3h ago', timeCz: 'před 3h', type: 'info', unread: false },
    { id: 5, title: 'System Maintenance', titleCz: 'Údržba systému', desc: 'Scheduled maintenance will occur on Sunday at 2 AM.', descCz: 'Plánovaná údržba proběhne v neděli ve 2:00 ráno.', time: '1 day ago', timeCz: 'před 1 dnem', type: 'info', unread: false },
    { id: 6, title: 'Monthly Report Ready', titleCz: 'Měsíční report je připraven', desc: 'Your analytics report for last month is now available to download.', descCz: 'Váš analytický report za minulý měsíc je nyní k dispozici ke stažení.', time: '2 days ago', timeCz: 'před 2 dny', type: 'info', unread: false },
];

export default function NotificationsPage() {
    const { t } = useLanguage();
    const [notifications, setNotifications] = useState(initialNotifications);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const unreadCount = notifications.filter(n => n.unread).length;

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread') return n.unread;
        return true;
    });

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
        toast({ title: t('Success', 'Úspěch'), description: t('All notifications marked as read.', 'Všechna oznámení byla označena jako přečtená.') });
    };

    const clearAll = () => {
        setNotifications([]);
        toast({ title: t('Deleted', 'Smazáno'), description: t('All notifications have been cleared.', 'Všechna oznámení byla smazána.') });
    };

    const markAsRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    };

    const deleteNotification = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'error': return <AlertTriangle className="h-5 w-5 text-destructive" />;
            case 'success': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
            case 'info': default: return <Info className="h-5 w-5 text-blue-500" />;
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">{t('Notifications', 'Oznámení')}</h2>
                    <p className="text-muted-foreground mt-1">
                        {t(`You have ${unreadCount} unread messages`, `Máte ${unreadCount} nepřečtených zpráv`)}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
                        <Check className="h-4 w-4 mr-2" />
                        {t('Mark all as read', 'Přečíst vše')}
                    </Button>
                    <Button variant="outline" size="sm" onClick={clearAll} disabled={notifications.length === 0} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t('Clear all', 'Vymazat vše')}
                    </Button>
                </div>
            </div>

            <Card className="border-border">
                <CardHeader className="border-b border-border pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                            <Button
                                variant={filter === 'all' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setFilter('all')}
                                className="h-8"
                            >
                                {t('All', 'Vše')}
                            </Button>
                            <Button
                                variant={filter === 'unread' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setFilter('unread')}
                                className="h-8 gap-1.5"
                            >
                                {t('Unread', 'Nepřečtené')}
                                {unreadCount > 0 && (
                                    <span className="bg-primary-foreground text-primary text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                        {unreadCount}
                                    </span>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {filteredNotifications.length > 0 ? (
                        <div className="divide-y divide-border">
                            {filteredNotifications.map((n) => (
                                <div
                                    key={n.id}
                                    className={cn(
                                        "flex items-start gap-4 p-5 transition-colors hover:bg-muted/50",
                                        n.unread ? 'bg-primary/5' : ''
                                    )}
                                >
                                    <div className="mt-1 flex-shrink-0">
                                        {getIcon(n.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className={cn("text-sm transition-colors cursor-pointer", n.unread ? 'font-semibold text-foreground' : 'font-medium text-foreground')} onClick={() => n.unread && markAsRead(n.id)}>
                                                {t(n.title, n.titleCz)}
                                            </p>
                                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                {t(n.time, n.timeCz)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                            {t(n.desc, n.descCz)}
                                        </p>
                                        <div className="flex items-center gap-4 mt-3">
                                            {n.unread && (
                                                <button onClick={() => markAsRead(n.id)} className="text-xs font-medium text-primary hover:underline">
                                                    {t('Mark as read', 'Označit jako přečtené')}
                                                </button>
                                            )}
                                            <button onClick={() => deleteNotification(n.id)} className="text-xs font-medium text-muted-foreground hover:text-destructive transition-colors">
                                                {t('Delete', 'Smazat')}
                                            </button>
                                        </div>
                                    </div>
                                    {n.unread && (
                                        <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center flex flex-col items-center justify-center">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                <Bell className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="text-lg font-medium text-foreground">{t('No notifications', 'Žádná oznámení')}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                {filter === 'unread'
                                    ? t("You don't have any unread notifications right now.", "Momentálně nemáte žádná nepřečtená oznámení.")
                                    : t("You're all caught up! No notifications to show.", "Jste v obraze! Nejsou zde žádná oznámení.")}
                            </p>
                            {filter === 'unread' && notifications.length > 0 && (
                                <Button variant="outline" className="mt-6" onClick={() => setFilter('all')}>
                                    {t('View all notifications', 'Zobrazit všechna oznámení')}
                                </Button>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
