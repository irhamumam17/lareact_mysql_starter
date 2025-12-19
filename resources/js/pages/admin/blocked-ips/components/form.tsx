import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BlockedIpModel } from "@/types/blocked-ip-model";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import InputError from "@/components/input-error";
import { Checkbox } from "@/components/ui/checkbox";

interface BlockedIpFormProps {
    blockedIp?: BlockedIpModel;
    onSubmit: (data: any) => void;
    submitLabel?: string;
}

export function BlockedIpForm({ blockedIp, onSubmit, submitLabel = "Save" }: BlockedIpFormProps) {
    const { data, setData, errors, processing } = useForm({
        type: blockedIp?.type || 'ip',
        ip_address: blockedIp?.ip_address || '',
        mac_address: blockedIp?.mac_address || '',
        reason: blockedIp?.reason || '',
        description: blockedIp?.description || '',
        is_active: blockedIp?.is_active ?? true,
        expires_at: blockedIp?.expires_at ? blockedIp.expires_at.split('T')[0] : '',
    });

    const [selectedType, setSelectedType] = useState(data.type);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        onSubmit(data);
    };

    const handleTypeChange = (value: string) => {
        setSelectedType(value);
        setData('type', value as 'ip' | 'mac');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Block Information</CardTitle>
                    <CardDescription>
                        Add or update IP or MAC address to block
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="type">Type *</Label>
                        <Select value={data.type} onValueChange={handleTypeChange}>
                            <SelectTrigger id="type">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ip">IP Address</SelectItem>
                                <SelectItem value="mac">MAC Address</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.type} />
                    </div>

                    {selectedType === 'ip' && (
                        <div className="space-y-2">
                            <Label htmlFor="ip_address">IP Address *</Label>
                            <Input
                                id="ip_address"
                                type="text"
                                value={data.ip_address}
                                onChange={e => setData('ip_address', e.target.value)}
                                placeholder="e.g., 192.168.1.1"
                            />
                            <InputError message={errors.ip_address} />
                            <p className="text-sm text-muted-foreground">
                                Enter a valid IPv4 or IPv6 address
                            </p>
                        </div>
                    )}

                    {selectedType === 'mac' && (
                        <div className="space-y-2">
                            <Label htmlFor="mac_address">MAC Address *</Label>
                            <Input
                                id="mac_address"
                                type="text"
                                value={data.mac_address}
                                onChange={e => setData('mac_address', e.target.value)}
                                placeholder="e.g., 00:1B:44:11:3A:B7"
                            />
                            <InputError message={errors.mac_address} />
                            <p className="text-sm text-muted-foreground">
                                Format: XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX
                            </p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="reason">Reason</Label>
                        <Input
                            id="reason"
                            type="text"
                            value={data.reason}
                            onChange={e => setData('reason', e.target.value)}
                            placeholder="e.g., Suspicious activity"
                        />
                        <InputError message={errors.reason} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            placeholder="Additional details about this block"
                            rows={3}
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="expires_at">Expiration Date</Label>
                        <Input
                            id="expires_at"
                            type="date"
                            value={data.expires_at}
                            onChange={e => setData('expires_at', e.target.value)}
                        />
                        <InputError message={errors.expires_at} />
                        <p className="text-sm text-muted-foreground">
                            Leave empty for permanent block
                        </p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="is_active"
                            checked={data.is_active}
                            onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                        />
                        <Label
                            htmlFor="is_active"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Active
                        </Label>
                    </div>
                    <InputError message={errors.is_active} />
                </CardContent>
            </Card>

            <div className="flex items-center gap-2">
                <Button type="submit" disabled={processing}>
                    {processing ? 'Saving...' : submitLabel}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.history.back()}
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
}

