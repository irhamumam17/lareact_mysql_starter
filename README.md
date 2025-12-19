# Laravel React Starter Kit

<div align="center">

![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Inertia.js](https://img.shields.io/badge/Inertia.js-2.0-9553E9?style=for-the-badge&logo=inertia&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)

**A modern, feature-rich Laravel 12 + React 19 starter kit with comprehensive admin features, real-time notifications, and enterprise-grade security.**

[Features](#-features) • [Quick Start](#-quick-start) • [Installation](#-installation-guide) • [Documentation](#-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Requirements](#-requirements)
- [Quick Start](#-quick-start)
- [Installation Guide](#-installation-guide)
- [Configuration](#-configuration)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [Available Commands](#-available-commands)
- [Project Structure](#-project-structure)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

A production-ready Laravel React starter kit that combines the power of Laravel 12's backend capabilities with React 19's modern frontend features. Built with Inertia.js for seamless SPA experience, TypeScript for type safety, and includes comprehensive admin features out of the box.

### 🎯 Perfect For:
- Building modern web applications
- Admin dashboards & CMS
- SaaS applications
- Enterprise applications
- Rapid prototyping with production-ready features

---

## ✨ Features

### 🔐 Authentication & Authorization
- **Laravel Fortify** - Complete authentication system
- **Two-Factor Authentication (2FA)** - OTP-based 2FA with QR codes
- **Role & Permission Management** - Powered by Spatie Laravel Permission
- **Session Management** - View and revoke active sessions
- **Email Verification** - Built-in email verification

### 📊 Admin Dashboard
- **Real-time Statistics**
  - Total users & active sessions
  - Failed login attempts with charts
  - Most accessed pages analytics
  - Server resource monitoring (CPU, Memory, Disk)
  - Blocked IPs statistics
  - Email delivery rate tracking
- **Beautiful UI** - Modern, responsive design
- **Interactive Charts** - Visual data representation

### 🔔 Notification System
- **Real-time Notifications** - WebSocket-powered via Laravel Echo
- **Live Counter Updates** - Auto-increment notification badge
- **Broadcast Notifications** - Push notifications to users
- **Toast Notifications** - Non-intrusive user alerts
- **Admin Manual Notifications** - Send notifications to specific users

### 🛡️ Security Features
- **Advanced Rate Limiting** - IP-based with auto-blocking
- **Security Headers** - CSP, HSTS, X-Frame-Options, etc.
- **Blocked IPs/MACs Management** - Manual & auto-blocking system
- **Activity Logging** - Track all user activities
- **Login Attempt Tracking** - Monitor failed login attempts
- **Page Access Tracking** - Monitor page views and response times

### 📧 Email System
- **Mail Logging** - Track all sent emails
- **Custom Email Templates** - Blade-based templates
- **Queue Support** - Asynchronous email sending
- **Mail Testing** - Preview emails before sending

### 🏥 Health Check System
- **System Health Monitoring** - Powered by Spatie Laravel Health
- **Database Health** - Connection, size, and count monitoring
- **Redis Health** - Connection and memory usage
- **Cache Health** - Cache system status
- **Queue Health** - Queue worker status
- **Disk Space Monitoring** - Storage usage tracking
- **Visual Dashboard** - Beautiful health check UI

### 📍 Location Management
- **Countries, Provinces, Regencies, Districts, Villages**
- **Complete Indonesia location data**
- **CRUD operations for all location types**

### 🎨 UI/UX Features
- **Modern Design** - Built with shadcn/ui components
- **Dark/Light Mode** - Theme switching with next-themes
- **Responsive Layout** - Mobile-first design
- **Data Tables** - Powered by TanStack Table
- **Form Validation** - Client & server-side validation
- **Loading States** - Skeleton loaders & spinners

### 🔧 Developer Experience
- **TypeScript** - Full type safety
- **Laravel Wayfinder** - Type-safe route helpers
- **ESLint & Prettier** - Code formatting & linting
- **Hot Module Replacement** - Fast development with Vite
- **API Documentation** - Clear inline documentation

---

## 🛠️ Tech Stack

### Backend
- **Laravel 12** - PHP framework
- **PHP 8.2+** - Modern PHP features
- **Inertia.js 2.0** - SPA without API
- **Laravel Fortify** - Authentication
- **Spatie Packages**:
  - Laravel Permission - Roles & permissions
  - Laravel Activity Log - Activity tracking
  - Laravel Health - System health monitoring
- **Redis** - Cache & queue driver
- **PostgreSQL/MySQL/SQLite** - Database options

### Frontend
- **React 19** - UI library
- **TypeScript 5.7** - Type safety
- **Inertia.js React** - Server-side routing
- **Vite 7** - Build tool
- **Tailwind CSS 4** - Utility-first CSS
- **shadcn/ui** - Component library
- **Radix UI** - Unstyled UI primitives
- **TanStack Table** - Data tables
- **Laravel Echo** - WebSocket client
- **Laravel Reverb** - Real-time broadcasting
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

### Development Tools
- **Pest** - Testing framework
- **Laravel Pint** - Code style fixer
- **ESLint** - JavaScript linter
- **Prettier** - Code formatter
- **Concurrently** - Run multiple commands

---

## 📦 Requirements

Before you begin, ensure you have the following installed:

### Required
- **PHP** >= 8.2
- **Composer** >= 2.5
- **Node.js** >= 20.x
- **npm** >= 10.x (or **yarn** / **pnpm**)
- **Database**: PostgreSQL 13+, MySQL 8+, or SQLite 3

### Optional (Recommended)
- **Redis** >= 6.x (for cache & queues)
- **Git** >= 2.x

### Check Versions
```bash
php -v
composer -v
node -v
npm -v
```

---

## 🚀 Quick Start

For experienced developers who want to get started quickly:

```bash
# Clone the repository
git clone https://github.com/irhamumam17/laravel_react_starter
cd laravel_react_starter

# Install dependencies & setup
composer setup

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
php artisan migrate --seed

# Start development servers
composer dev
```

Visit `http://localhost:8000` 🎉

---

## 📖 Installation Guide

### Step 1: Clone the Repository

```bash
# Clone via HTTPS
git clone https://github.com/irhamumam17/laravel_react_starter.git

# OR clone via SSH
git clone git@github.com:irhamumam17/laravel_react_starter.git

# Navigate to project directory
cd laravel_react_starter
```

### Step 2: Install PHP Dependencies

```bash
composer install
```

This will install all Laravel packages including:
- Laravel Framework
- Inertia.js
- Spatie packages
- Laravel Fortify
- And all other backend dependencies

### Step 3: Install Node Dependencies

```bash
npm install

# OR if you prefer yarn
yarn install

# OR if you prefer pnpm
pnpm install
```

This installs:
- React & React DOM
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- All frontend dependencies

### Step 4: Environment Configuration

```bash
# Copy example environment file
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
# Application
APP_NAME="Laravel React Starter"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database (PostgreSQL example)
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password

# OR SQLite (for quick testing)
# DB_CONNECTION=sqlite
# DB_DATABASE=/absolute/path/to/database.sqlite

# Redis (optional but recommended)
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Mail Configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"

# Broadcasting (for real-time features)
BROADCAST_DRIVER=pusher

# Pusher Configuration (for WebSocket)
PUSHER_APP_ID=your_app_id
PUSHER_APP_KEY=your_key
PUSHER_APP_SECRET=your_secret
PUSHER_APP_CLUSTER=your_cluster

VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"

# Queue (recommended: redis for production, database for development)
QUEUE_CONNECTION=database

# Session
SESSION_DRIVER=database
SESSION_LIFETIME=120

# Cache
CACHE_DRIVER=redis  # or 'file' if Redis not available
```

### Step 5: Generate Application Key

```bash
php artisan key:generate
```

This generates a secure application key for encryption.

### Step 6: Create Storage Link

```bash
php artisan storage:link
```

Creates symbolic link from `public/storage` to `storage/app/public`.

---

## 🗄️ Database Setup

### Option 1: SQLite (Quickest - for testing)

```bash
# Create database file
touch database/database.sqlite

# Set in .env
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database.sqlite

# Run migrations
php artisan migrate --seed
```

### Option 2: PostgreSQL (Recommended for production)

```bash
# Create database (using psql)
psql -U postgres
CREATE DATABASE your_database_name;
\q

# Set in .env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Run migrations
php artisan migrate --seed
```

### Option 3: MySQL

```bash
# Create database (using mysql client)
mysql -u root -p
CREATE DATABASE your_database_name CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;

# Set in .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Run migrations
php artisan migrate --seed
```

### Seed Data

The `--seed` flag will create:
- Default admin user
- Sample roles and permissions
- Test data (optional)

Default admin credentials:
```
Email: admin@admin.com
Password: password
```

**⚠️ Important:** Change the default password after first login!

---

## 🏃 Running the Application

### Development Mode (Recommended)

Run all development servers simultaneously:

```bash
composer dev
```

This will start:
- **Laravel Server** (`http://localhost:8000`)
- **Queue Worker** (for background jobs)
- **Vite Dev Server** (for HMR)

### Manual Start (Alternative)

Start servers individually:

```bash
# Terminal 1: Laravel Server
php artisan serve

# Terminal 2: Queue Worker
php artisan queue:work

# Terminal 3: Vite Dev Server
npm run dev
```

### Building for Production

```bash
# Build frontend assets
npm run build

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start with production server (e.g., nginx + php-fpm)
```

---

## 🎮 Available Commands

### Composer Scripts

```bash
# Setup project (install + migrate + build)
composer setup

# Start development servers
composer dev

# Run tests
composer test
```

### Artisan Commands

```bash
# Database
php artisan migrate                 # Run migrations
php artisan migrate:fresh --seed    # Fresh database with seed
php artisan db:seed                 # Run seeders

# Cache
php artisan cache:clear             # Clear application cache
php artisan config:clear            # Clear config cache
php artisan route:clear             # Clear route cache
php artisan view:clear              # Clear view cache

# Queue
php artisan queue:work              # Start queue worker
php artisan queue:listen            # Start queue with auto-reload
php artisan queue:failed            # List failed jobs
php artisan queue:retry all         # Retry all failed jobs

# Health Check
php artisan health:check            # Run health checks

# Generate TypeScript routes
php artisan wayfinder:generate      # Generate route helpers

# Maintenance
php artisan down                    # Enable maintenance mode
php artisan up                      # Disable maintenance mode
```

### NPM Scripts

```bash
# Development
npm run dev                         # Start Vite dev server

# Production
npm run build                       # Build for production
npm run build:ssr                   # Build with SSR support

# Code Quality
npm run lint                        # Run ESLint
npm run format                      # Run Prettier
npm run format:check                # Check formatting
npm run types                       # Check TypeScript types
```

---

## 📁 Project Structure

```
.
├── app/
│   ├── Actions/                    # Fortify actions
│   ├── Console/                    # Artisan commands
│   ├── Events/                     # Event classes
│   ├── Http/
│   │   ├── Controllers/           # API & web controllers
│   │   ├── Middleware/            # Custom middleware
│   │   └── Requests/              # Form request validation
│   ├── Listeners/                 # Event listeners
│   ├── Models/                    # Eloquent models
│   ├── Notifications/             # Notification classes
│   ├── Observers/                 # Model observers
│   ├── Providers/                 # Service providers
│   └── Services/                  # Business logic services
│
├── resources/
│   ├── css/                       # Global styles
│   ├── js/
│   │   ├── actions/               # Wayfinder actions (auto-generated)
│   │   ├── components/            # React components
│   │   ├── contexts/              # React contexts
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── layouts/               # Page layouts
│   │   ├── lib/                   # Utility functions
│   │   ├── pages/                 # Inertia pages
│   │   ├── routes/                # Route helpers (auto-generated)
│   │   ├── types/                 # TypeScript types
│   │   └── app.tsx                # React entry point
│   └── views/                     # Blade templates
│
├── routes/
│   ├── channels.php               # Broadcast channels
│   ├── console.php                # Console commands
│   ├── settings.php               # Settings routes
│   └── web.php                    # Web routes
│
├── database/
│   ├── factories/                 # Model factories
│   ├── migrations/                # Database migrations
│   └── seeders/                   # Database seeders
│
├── tests/
│   ├── Feature/                   # Feature tests
│   └── Unit/                      # Unit tests
│
├── config/                        # Configuration files
├── public/                        # Public assets
├── storage/                       # Storage files
└── vendor/                        # PHP dependencies
```

---

## 🧪 Testing

### Run All Tests

```bash
composer test

# OR
php artisan test
```

### Run Specific Test

```bash
php artisan test --filter=ExampleTest
```

### Run with Coverage

```bash
php artisan test --coverage
```

### Frontend Testing

```bash
npm run types  # TypeScript type checking
npm run lint   # ESLint
```

---

## 🚢 Deployment

### Production Checklist

- [ ] Set `APP_ENV=production` in `.env`
- [ ] Set `APP_DEBUG=false` in `.env`
- [ ] Generate new `APP_KEY`
- [ ] Configure production database
- [ ] Set up Redis for cache & queues
- [ ] Configure mail settings
- [ ] Set up Pusher for WebSocket
- [ ] Build frontend assets: `npm run build`
- [ ] Cache configs: `php artisan config:cache`
- [ ] Cache routes: `php artisan route:cache`
- [ ] Run migrations: `php artisan migrate --force`
- [ ] Set up queue worker (Supervisor)
- [ ] Set up scheduler cron job
- [ ] Configure web server (Nginx/Apache)
- [ ] Set up SSL certificate
- [ ] Configure backup strategy

### Queue Worker (Supervisor)

Create `/etc/supervisor/conf.d/laravel-worker.conf`:

```ini
[program:laravel-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/your/app/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=8
redirect_stderr=true
stdout_logfile=/path/to/your/app/storage/logs/worker.log
stopwaitsecs=3600
```

### Scheduler Cron

Add to crontab:

```bash
* * * * * cd /path/to/your/app && php artisan schedule:run >> /dev/null 2>&1
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "Permission denied" errors

```bash
# Fix storage permissions
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

#### 2. NPM install fails

```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### 3. Vite build fails

```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run build
```

#### 4. Database connection fails

- Check database credentials in `.env`
- Ensure database server is running
- Test connection: `php artisan migrate:status`

#### 5. Queue jobs not processing

```bash
# Restart queue worker
php artisan queue:restart

# Check failed jobs
php artisan queue:failed

# Retry failed jobs
php artisan queue:retry all
```

#### 6. WebSocket/Pusher not working

- Verify Reverb credentials in `.env`
- Check browser console for errors
- Ensure `BROADCAST_DRIVER=reverb`
- Test with: `php artisan test:broadcast`

#### 7. HSTS causing HTTPS redirect in development

Clear HSTS settings in browser:
- **Chrome**: `chrome://net-internals/#hsts` → Delete domain
- **Firefox**: Clear history & cookies for localhost
- **Solution**: Disable HSTS in development (already configured)

### Get Help

- Check [Laravel Documentation](https://laravel.com/docs)
- Check [Inertia.js Documentation](https://inertiajs.com)
- Check [React Documentation](https://react.dev)
- Open an issue on GitHub

---

## 📚 Documentation

Additional documentation files:

- [Dashboard Features](./DASHBOARD_README.md) - Admin dashboard documentation
- [Health Check System](./HEALTH_CHECK_README.md) - Health monitoring guide
- [Real-time Notifications](./NOTIFICATION_REALTIME_README.md) - Notification system
- [Rate Limiting](./RATE_LIMIT_FEATURE.md) - Rate limiting configuration
- [Security Features](./SECURITY_SETUP.md) - Security setup guide
- [Security Headers](./SECURITY_HEADERS.md) - Security headers configuration

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Run tests**
   ```bash
   composer test
   npm run types
   npm run lint
   ```
5. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**

### Code Style

- **PHP**: Follow PSR-12 standard (enforced by Laravel Pint)
- **JavaScript/TypeScript**: Follow project ESLint config
- **React**: Use functional components with hooks
- **Commits**: Follow [Conventional Commits](https://www.conventionalcommits.org/)

### Before Submitting PR

- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] New features have tests
- [ ] Documentation is updated
- [ ] No linter errors

---

## 📄 License

This project is open-sourced software licensed under the [MIT license](LICENSE).

---

## 🙏 Credits

Built with these amazing open-source projects:

- [Laravel](https://laravel.com) - Backend framework
- [React](https://react.dev) - UI library
- [Inertia.js](https://inertiajs.com) - Modern monolith
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com) - Component library
- [Spatie Packages](https://spatie.be/open-source) - Laravel packages
- [Laravel Fortify](https://github.com/laravel/fortify) - Authentication
- [Vite](https://vitejs.dev) - Build tool
- [TypeScript](https://www.typescriptlang.org) - Type safety

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/irhamumam17/laravel_react_starter/issues)
- **Discussions**: [GitHub Discussions](https://github.com/irhamumam17/laravel_react_starter/discussions)
- **Email**: irham.umam36@gmail.com

---

<div align="center">

**Made with ❤️ by Muhammad Irhamul Umam**

[⬆ Back to Top](#laravel-react-starter-kit)

</div>

