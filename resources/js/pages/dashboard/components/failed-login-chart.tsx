import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ChartData {
    date: string;
    label: string;
    count: number;
}

interface FailedLoginChartProps {
    data: ChartData[];
}

export function FailedLoginChart({ data }: FailedLoginChartProps) {
    const maxCount = Math.max(...data.map(d => d.count), 1);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Failed Login Attempts (Last 7 Days)</CardTitle>
                <CardDescription>Daily failed login attempts trend</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {data.map((item, index) => {
                        const percentage = (item.count / maxCount) * 100;
                        const isToday = index === data.length - 1;
                        
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
                                        {item.count} {item.count === 1 ? 'attempt' : 'attempts'}
                                    </span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all ${
                                            item.count > 0 ? 'bg-destructive' : 'bg-muted'
                                        }`}
                                        style={{ width: `${percentage}%` }}
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

