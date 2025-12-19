import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface NotificationData {
    id: string;
    data: {
        title: string;
        body: string;
        action_url?: string | null;
    };
    read_at?: string | null;
    created_at: string;
}

interface NotificationContextType {
    unreadCount: number;
    latestNotifications: NotificationData[];
    incrementUnreadCount: () => void;
    decrementUnreadCount: () => void;
    setUnreadCount: (count: number) => void;
    addNotification: (notification: NotificationData) => void;
    setNotifications: (notifications: NotificationData[]) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ 
    children, 
    initialUnreadCount = 0,
    initialNotifications = []
}: { 
    children: ReactNode;
    initialUnreadCount?: number;
    initialNotifications?: NotificationData[];
}) {
    const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
    const [latestNotifications, setLatestNotifications] = useState<NotificationData[]>(initialNotifications);

    const incrementUnreadCount = useCallback(() => {
        setUnreadCount(prev => prev + 1);
    }, []);

    const decrementUnreadCount = useCallback(() => {
        setUnreadCount(prev => Math.max(0, prev - 1));
    }, []);

    const addNotification = useCallback((notification: NotificationData) => {
        setLatestNotifications(prev => {
            // Add to beginning and limit to 10
            const updated = [notification, ...prev];
            return updated.slice(0, 10);
        });
    }, []);

    const setNotifications = useCallback((notifications: NotificationData[]) => {
        setLatestNotifications(notifications);
    }, []);

    return (
        <NotificationContext.Provider 
            value={{ 
                unreadCount, 
                latestNotifications,
                incrementUnreadCount, 
                decrementUnreadCount,
                setUnreadCount,
                addNotification,
                setNotifications
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}

