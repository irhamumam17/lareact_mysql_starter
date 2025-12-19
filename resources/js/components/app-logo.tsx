import { usePage } from '@inertiajs/react';
import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    const { appSettings } = usePage<{
        appSettings: { name: string; logo?: string };
    }>().props;

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                {appSettings.logo ? (
                    <img
                        src={`/storage/${appSettings.logo}`}
                        alt={appSettings.name}
                        className="size-8 rounded-md object-cover"
                    />
                ) : (
                    <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
                )}
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {appSettings.name}
                </span>
            </div>
        </>
    );
}
