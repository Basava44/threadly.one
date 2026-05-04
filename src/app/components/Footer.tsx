import Link from "next/link";
import Image from "next/image";
import logo from "@/app/assets/logo.png";

const helpLinks = [
  { label: "Shipping & Orders", href: "/terms" },
  { label: "FAQs", href: "/#faq" },
  { label: "Contact Us", href: "#" },
];

const companyLinks = [
  { label: "Our Story", href: "/about" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-cream pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image src={logo} alt="threadly.one" width={120} height={48} className="h-10 w-auto brightness-0 invert" />
            </Link>
            <p className="text-xs text-cream/50 leading-relaxed mb-4 max-w-[220px]">
              Custom embroidered accessories made just for you. Tiny details. Big vibe.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {/* Instagram */}
              <a href="#" aria-label="Instagram" className="text-cream/40 hover:text-cream transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              {/* Twitter/X */}
              <a href="#" aria-label="Twitter" className="text-cream/40 hover:text-cream transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* Pinterest */}
              <a href="#" aria-label="Pinterest" className="text-cream/40 hover:text-cream transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" x2="12" y1="17" y2="22" />
                  <path d="M5.159 15.804A8 8 0 0 1 12 4c4.418 0 8 3.582 8 8a8 8 0 0 1-11.841 7.013" />
                  <path d="m8 22 2.167-6.5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-[10px] tracking-[0.25em] uppercase font-medium mb-4">
              Help
            </h4>
            <ul className="flex flex-col gap-2.5">
              {helpLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs text-cream/50 hover:text-cream transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[10px] tracking-[0.25em] uppercase font-medium mb-4">
              Company
            </h4>
            <ul className="flex flex-col gap-2.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs text-cream/50 hover:text-cream transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-cream/10 pt-6 text-center">
          <p className="text-[10px] text-cream/30 tracking-[0.1em]">
            &copy; 2026 threadly.one. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
