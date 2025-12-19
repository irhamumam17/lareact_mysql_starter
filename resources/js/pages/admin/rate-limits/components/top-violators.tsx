import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RateLimitStatistics } from "@/types/rate-limit-log-model";
import { Badge } from "@/components/ui/badge";

interface TopViolatorsProps {
    statistics: RateLimitStatistics;
}

export function TopViolators({ statistics }: TopViolatorsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Top IPs (24h)</CardTitle>
                    <CardDescription>IP addresses with most violations</CardDescription>
                </CardHeader>
                <CardContent>
                    {statistics.top_ips.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No violations in the last 24 hours</p>
                    ) : (
                        <div className="space-y-2">
                            {statistics.top_ips.map((ip, index) => (
                                <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                                    <div>
                                        <p className="font-mono text-sm">{ip.ip_address}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {ip.total_attempts.toLocaleString()} total attempts
                                        </p>
                                    </div>
                                    <Badge variant="destructive">{ip.violation_count}</Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Top Endpoints (24h)</CardTitle>
                    <CardDescription>Most targeted endpoints</CardDescription>
                </CardHeader>
                <CardContent>
                    {statistics.top_endpoints.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No violations in the last 24 hours</p>
                    ) : (
                        <div className="space-y-2">
                            {statistics.top_endpoints.map((endpoint, index) => (
                                <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-xs">
                                                {endpoint.method}
                                            </Badge>
                                            <p className="text-sm truncate font-mono">/{endpoint.endpoint}</p>
                                        </div>
                                    </div>
                                    <Badge variant="destructive">{endpoint.violation_count}</Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

