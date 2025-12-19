# Real-Time Notification Counter

Implementasi real-time notification counter yang otomatis bertambah ketika ada notifikasi baru menggunakan Laravel Echo dan React Context.

## ✨ Fitur yang Diimplementasikan

### 1. **Real-Time Counter Update** ⚡
- Angka notifikasi di bell icon otomatis bertambah ketika notifikasi baru masuk
- Tidak perlu refresh halaman
- Update langsung via WebSocket (Laravel Echo + Pusher)

### 2. **Notification List Update** 📋
- List notifikasi terbaru otomatis update
- Notifikasi baru muncul di paling atas
- Maximum 10 notifikasi terbaru ditampilkan

### 3. **Toast Notification** 🔔
- Toast popup muncul ketika ada notifikasi baru
- Ada tombol "View" untuk langsung ke halaman terkait
- Auto dismiss setelah 5 detik

## 🏗️ Arsitektur

### React Context API
File: `resources/js/contexts/notification-context.tsx`

**State Management:**
- `unreadCount` - Jumlah notifikasi belum dibaca
- `latestNotifications` - Array 10 notifikasi terbaru

**Actions:**
- `incrementUnreadCount()` - Tambah counter +1
- `decrementUnreadCount()` - Kurangi counter -1
- `setUnreadCount(count)` - Set counter langsung
- `addNotification(notif)` - Tambah notifikasi baru ke list
- `setNotifications(notifs)` - Set semua notifikasi

### Provider Hierarchy
```
AppLayout (root)
  └─ NotificationProvider (context)
      ├─ AppLayoutContent
      │   ├─ Echo Listener (increment counter on new notification)
      │   └─ Toast Handler
      └─ AppSidebarHeader (consume context untuk counter)
```

## 📂 Files Modified/Created

### Created:
- ✅ `resources/js/contexts/notification-context.tsx` - Context untuk state management

### Modified:
- ✅ `resources/js/layouts/app-layout.tsx` - Wrap dengan NotificationProvider & handle Echo events
- ✅ `resources/js/components/app-sidebar-header.tsx` - Consume context untuk dynamic counter

## 🔄 How It Works

### 1. Initialization
```tsx
// Di AppLayout
<NotificationProvider 
    initialUnreadCount={notifications.unread_count}  // dari server
    initialNotifications={notifications.latest}      // dari server
>
```

### 2. Listen for New Notifications
```tsx
// Di AppLayoutContent
const { channel } = useEchoModel('App.Models.User', userId);

userChannel.notification((notification) => {
    incrementUnreadCount();        // +1 counter
    addNotification(notification); // add to list
    toast.info(...);               // show toast
});
```

### 3. Display Counter
```tsx
// Di AppSidebarHeader
const { unreadCount, latestNotifications } = useNotifications();

<Bell />
{unreadCount > 0 && (
    <span>{unreadCount > 9 ? '9+' : unreadCount}</span>
)}
```

## 🎯 Usage Example

### Send Notification from Backend

```php
use App\Notifications\CustomNotification;

$user->notify(new CustomNotification([
    'title' => 'New Message',
    'body' => 'You have a new message from Admin',
    'action_url' => '/messages/123',
]));
```

### Notification akan otomatis:
1. ✅ Broadcast via WebSocket
2. ✅ Counter bertambah di UI
3. ✅ Muncul di notification list
4. ✅ Show toast popup

## 🔧 Configuration

### Laravel Echo Configuration
File: `resources/js/bootstrap.ts`

```typescript
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;
window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true
});
```

### Environment Variables
```env
BROADCAST_DRIVER=pusher

PUSHER_APP_ID=your_app_id
PUSHER_APP_KEY=your_key
PUSHER_APP_SECRET=your_secret
PUSHER_APP_CLUSTER=your_cluster

VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"
```

## 🧪 Testing

### Test Real-Time Notification

**Option 1: Via Tinker**
```bash
php artisan tinker

# Get user
$user = User::find(1);

# Send notification
$user->notify(new \App\Notifications\TestNotification([
    'title' => 'Test Notification',
    'body' => 'This is a test',
    'action_url' => '/dashboard'
]));
```

**Option 2: Via Controller**
```php
Route::get('/test-notification', function() {
    auth()->user()->notify(new TestNotification([
        'title' => 'Test',
        'body' => 'Testing real-time notification',
    ]));
    
    return response()->json(['status' => 'sent']);
});
```

**Expected Behavior:**
1. ✅ Bell icon counter increase +1
2. ✅ New notification appear in dropdown
3. ✅ Toast popup shows
4. ✅ No page refresh needed

## 📊 Performance Considerations

### 1. **Notification Limit**
- Only show latest 10 notifications in dropdown
- Prevents large payload and slow rendering

### 2. **Context Optimization**
- Using `useCallback` for stable function references
- Prevents unnecessary re-renders

### 3. **WebSocket Connection**
- Single connection per user
- Automatic reconnection on disconnect
- Cleanup on component unmount

## 🐛 Troubleshooting

### Counter Not Updating?

**Check:**
1. ✅ Laravel Echo properly configured
2. ✅ WebSocket connection active (check browser console)
3. ✅ Notification implements `ShouldBroadcast`
4. ✅ Queue worker running: `php artisan queue:work`

**Debug:**
```javascript
// Browser Console
window.Echo.connector.pusher.connection.state
// Should be: "connected"
```

### Notification Not Showing?

**Check:**
1. ✅ User authenticated
2. ✅ Notification broadcast to correct channel
3. ✅ Channel name format: `App.Models.User.{userId}`

**Verify in Pusher Dashboard:**
- Check if events are being sent
- Check channel subscriptions

## 🎨 UI Customization

### Change Counter Badge Style
File: `resources/js/components/app-sidebar-header.tsx`

```tsx
<span className="absolute -right-1 -top-1 inline-flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
    {unreadCount > 9 ? '9+' : unreadCount}
</span>
```

### Change Toast Position/Duration
File: `resources/js/layouts/app-layout.tsx`

```tsx
toast.info(notification.title, {
    description: notification.body,
    duration: 5000,           // 5 seconds
    position: 'top-center',   // position
});
```

## 🚀 Future Enhancements

Potential improvements:
- [ ] Mark as read directly from dropdown
- [ ] Delete notification from list
- [ ] Filter by notification type
- [ ] Sound notification
- [ ] Browser push notifications
- [ ] Notification preferences/settings
- [ ] Group notifications by type

## 📚 Related Documentation

- [Laravel Broadcasting](https://laravel.com/docs/broadcasting)
- [Laravel Echo](https://github.com/laravel/echo)
- [React Context API](https://react.dev/reference/react/useContext)
- [Pusher Channels](https://pusher.com/docs/channels)

---

**Fitur Real-Time Notification Counter sudah siap digunakan!** 🎉

