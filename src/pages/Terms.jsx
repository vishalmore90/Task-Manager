import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

export default function Terms() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-8 sm:p-12">
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Terms & Conditions
            </h1>
            <p className="mt-0.5 text-xs text-zinc-400">
              Last Updated: October 2026
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-zinc-300">
          <div>
            <h2 className="font-display text-base font-bold text-white">
              1. Acceptance of Terms
            </h2>
            <p className="mt-2 text-zinc-300">
              By accessing and using Task Manager, you agree to comply with and be bound by these terms. If you do not agree, you should discontinue use immediately.
            </p>
          </div>

          <div>
            <h2 className="font-display text-base font-bold text-white">
              2. Permitted Use
            </h2>
            <p className="mt-2 text-zinc-300">
              You agree to use this platform only for lawful productivity and milestone tracking purposes. You may not attempt to reverse engineer, disrupt system operations, or bypass access controls.
            </p>
          </div>

          <div>
            <h2 className="font-display text-base font-bold text-white">
              3. Disclaimer of Warranties
            </h2>
            <p className="mt-2 text-zinc-300">
              Task Manager is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind. Maintainers do not guarantee uninterrupted availability or zero data loss resulting from browser storage clear events.
            </p>
          </div>

          <div>
            <h2 className="font-display text-base font-bold text-white">
              4. Limitation of Liability
            </h2>
            <p className="mt-2 text-zinc-300">
              Under no circumstances shall the application creators or maintainers be liable for any direct, indirect, incidental, or consequential damages arising from the use or inability to use this platform.
            </p>
          </div>

          <div>
            <h2 className="font-display text-base font-bold text-white">
              5. Governing Law
            </h2>
            <p className="mt-2 text-zinc-300">
              These terms are governed by standard open-source conventions and applicable jurisdictional legal frameworks without regard to conflict of law principles.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
