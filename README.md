# Task Manager

> High-performance task management web application built with **React 18**, **Vite**, **Tailwind CSS**, **Context API**, and **React Router**.

---

## About

**Task Manager** is a productivity dashboard designed to organize, track, and streamline daily workflows with speed and clarity. Built with a focus on clean component architecture, scalable state management, and strict security compliance, this application demonstrates modern React patterns including:

- **Centralized State & Data Isolation**: Powered by React Context API (`AuthContext` and `TaskContext`) with user-partitioned task storage and automatic local synchronization.
- **Client-Side Routing & Route Guards**: Declarative routing with `react-router-dom` featuring protected routes that guard workspace views against unauthenticated access.
- **Cryptographic Security & Sanitization**: SHA-256 password hashing via Web Crypto API, client-side rate-limiting, and input sanitization against Cross-Site Scripting (XSS).
- **Strict Design System**: Cohesive two-color palette (Obsidian Charcoal and Precision Cobalt Blue), a single font pair (Plus Jakarta Sans and Inter), and unified button geometry.

---

## Features

### Authentication & Security Architecture
- **Web Crypto Password Hashing**: Passwords hashed using standard SHA-256 before client-side storage.
- **Brute-Force Rate Limiting**: Automatic lockout after 5 consecutive failed login attempts with a 30-second cooldown timer.
- **User Data Isolation**: Tasks are partitioned by user ID so team members only view and manage their assigned items.
- **Role-Based Permissions**: Role differentiation between Workspace Member and Workspace Admin.
- **Input Sanitization**: All form inputs are sanitized to strip script tags, dangerous HTML attributes, and event handlers.
- **Protected Routes**: Restricts `/tasks`, `/add-task`, `/edit-task/:id`, and `/profile` with redirect state preservation.

### Full Task CRUD Operations
- **Create**: Add new milestones with title, description, due date, status, and priority.
- **Read**: Live dashboard with dynamic counters displaying verified counts for Total, Pending, In Progress, and Completed.
- **Update**: Edit existing tasks with automated field pre-filling and instant state synchronization.
- **Delete**: Remove tasks with real-time UI updates.
- **Quick Status Toggle**: Cycle task status directly from card badges with a single click.

### Filter & Search System
- **Real-time Search**: Multi-field keyword filtering across task titles and descriptions.
- **Status Filter**: Filter tasks by All, Pending, In Progress, or Completed.
- **Priority Filter**: Filter tasks by All, High, Medium, or Low.
- **Deterministic Reset**: Re-hydrate initial sample tasks if the backlog is cleared.

### Production Security Headers
- Pre-configured HTTP security headers in `vercel.json` and `public/_headers`:
  - `Content-Security-Policy`
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`

---

## Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **[React 18](https://react.dev/)** | Frontend UI library |
| **[Vite 6](https://vitejs.dev/)** | Frontend tooling and production bundler |
| **[Tailwind CSS](https://tailwindcss.com/)** | Utility-first styling with custom typography and color tokens |
| **[React Router 6](https://reactrouter.com/)** | Client-side routing and route protection |
| **[React Hook Form](https://react-hook-form.com/)** | Form state management and client-side validation |
| **[Lucide React](https://lucide.dev/)** | Cohesive, accessible icon set |

---

## Project Structure

```text
Task-Manager/
├── public/
│   ├── favicon.svg           # Geometric SVG favicon
│   ├── _headers              # Netlify security headers
│   └── _redirects            # Netlify SPA redirect rules
├── src/
│   ├── components/
│   │   ├── Footer.jsx        # Site footer with legal links (zero AI branding)
│   │   ├── Navbar.jsx        # Navigation bar (5 links maximum, cohesive icons)
│   │   ├── ProtectedRoute.jsx# Route guard for private views
│   │   └── TaskCard.jsx      # Task display card with action controls
│   ├── context/
│   │   ├── AuthContext.jsx   # Auth state, rate limiting, and hashing
│   │   └── TaskContext.jsx   # Task state, CRUD, and user data isolation
│   ├── pages/
│   │   ├── AddTask.jsx       # Task form (Create / Edit Mode)
│   │   ├── AllTasks.jsx      # Task registry, counters, and filters
│   │   ├── Home.jsx          # Hero section and verified testimonial
│   │   ├── Login.jsx         # Authentication and registration
│   │   ├── Privacy.jsx       # Privacy Policy page
│   │   ├── Profile.jsx       # User profile and role permissions
│   │   └── Terms.jsx         # Terms and Conditions page
│   ├── utils/
│   │   ├── crypto.js         # Web Crypto API SHA-256 password hashing
│   │   └── sanitize.js       # HTML and XSS sanitization utilities
│   ├── App.jsx               # Application shell and route configuration
│   ├── index.css             # Tailwind base and unified button styles
│   └── main.jsx              # Application root mount with providers
├── eslint.config.js          # ESLint configuration
├── index.html                # HTML entry template with Google Fonts and favicon
├── package.json              # Project dependencies and build scripts
├── tailwind.config.js        # Theme tokens (2 brand colors, 1 font pair)
├── vercel.json               # Vercel SPA rewrites and security headers
└── vite.config.js            # Vite build configuration
```

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher)
- `npm` (bundled with Node.js)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/vishalmore90/Task-Manager.git
   cd Task-Manager
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview the production build**:
   ```bash
   npm run preview
   ```

---

## Deployment

### Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/new) and click **Add New Project**.
2. Import `vishalmore90/Task-Manager`.
3. Keep default settings (Build command: `npm run build`, Output directory: `dist`).
4. Click **Deploy**.

### Deploy to Netlify
1. Go to [Netlify Dashboard](https://app.netlify.com/start).
2. Select **Import an existing project from GitHub** and choose `Task-Manager`.
3. Set the Publish directory to `dist`.
4. Click **Deploy Task-Manager**.

### Custom Domain Mapping
To point a custom domain (e.g. `yourdomain.com`):
- **Apex domain**: Add an `A` record pointing to `76.76.21.21` (Vercel) or `75.2.60.5` (Netlify).
- **Subdomain (`www`)**: Add a `CNAME` record pointing to `cname.vercel-dns.com` or your Netlify subdomain target.

---

## License

This project is open source and available under the [MIT License](LICENSE).
