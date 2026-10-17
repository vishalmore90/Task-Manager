# Task Manager

A high-performance, security-focused task management system engineered with **React 18**, **Vite**, **Tailwind CSS**, and **React Router**. Designed for instant state synchronization, user data isolation, and production reliability.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-task--manager--alpha--29.vercel.app-2563eb?style=flat-square&logo=vercel)](https://task-manager-alpha-29.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-18181b?style=flat-square&logo=github)](https://github.com/vishalmore90/Task-Manager)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0.5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## Live Deployment

- **Production URL**: [https://task-manager-alpha-29.vercel.app](https://task-manager-alpha-29.vercel.app)
- **Direct Workspace Route**: [https://task-manager-alpha-29.vercel.app/tasks](https://task-manager-alpha-29.vercel.app/tasks)
- **Source Code**: [https://github.com/vishalmore90/Task-Manager](https://github.com/vishalmore90/Task-Manager)

## About

**Task Manager** is a privacy-first, zero-latency workflow cockpit built for focused milestone execution. Engineered with React 18 and Vite, it delivers instant task management without database overhead, third-party trackers, or network delays.

- **Zero-Latency Execution**: Instant CRUD operations with deterministic local state synchronization.
- **Security-First Architecture**: Native Web Crypto SHA-256 password hashing, rate limiting, and XSS input sanitization.
- **User Data Isolation**: Workspace partitioning ensuring accounts only view and modify their assigned records.
- **Production Hardened**: Pre-configured SPA rewrites and enterprise HTTP security headers for Vercel and Netlify.

---

## System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                       Browser Runtime                       │
│                                                             │
│   ┌───────────────────┐             ┌───────────────────┐   │
│   │   AuthContext     │             │    TaskContext    │   │
│   │  - User Session   │             │  - Backlog State  │   │
│   │  - Rate Limiting  │             │  - CRUD Handlers  │   │
│   │  - SHA-256 Hash   │             │  - User Filtering │   │
│   └─────────┬─────────┘             └─────────┬─────────┘   │
│             │                                 │             │
│   ┌─────────▼─────────────────────────────────▼─────────┐   │
│   │              Protected Route Controller              │   │
│   │          - Unauthenticated Redirects (/login)        │   │
│   │          - Role-based Access (/tasks, /profile)      │   │
│   └─────────────────────────┬────────────────────────────┘   │
│                             │                               │
│   ┌─────────────────────────▼────────────────────────────┐   │
│   │                 Storage Persistence                  │   │
│   │         - localStorage (Encrypted & Partitioned)     │   │
│   └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Features

### Security & Access Control
- **Cryptographic Hashing**: Passwords are salted and hashed using standard SHA-256 via `window.crypto.subtle` prior to local persistence.
- **Brute-Force Rate Limiting**: Enforces a temporary 30-second lockout after 5 consecutive failed authentication attempts.
- **Data Partitioning**: Tasks are strictly bound to `userId`. Users only access and manipulate records they own.
- **Role Enforcement**: Differentiates between Workspace Member and Workspace Admin privileges.
- **XSS Sanitization**: Strips dangerous HTML tags, inline scripts, and script execution handlers from all form submissions.
- **Protected Navigation**: Prevents unauthenticated access to `/tasks`, `/add-task`, `/edit-task/:id`, and `/profile`.

### Task Lifecycle & Management
- **Milestone Creation**: Register tasks with validated title, description, target completion date, priority, and status.
- **State Registry**: Real-time counter metrics for Total Backlog, Pending, In Progress, and Completed milestones.
- **Dynamic Form Pre-Filling**: Instant parameter population when switching between creation and edit modes.
- **One-Click Cycle**: Advance task status directly from card indicators without opening forms.
- **Deterministic Record Removal**: Real-time record deletion with state re-indexing.

### Search & Multi-Condition Filtering
- **Keyword Search**: Instant multi-attribute search across title and description fields.
- **Status Filter**: Real-time filtering by All Statuses, Pending, In Progress, and Completed.
- **Priority Filter**: High, Medium, and Low priority isolation.
- **Backlog Reset**: Deterministic fallback recovery to re-populate standard starter milestones if cleared.

### Production Security Headers
Pre-configured for Vercel (`vercel.json`) and Netlify (`public/_headers`):
- `Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'none';`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`

---

## Tech Stack

| Layer | Technology | Selection Rationale |
| :--- | :--- | :--- |
| **Framework** | React 18.3.1 | Declarative component architecture and concurrent rendering primitives |
| **Tooling** | Vite 6.0.5 | Native ESM-based development server with sub-second hot reloading |
| **Styling** | Tailwind CSS 3.4.17 | Predictable utility classes matching design tokens without bundle weight |
| **Routing** | React Router 6.28.0 | Declarative client-side routing, route guards, and history preservation |
| **Forms** | React Hook Form 7.54.2 | Uncontrolled form inputs minimizing re-renders with validation schemas |
| **Icons** | Lucide React 0.468.0 | Consistent 24px stroke icon system with zero layout shift |

---

## Project Structure

```text
Task-Manager/
├── public/
│   ├── favicon.svg           # Geometric SVG favicon
│   ├── _headers              # Netlify security headers configuration
│   └── _redirects            # Netlify SPA redirect rules
├── src/
│   ├── components/
│   │   ├── Footer.jsx        # Site footer with legal links
│   │   ├── Navbar.jsx        # Header navigation (5 links max, Lucide icons)
│   │   ├── ProtectedRoute.jsx# Auth verification and route redirection
│   │   └── TaskCard.jsx      # Task milestone card with cycle controls
│   ├── context/
│   │   ├── AuthContext.jsx   # Session management, rate limiting, and hashing
│   │   └── TaskContext.jsx   # Task state store, CRUD logic, and data isolation
│   ├── pages/
│   │   ├── AddTask.jsx       # Unified milestone creation and edit form
│   │   ├── AllTasks.jsx      # Task backlog, counters, and filter controls
│   │   ├── Home.jsx          # Landing overview and feature summary
│   │   ├── Login.jsx         # Authentication and registration interface
│   │   ├── Privacy.jsx       # Privacy Policy page
│   │   ├── Profile.jsx       # User profile and role permissions
│   │   └── Terms.jsx         # Terms and Conditions page
│   ├── utils/
│   │   ├── crypto.js         # Web Crypto API SHA-256 implementation
│   │   └── sanitize.js       # XSS stripping and input sanitization
│   ├── App.jsx               # Application routing shell
│   ├── index.css             # Tailwind base styles and uniform button classes
│   └── main.jsx              # DOM root mount with context providers
├── eslint.config.js          # ESLint 9 configuration
├── index.html                # HTML entry template with fonts and favicon
├── package.json              # Project metadata, scripts, and dependencies
├── tailwind.config.js        # Design tokens (1 font pair, 2 brand colors)
├── vercel.json               # Vercel rewrites and HTTP security headers
└── vite.config.js            # Vite build configuration
```

---

## Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0.0 or higher)
- `npm` (version 9.0.0 or higher)

### Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/vishalmore90/Task-Manager.git
   cd Task-Manager
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Verify linting**:
   ```bash
   npm run lint
   ```

5. **Generate production build**:
   ```bash
   npm run build
   ```

6. **Preview production bundle locally**:
   ```bash
   npm run preview
   ```

---

## Production Deployment

### Vercel Deployment
The repository includes [`vercel.json`](file:///c:/Users/Vishal/Code_File/Project%20B/Task-Manager/vercel.json) with pre-configured rewrite routes and security headers:
1. Connect repository on [Vercel](https://vercel.com/new).
2. Root Directory: `./`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Click **Deploy**.

### Netlify Deployment
The repository includes [`public/_redirects`](file:///c:/Users/Vishal/Code_File/Project%20B/Task-Manager/public/_redirects) and [`public/_headers`](file:///c:/Users/Vishal/Code_File/Project%20B/Task-Manager/public/_headers):
1. Connect repository on [Netlify](https://app.netlify.com/start).
2. Publish Directory: `dist`
3. Click **Deploy Task-Manager**.

---

## License

This project is licensed under the [MIT License](LICENSE).
