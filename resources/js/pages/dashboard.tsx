import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { StatCard } from './dashboard/components/stat-card';
import { FailedLoginChart } from './dashboard/components/failed-login-chart';
import { MostAccessedPages } from './dashboard/components/most-accessed-pages';
import { ServerResources } from './dashboard/components/server-resources';
import { EmailDelivery } from './dashboard/components/email-delivery';
import { BlockedIps } from './dashboard/components/blocked-ips';
import { Users, Activity, ShieldAlert, Mail, TrendingUp, UserCheck } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface DashboardStats {
    totalUsers: {
        total: number;
        today: number;
        thisMonth: number;
    };
    activeSessions: {
        total: number;
        active: number;
        online: number;
    };
    failedLoginAttempts: {
        today: number;
        thisWeek: number;
        thisMonth: number;
        topFailedIps: Array<{ ip_address: string; attempts: number }>;
    };
    failedLoginChart: {
        daily: Array<{ date: string; label: string; count: number }>;
        hourly: Array<{ hour: string; count: number }>;
    };
    mostAccessedPages: {
        pages: Array<{ url: string; name: string; count: number }>;
        total: number;
    };
    serverResources: {
        cpu: { usage: number | null; cores: number | null };
        memory: { usage: number | null; used: string | null; limit: string };
        disk: { usage: number | null; free: string | null; total: string | null };
        database: { size: string | null };
    };
    blockedIpsStats: {
        total: number;
        active: number;
        autoBlocked: number;
        recent: Array<{ ip: string; reason: string; type: string; created_at: string }>;
    };
    emailDeliveryRate: {
        rate: number;
        total: number;
        successful: number;
        failed: number;
        pending: number;
        chart: Array<{ date: string; label: string; sent: number; failed: number }>;
    };
}

interface DashboardProps {
    stats: DashboardStats;
}

export default function Dashboard({ stats }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back! Here's what's happening with your application.
                    </p>
                </div>

                {/* Top Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Users"
                        value={stats.totalUsers.total.toLocaleString()}
                        description={`${stats.totalUsers.today} new today`}
                        icon={Users}
                        iconClassName="text-blue-500"
                        trend={{
                            value: stats.totalUsers.thisMonth,
                            label: 'this month',
                            isPositive: true,
                        }}
                    />
                    
                    <StatCard
                        title="Active Sessions"
                        value={stats.activeSessions.active.toLocaleString()}
                        description={`${stats.activeSessions.online} online now`}
                        icon={Activity}
                        iconClassName="text-green-500"
                        footer={
                            <span>{stats.activeSessions.total} total sessions</span>
                        }
                    />
                    
                    <StatCard
                        title="Failed Logins"
                        value={stats.failedLoginAttempts.today.toLocaleString()}
                        description="Today's failed attempts"
                        icon={ShieldAlert}
                        iconClassName="text-red-500"
                        footer={
                            <span>{stats.failedLoginAttempts.thisWeek} this week</span>
                        }
                    />
                    
                    <StatCard
                        title="Email Delivery"
                        value={`${stats.emailDeliveryRate.rate}%`}
                        description="Success rate (7 days)"
                        icon={Mail}
                        iconClassName="text-purple-500"
                        footer={
                            <span>{stats.emailDeliveryRate.total.toLocaleString()} total sent</span>
                        }
                    />
                </div>

                {/* Charts Row */}
                <div className="grid gap-4 md:grid-cols-2">
                    <FailedLoginChart data={stats.failedLoginChart.daily} />
                    <MostAccessedPages 
                        pages={stats.mostAccessedPages.pages}
                        total={stats.mostAccessedPages.total}
                    />
                </div>

                {/* Server & Security Row */}
                <div className="grid gap-4 md:grid-cols-2">
                    <ServerResources {...stats.serverResources} />
                    <BlockedIps {...stats.blockedIpsStats} />
                </div>

                {/* Email Delivery */}
                <EmailDelivery {...stats.emailDeliveryRate} />
            </div>
        </AppLayout>
    );
}
