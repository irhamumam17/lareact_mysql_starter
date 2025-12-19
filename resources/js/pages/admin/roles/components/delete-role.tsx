"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import rolesRoutes from "@/routes/roles";
import { RoleModel } from "@/types/role-model";
import { Link, router } from "@inertiajs/react";
import { useState } from "react";

interface DeleteRoleProps {
    role: RoleModel;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function DeleteRole({ role, open, onOpenChange }: DeleteRoleProps) {
    const [submitting, setSubmitting] = useState(false);

    function handleDelete() {
        if (submitting) return;
        setSubmitting(true);
        router.delete(rolesRoutes.destroy.url(role.id), {
            preserveScroll: true,
            onFinish: () => setSubmitting(false),
            onSuccess: () => onOpenChange(false),
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Role</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. Are you sure you want to delete role <b>{role.name}</b>?
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={submitting}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


