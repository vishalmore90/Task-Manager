import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-800 bg-zinc-950 py-8 text-xs text-zinc-400">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <p className="text-zinc-400">
          © {new Date().getFullYear()} Task Manager. All rights reserved.
        </p>

        <div className="flex items-center gap-6">
          <Link
            to="/privacy"
            className="transition hover:text-white"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms"
            className="transition hover:text-white"
          >
            Terms & Conditions
          </Link>
        </div>
      </div>
    </footer>
  );
}
