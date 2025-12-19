import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: LucideIcon;
    iconClassName?: string;
    trend?: {
        value: number;
        label: string;
        isPositive?: boolean;
    };
    footer?: ReactNode;
}

export function StatCard({ 
    title, 
    value, 
    description, 
    icon: Icon, 
    iconClassName = 'text-primary',
    trend,
    footer 
}: StatCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className={`h-4 w-4 ${iconClassName}`} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && (
                    <p className="text-xs text-muted-foreground mt-1">{description}</p>
                )}
                {trend && (
                    <p className={`text-xs mt-1 ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {trend.isPositive ? '+' : ''}{trend.value} {trend.label}
                    </p>
                )}
                {footer && (
                    <div className="mt-3 text-xs text-muted-foreground">
                        {footer}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

