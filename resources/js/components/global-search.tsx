import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import { dashboard } from '@/routes';
import profile from '@/routes/profile';
import { router } from '@inertiajs/react';
import {
    CreditCard,
    Key,
    LayoutDashboard,
    Settings,
    User,
} from 'lucide-react';
import * as React from 'react';

const commands = [
    {
        title: 'Dashboard',
        href: dashboard().url,
        icon: LayoutDashboard,
    },
    {
        title: 'Profile',
        href: profile.edit(),
        icon: User,
    },
    {
        title: 'Password',
        href: '/settings/password',
        icon: Key,
    },
    {
        title: 'Appearance',
        href: '/settings/appearance',
        icon: Settings,
    },
];

export function GlobalSearch() {
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false);
        command();
    }, []);

    return (
        <>
            <p className="text-sm text-muted-foreground">
                Press{' '}
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </p>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                        <CommandItem
                            onSelect={() => runCommand(() => router.visit('/dashboard'))}
                        >
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={() => runCommand(() => router.visit('/settings/profile'))}
                        >
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={() => runCommand(() => router.visit('/settings/password'))}
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Password</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Settings">
                        <CommandItem
                            onSelect={() => runCommand(() => router.visit('/settings/profile'))}
                        >
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={() => runCommand(() => router.visit('/settings/password'))}
                        >
                            <Key className="mr-2 h-4 w-4" />
                            <span>Password</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={() => runCommand(() => router.visit('/settings/password'))}
                        >
                            <Key className="mr-2 h-4 w-4" />
                            <span>Password</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={() => runCommand(() => router.visit('/settings/appearance'))}
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Appereance</span>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}
