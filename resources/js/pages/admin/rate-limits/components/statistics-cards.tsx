import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RateLimitStatistics } from "@/types/rate-limit-log-model";
import { Activity, AlertTriangle, Ban, Clock } from "lucide-react";

interface StatisticsCardsProps {
    statistics: RateLimitStatistics;
}

export function StatisticsCards({ statistics }: StatisticsCardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Today's Violations</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{statistics.total_today.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                        Last hour: {statistics.last_hour}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Critical</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-destructive">
                        {statistics.critical_today.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Requires immediate attention
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Auto-Blocked</CardTitle>
                    <Ban className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-orange-500">
                        {statistics.auto_blocked_today.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Automatically blocked IPs
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Last 24 Hours</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{statistics.last_24_hours.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                        Total violations
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

