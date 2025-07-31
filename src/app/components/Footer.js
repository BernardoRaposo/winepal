export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 bg-[#611525] text-[#FAF4EB]">
      <div className="mx-auto max-w-md px-6 py-8 text-sm">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full flex items-center justify-center">
            {/* Taça estilizada simples */}
            <span className="text-lg leading-none">🍷</span>
          </div>
          <div>
            <p className="font-semibold leading-tight">WinePal</p>
            <p className=" leading-tight">Snap a dish · Find the perfect wine</p>
            <p className=" leading-tight">Built by Bernardo Raposo</p>
          </div>
        </div>

        {/* Links */}
        <nav
          className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 "
          aria-label="Footer"
        >
          <a href="/about" className="hover:underline">About</a>
          <a href="/privacy" className="hover:underline">Privacy</a>
          <a href="/terms" className="hover:underline">Terms</a>
          <a
            href="mailto:hello@usewinepal.shop"
            className="hover:underline"
          >
            Contact
          </a>
        </nav>

        {/* Bottom row */}
        <div className="mt-6 flex items-center justify-between">
          <p>© {year} WinePal</p>
          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com/"
              aria-label="Instagram"
              className=""
              target="_blank"
              rel="noreferrer"
            >
              IG
            </a>
            <a
              href="https://github.com/"
              aria-label="GitHub"
              className="hover:text-[#611525]"
              target="_blank"
              rel="noreferrer"
            >
              GH
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
