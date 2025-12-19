import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, User, History, Activity, Bell, Shield, Map, Flag, Building, Mail, ShieldAlert, BarChart3, HeartPulse } from 'lucide-react';
import AppLogo from './app-logo';
import users from '@/routes/users';
import activityLogs from '@/routes/activity-logs';
import sessions from '@/routes/sessions';
import userNotifications from '@/routes/user-notifications';
import roles from '@/routes/roles';
import countries from '@/routes/countries';
import provinces from '@/routes/provinces';
import regencies from '@/routes/regencies';
import districts from '@/routes/districts';
import villages from '@/routes/villages';
import mails from '@/routes/mails';
import blockedIps from '@/routes/blocked-ips';
import rateLimits from '@/routes/rate-limits';
import healthCheck from '@/routes/health-check';

const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'User',
        href: users.index(),
        icon: User,
    },
    {
        title: 'Roles',
        href: roles.index(),
        icon: Shield,
    },
    {
        title: 'Activity Logs',
        href: activityLogs.index(),
        icon: History,
    },
    {
        title: 'Sessions',
        href: sessions.index(),
        icon: Activity,
    },
    {
        title: 'Notifications',
        href: userNotifications.index(),
        icon: Bell,
    },
    {
        title: 'Mails',
        href: mails.index(),
        icon: Mail,
    },
    {
        title: 'Locations Master',
        icon: Map,
        href: '#',
        items: [
            {
                title: 'Countries',
                href: countries.index(),
                icon: Flag,
            },
            {
                title: 'Provinces',
                href: provinces.index(),
                icon: Map,
            },
            {
                title: 'Regencies',
                href: regencies.index(),
                icon: Building,
            },
            {
                title: 'Districts',
                href: districts.index(),
                icon: Building,
            },
            {
                title: 'Villages',
                href: villages.index(),
                icon: Building,
            },
        ],
    },
    {
        title: 'Blocked IPs & MACs',
        href: blockedIps.index(),
        icon: ShieldAlert,
    },
    {
        title: 'Rate Limit Monitor',
        href: rateLimits.index(),
        icon: BarChart3,
    },
    {
        title: 'Health Check',
        href: healthCheck.index(),
        icon: HeartPulse,
    }
];

const userNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Notifications',
        href: userNotifications.index(),
        icon: Bell,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {auth.user?.roles.find(role => role.name.toLowerCase() === 'admin') && (
                    <NavMain items={adminNavItems} />
                )}
                {auth.user?.roles.find(role => role.name.toLowerCase() === 'user') && (
                    <NavMain items={userNavItems} />
                )}
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
