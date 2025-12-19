"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import usersRoutes from "@/routes/users";
import { UserModel } from "@/types/user-model";
import { router } from "@inertiajs/react";
import { useState } from "react";

interface DeleteUserProps {
    user: UserModel;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function DeleteUser({ user, open, onOpenChange }: DeleteUserProps) {
    const [submitting, setSubmitting] = useState(false);

    function handleDelete() {
        if (submitting) return;
        setSubmitting(true);
        router.delete(usersRoutes.destroy.url(user.id), {
            preserveScroll: true,
            onFinish: () => setSubmitting(false),
            onSuccess: () => onOpenChange(false),
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete User</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. Are you sure you want to delete user <b>{user.name}</b> ({user.email})?
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


