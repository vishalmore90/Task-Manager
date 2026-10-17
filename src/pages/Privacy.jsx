import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export default function Privacy() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-4 sm:mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 sm:p-12">
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-5 sm:pb-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold tracking-tight text-white sm:text-3xl">
              Privacy Policy
            </h1>
            <p className="mt-0.5 text-xs text-zinc-400">
              Last Updated: October 2026
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-6 text-xs leading-relaxed text-zinc-300 sm:mt-8 sm:space-y-8 sm:text-sm">
          <div>
            <h2 className="font-display text-sm font-bold text-white sm:text-base">
              1. Information We Collect
            </h2>
            <p className="mt-2 text-zinc-300">
              Task Manager operates under a privacy-first model. All user account credentials, active sessions, and workspace tasks are processed client-side and saved strictly within your browser&apos;s local storage environment.
            </p>
          </div>

          <div>
            <h2 className="font-display text-sm font-bold text-white sm:text-base">
              2. Data Storage and Security
            </h2>
            <p className="mt-2 text-zinc-300">
              User passwords are cryptographically hashed using standard SHA-256 before client storage. We do not sell, rent, or transfer your personal data or task details to third-party tracking or advertising networks.
            </p>
          </div>

          <div>
            <h2 className="font-display text-sm font-bold text-white sm:text-base">
              3. Client-Side Cookies and Local Storage
            </h2>
            <p className="mt-2 text-zinc-300">
              We utilize browser storage keys solely to persist your authentication token, user preferences, and task registry between browser sessions. You may clear your browser data at any time to purge this information permanently.
            </p>
          </div>

          <div>
            <h2 className="font-display text-sm font-bold text-white sm:text-base">
              4. Data Retention and Deletion
            </h2>
            <p className="mt-2 text-zinc-300">
              You maintain full ownership of your data. Deleting tasks or logging out through your profile immediately purges or modifies the respective local session record.
            </p>
          </div>

          <div>
            <h2 className="font-display text-sm font-bold text-white sm:text-base">
              5. Contact Information
            </h2>
            <p className="mt-2 text-zinc-300">
              For security disclosures or privacy inquiries regarding this open-source application, contact the repository maintainers via GitHub.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
