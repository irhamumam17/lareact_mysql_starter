import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PageData {
    url: string;
    name: string;
    count: number;
}

interface MostAccessedPagesProps {
    pages: PageData[];
    total: number;
}

export function MostAccessedPages({ pages, total }: MostAccessedPagesProps) {
    const maxCount = Math.max(...pages.map(p => p.count), 1);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Most Accessed Pages</CardTitle>
                <CardDescription>Top 10 pages in the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {pages.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            No page access data available yet
                        </p>
                    ) : (
                        pages.map((page, index) => {
                            const percentage = (page.count / maxCount) * 100;
                            const sharePercentage = total > 0 ? ((page.count / total) * 100).toFixed(1) : 0;

                            return (
                                <div key={index} className="space-y-1">
                                    <div className="flex items-center justify-between gap-2 text-sm">
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <Badge variant="outline" className="text-xs">
                                                #{index + 1}
                                            </Badge>
                                            <span className="font-medium truncate">
                                                {page.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <span className="text-xs text-muted-foreground">
                                                {sharePercentage}%
                                            </span>
                                            <span className="text-muted-foreground">
                                                {page.count.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-primary transition-all"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

