import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

interface BlockedIpData {
    ip: string;
    reason: string;
    type: string;
    created_at: string;
}

interface BlockedIpsProps {
    total: number;
    active: number;
    autoBlocked: number;
    recent: BlockedIpData[];
}

export function BlockedIps({ total, active, autoBlocked, recent }: BlockedIpsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Blocked IPs Statistics</CardTitle>
                <CardDescription>Security monitoring and blocked IP addresses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Total</span>
                        </div>
                        <div className="text-2xl font-bold">{total}</div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-green-500" />
                            <span className="text-xs text-muted-foreground">Active</span>
                        </div>
                        <div className="text-2xl font-bold text-green-500">{active}</div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <ShieldAlert className="h-4 w-4 text-red-500" />
                            <span className="text-xs text-muted-foreground">Auto</span>
                        </div>
                        <div className="text-2xl font-bold text-red-500">{autoBlocked}</div>
                    </div>
                </div>

                {/* Recent Blocks */}
                <div className="space-y-2 pt-2 border-t">
                    <h4 className="text-sm font-medium">Recent Blocks</h4>
                    {recent.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            No blocked IPs yet
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {recent.map((block, index) => (
                                <div 
                                    key={index} 
                                    className="flex items-start justify-between gap-2 p-2 rounded-lg bg-muted/50"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <code className="text-xs font-mono font-semibold">
                                                {block.ip}
                                            </code>
                                            <Badge 
                                                variant={block.type === 'auto' ? 'destructive' : 'secondary'}
                                                className="text-xs"
                                            >
                                                {block.type}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1 truncate">
                                            {block.reason}
                                        </p>
                                    </div>
                                    <span className="text-xs text-muted-foreground flex-shrink-0">
                                        {new Date(block.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

