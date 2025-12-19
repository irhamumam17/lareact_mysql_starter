import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';
import { UserModel } from './user-model';
import { RoleModel } from './role-model';

export interface Auth {
    user: UserModel;
    roles: RoleModel[];
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
    items?: NavItem[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    flash: Flash;
    appSettings: AppSettings;
    [key: string]: unknown;
}

export interface Flash {
    success: string | null;
    error: string | null;
}

export interface AppSettings {
    name: string;
    logo: string;
}
