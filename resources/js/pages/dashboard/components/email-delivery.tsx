import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, CheckCircle, XCircle, Clock } from 'lucide-react';

interface EmailChartData {
    date: string;
    label: string;
    sent: number;
    failed: number;
}

interface EmailDeliveryProps {
    rate: number;
    total: number;
    successful: number;
    failed: number;
    pending: number;
    chart: EmailChartData[];
}

export function EmailDelivery({ rate, total, successful, failed, pending, chart }: EmailDeliveryProps) {
    const maxCount = Math.max(...chart.map(d => d.sent + d.failed), 1);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Email Delivery Rate</CardTitle>
                <CardDescription>Last 7 days email delivery statistics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Overall Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Delivery Rate</span>
                        </div>
                        <div className="text-2xl font-bold text-green-500">{rate}%</div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Total Emails</span>
                        </div>
                        <div className="text-2xl font-bold">{total.toLocaleString()}</div>
                    </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-green-500 border-green-500">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {successful} Sent
                    </Badge>
                    <Badge variant="outline" className="text-red-500 border-red-500">
                        <XCircle className="h-3 w-3 mr-1" />
                        {failed} Failed
                    </Badge>
                    <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {pending} Pending
                    </Badge>
                </div>

                {/* Chart */}
                <div className="space-y-3 pt-2">
                    {chart.map((item, index) => {
                        const total = item.sent + item.failed;
                        const sentPercentage = maxCount > 0 ? (item.sent / maxCount) * 100 : 0;
                        const failedPercentage = maxCount > 0 ? (item.failed / maxCount) * 100 : 0;
                        const isToday = index === chart.length - 1;

                        return (
                            <div key={item.date} className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">
                                        {item.label}
                                        {isToday && (
                                            <Badge variant="outline" className="ml-2 text-xs">
                                                Today
                                            </Badge>
                                        )}
                                    </span>
                                    <span className="text-muted-foreground">
                                        {total} emails
                                    </span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-muted overflow-hidden flex">
                                    <div
                                        className="h-full bg-green-500 transition-all"
                                        style={{ width: `${sentPercentage}%` }}
                                        title={`${item.sent} sent`}
                                    />
                                    <div
                                        className="h-full bg-red-500 transition-all"
                                        style={{ width: `${failedPercentage}%` }}
                                        title={`${item.failed} failed`}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

