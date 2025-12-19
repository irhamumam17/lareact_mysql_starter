import { GlobalSearch } from '@/components/global-search';
import { Toaster } from '@/components/ui/sonner';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { useEchoModel } from '@laravel/echo-react';
import { useEffect, type ReactNode } from 'react';
import { toast } from 'sonner';
import { NotificationProvider, useNotifications } from '@/contexts/notification-context';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

function AppLayoutContent({ children, breadcrumbs, ...props }: AppLayoutProps) {
    const page = usePage<SharedData>();
    const userId = page.props.auth.user.id;
    const { incrementUnreadCount, addNotification } = useNotifications();

    const { channel } = useEchoModel('App.Models.User', userId);
    useEffect(() => {
        const userChannel = channel();

        const handler = (notification: NotificationBroadcastModel) => {
            // Increment unread counter
            incrementUnreadCount();

            // Add notification to list
            addNotification({
                id: notification.id || crypto.randomUUID(),
                data: {
                    title: notification.title,
                    body: notification.body,
                    action_url: notification.action_url ?? null,
                },
                read_at: null,
                created_at: new Date().toISOString(),
            });

            // Show toast
            toast.info(notification.title, {
                description: notification.body,
                action: {
                    label: 'View',
                    onClick: () => {
                        if (notification.action_url) {
                            router.visit(notification.action_url);
                        } else {
                            toast.error('No action URL provided');
                        }
                    },
                },
                duration: 5000,
                position: 'top-center',
            });
        };

        // register listener
        userChannel.notification(handler);

        // cleanup listener (penting!)
        return () => {
            userChannel.stopListening('.Illuminate\\Notifications\\Events\\BroadcastNotificationCreated');
        };
    }, [channel, incrementUnreadCount, addNotification]);

    const flashMessage = page.props.flash;

    useEffect(() => {
        if (flashMessage.success) {
            toast.success(flashMessage.success, {
                duration: 2000,
                position: 'top-center',
            });
        } else if (flashMessage.error) {
            toast.error(flashMessage.error, {
                duration: 2000,
                position: 'top-center',
            });
        }
    }, [flashMessage]);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs ?? []} {...props}>
            {children}
            <Toaster />
            <GlobalSearch />
        </AppLayoutTemplate>
    );
}

export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
    const page = usePage<SharedData>();
    const notifications = (page.props as any).notifications || { latest: [], unread_count: 0 };

    return (
        <NotificationProvider
            initialUnreadCount={notifications.unread_count}
            initialNotifications={notifications.latest}
        >
            <AppLayoutContent breadcrumbs={breadcrumbs ?? []} {...props}>
                {children}
            </AppLayoutContent>
        </NotificationProvider>
    );
}
