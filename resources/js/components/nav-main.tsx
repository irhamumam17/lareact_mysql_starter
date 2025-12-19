import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { resolveUrl } from "@/lib/utils";
import { type NavItem } from "@/types";
import { Link, usePage } from "@inertiajs/react";

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const current = page.url;

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>

            <SidebarMenu>
                {items.map((item) => {
                    const hasChildren = item.items && item.items.length > 0;

                    if (hasChildren) {
                        // OPEN collapse automatically if one child route is active
                        const isOpen = item.items?.some((child) =>
                            current.startsWith(resolveUrl(child.href!))
                        );

                        return (
                            <Collapsible key={item.title} defaultOpen={isOpen}>
                                {/* Trigger / Group Header */}
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton tooltip={{ children: item.title }}>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>

                                {/* Child Menus */}
                                <CollapsibleContent>
                                    {item.items?.map((child) => {
                                        const active = current.startsWith(resolveUrl(child.href!));

                                        return (
                                            <SidebarMenuItem key={child.title} className="ml-4">
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={active}
                                                    tooltip={{ children: child.title }}
                                                >
                                                    <Link href={child.href!} prefetch>
                                                        {child.icon && <child.icon />}
                                                        <span>{child.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        );
                                    })}
                                </CollapsibleContent>
                            </Collapsible>
                        );
                    }

                    // Single (normal) menu
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={current.startsWith(resolveUrl(item.href!))}
                                tooltip={{ children: item.title }}
                            >
                                <Link href={item.href!} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
