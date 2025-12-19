import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cpu, HardDrive, MemoryStick, Database } from 'lucide-react';

interface ServerResourcesProps {
    cpu: {
        usage: number | null;
        cores: number | null;
    };
    memory: {
        usage: number | null;
        used: string | null;
        limit: string;
    };
    disk: {
        usage: number | null;
        free: string | null;
        total: string | null;
    };
    database: {
        size: string | null;
    };
}

interface ResourceItemProps {
    icon: React.ElementType;
    label: string;
    usage: number | null;
    detail: string;
}

function ResourceItem({ icon: Icon, label, usage, detail }: ResourceItemProps) {
    const getUsageColor = (usage: number | null) => {
        if (usage === null) return 'bg-muted';
        if (usage < 50) return 'bg-green-500';
        if (usage < 80) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getTextColor = (usage: number | null) => {
        if (usage === null) return 'text-muted-foreground';
        if (usage < 50) return 'text-green-500';
        if (usage < 80) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{label}</span>
                </div>
                <div className="flex items-center gap-2">
                    {usage !== null && (
                        <span className={`text-sm font-bold ${getTextColor(usage)}`}>
                            {usage.toFixed(1)}%
                        </span>
                    )}
                    {usage === null && (
                        <Badge variant="outline" className="text-xs">N/A</Badge>
                    )}
                </div>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all ${getUsageColor(usage)}`}
                    style={{ width: `${usage || 0}%` }}
                />
            </div>
            <p className="text-xs text-muted-foreground">{detail}</p>
        </div>
    );
}

export function ServerResources({ cpu, memory, disk, database }: ServerResourcesProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Server Resources</CardTitle>
                <CardDescription>Real-time server resource monitoring</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <ResourceItem
                    icon={Cpu}
                    label="CPU"
                    usage={cpu.usage}
                    detail={cpu.cores ? `${cpu.cores} cores available` : 'CPU info not available'}
                />
                
                <ResourceItem
                    icon={MemoryStick}
                    label="Memory"
                    usage={memory.usage}
                    detail={memory.used ? `${memory.used} / ${memory.limit}` : `Limit: ${memory.limit}`}
                />
                
                <ResourceItem
                    icon={HardDrive}
                    label="Disk Space"
                    usage={disk.usage}
                    detail={
                        disk.free && disk.total 
                            ? `${disk.free} free of ${disk.total}` 
                            : 'Disk info not available'
                    }
                />

                <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Database className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Database</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                            {database.size || 'N/A'}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

