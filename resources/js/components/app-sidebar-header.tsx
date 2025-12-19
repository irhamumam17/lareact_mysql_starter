import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Bell } from 'lucide-react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Link } from '@inertiajs/react';
import userNotifications from '@/routes/user-notifications';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/contexts/notification-context';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { unreadCount, latestNotifications } = useNotifications();
    return (
        <header className="flex justify-between h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative h-9 w-9">
                            <Bell className="!size-5 opacity-80" />
                            {unreadCount > 0 && (
                                <span className="absolute -right-1 -top-1 inline-flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-80 p-0" align="end">
                        <div className="max-h-96 overflow-y-auto">
                            {latestNotifications.length === 0 ? (
                                <div className="p-4 text-sm text-muted-foreground">No notifications</div>
                            ) : (
                                <ul className="divide-y">
                                    {latestNotifications.map((n) => (
                                        <li key={n.id}>
                                            <Link
                                                href={userNotifications.go.url(n.id)}
                                                className={cn(
                                                    'block p-3 transition-colors hover:bg-accent/50',
                                                    n.read_at ? 'bg-background' : 'bg-accent'
                                                )}
                                            >
                                                <div className="text-sm font-medium">{n.data.title}</div>
                                                <div className="text-xs text-muted-foreground line-clamp-2">
                                                    {n.data.body}
                                                </div>
                                                <div className="mt-1 text-[10px] text-muted-foreground">
                                                    {new Date(n.created_at).toLocaleString()}
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="border-t p-2">
                            <Link href={userNotifications.index.url()} className="block w-full">
                                <Button variant="ghost" className="w-full">
                                    Lihat semua notifikasi
                                </Button>
                            </Link>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
