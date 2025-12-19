"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import rolesRoutes from "@/routes/roles";
import usersRoutes from "@/routes/users";
import { SharedData } from "@/types";
import { RoleModel } from "@/types/role-model";
import { UserModel } from "@/types/user-model";
import axios from "axios";
import { X } from "lucide-react";
import { router, usePage } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";

interface ChangeRoleProps {
    user: UserModel;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ChangeRole({ user, open, onOpenChange }: ChangeRoleProps) {
    const { auth } = usePage<SharedData>().props;

    const [allRoles, setAllRoles] = useState<RoleModel[]>([]);
    const [loadingRoles, setLoadingRoles] = useState(false);
    const [saving, setSaving] = useState(false);

    // Local state for the selected user's roles
    const [userRoles, setUserRoles] = useState<RoleModel[]>(user.roles ?? auth.roles ?? []);

    useEffect(() => {
        // Sync dialog roles with latest user prop when opening
        if (open) {
            setUserRoles(user.roles ?? auth.roles ?? []);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, user.id]);

    useEffect(() => {
        if (!open) return;
        setLoadingRoles(true);
        const { url } = rolesRoutes.index.get();
        axios
            .get<RoleModel[]>(url, { headers: { Accept: "application/json" } })
            .then((res) => setAllRoles(res.data))
            .finally(() => setLoadingRoles(false));
    }, [open]);

    const unassignedRoles = useMemo(() => {
        const assignedIds = new Set(userRoles.map((r) => r.id));
        return allRoles.filter((r) => !assignedIds.has(r.id));
    }, [allRoles, userRoles]);

    async function handleAddRole(roleId: number) {
        if (saving) return;
        try {
            setSaving(true);
            const { url } = usersRoutes.assignRole.post(user.id);
            const res = await axios.post(url, { role_id: roleId }, {
                headers: { Accept: "application/json" },
            });
            const nextRoles: RoleModel[] = res.data.roles ?? [];
            setUserRoles(nextRoles);
            router.reload({ only: ["users"] });
        } finally {
            setSaving(false);
        }
    }

    async function handleRemoveRole(role: RoleModel) {
        if (saving) return;
        try {
            setSaving(true);
            const { url } = usersRoutes.removeRole.delete({ user: user.id, role: role.id });
            const res = await axios.delete(url, {
                headers: { Accept: "application/json" },
            });
            const nextRoles: RoleModel[] = res.data.roles ?? [];
            setUserRoles(nextRoles);
            router.reload({ only: ["users"] });
        } finally {
            setSaving(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change Role</DialogTitle>
                    <DialogDescription>
                        Manage roles for user <b>{user.name}</b>
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4">
                    <div>
                        <div className="mb-2 text-sm font-medium">Current roles</div>
                        <div className="flex flex-wrap gap-2">
                            {userRoles.length === 0 && (
                                <span className="text-muted-foreground text-sm">No roles assigned</span>
                            )}
                            {userRoles.map((role) => (
                                <span key={role.id} className="inline-flex items-center gap-1">
                                    <Badge>{role.name}</Badge>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 px-1"
                                        disabled={saving}
                                        onClick={() => handleRemoveRole(role)}
                                        aria-label={`Remove ${role.name}`}
                                    >
                                        <X className="size-3" />
                                    </Button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="mb-2 text-sm font-medium">Add role</div>
                        <Select
                            disabled={loadingRoles || saving || unassignedRoles.length === 0}
                            onValueChange={(val) => handleAddRole(Number(val))}
                        >
                            <SelectTrigger aria-label="Select role to add">
                                <SelectValue placeholder={loadingRoles ? "Loading roles..." : "Select role"} />
                            </SelectTrigger>
                            <SelectContent>
                                {unassignedRoles.map((r) => (
                                    <SelectItem key={r.id} value={String(r.id)}>
                                        {r.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {unassignedRoles.length === 0 && !loadingRoles && (
                            <div className="mt-1 text-muted-foreground text-xs">All roles have been added</div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)} variant="outline">Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}