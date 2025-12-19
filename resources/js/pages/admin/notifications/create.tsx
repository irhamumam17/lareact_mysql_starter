import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import notifications from '@/routes/notifications';
import { Textarea } from '@/components/ui/textarea';
import { useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

type UserOption = { id: number; name: string; email: string };

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Send Notification', href: notifications.create().url },
];

export default function AdminNotificationCreate({ users }: { users: UserOption[] }) {

  type NotificationFormType = {
    target: 'all' | 'users' | 'user';
    user_id?: number | null;
    user_ids: number[];
    title: string;
    body: string;
    action_url?: string | null;
  };
  const { data, setData, post, processing, errors } = useForm<NotificationFormType>({
    target: 'all',
    user_ids: [],
    title: '',
    body: '',
    action_url: '',
  });

  useEffect(() => {
    if (data.target === 'all') {
      setData('user_ids', []);
    }
  }, [data.target]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    post(notifications.store.url());
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Send Notification" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <h1 className="text-lg font-semibold">Send Notification</h1>

        <form onSubmit={submit} className="flex w-full flex-col gap-4">
          <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-start sm:gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Target</span>
              <Select name="target" defaultValue="all" value={data.target} onValueChange={(value) => setData('target', value as 'all' | 'users')}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All users</SelectItem>
                  <SelectItem value="users">Specific users</SelectItem>
                </SelectContent>
              </Select>
              {errors.target && (
                <p className="text-destructive text-sm">{errors.target}</p>
              )}
            </div>

            {data.target === 'users' && (
              <div className="flex-1">
                <div className="mb-2 text-sm text-muted-foreground">Choose users</div>
                <div className="grid max-h-56 grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
                  {users.map((u) => {
                    const checked = data.user_ids.includes(u.id);
                    return (
                      <label key={u.id} className="flex items-center gap-2 rounded-md border p-2">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(val) => {
                            const isChecked = Boolean(val);
                            setData('user_ids', isChecked ? [...data.user_ids, u.id] : data.user_ids.filter((id) => id !== u.id));
                          }}
                        />
                        <span className="text-sm">{u.name} <span className="text-muted-foreground">({u.email})</span></span>
                      </label>
                    );
                  })}
                </div>
                {errors.user_ids && (
                  <p className="mt-1 text-destructive text-sm">{errors.user_ids}</p>
                )}
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <label className="text-sm">Title</label>
            <Input name="title" placeholder="Title" required value={data.title ?? ''} onChange={(e) => setData('title', e.target.value)} />
            {errors.title && (
              <p className="text-destructive text-sm">{errors.title}</p>
            )}
          </div>

          <div className="grid gap-2">
            <label className="text-sm">Message</label>
            <Textarea name="body" placeholder="Message..." required value={data.body ?? ''} onChange={(e) => setData('body', e.target.value)} />
            {errors.body && (
              <p className="text-destructive text-sm">{errors.body}</p>
            )}
          </div>

          <div className="grid gap-2">
            <label className="text-sm">Action URL (optional)</label>
            <Input name="action_url" placeholder="/users or https://..." value={data.action_url ?? ''} onChange={(e) => setData('action_url', e.target.value)} />
            {errors.action_url && (
              <p className="text-destructive text-sm">{errors.action_url}</p>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={processing}>Send</Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}


