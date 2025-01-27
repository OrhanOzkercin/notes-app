import Link from "next/link";
import { Github } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "About", href: "/about" },
  ],
  resources: [
    { label: "Documentation", href: "/docs" },
    { label: "Blog", href: "/blog" },
    { label: "Support", href: "/support" },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 lg:px-6">
        <div className="grid gap-8 py-8 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="flex flex-col gap-4">
            <h3 className="font-cal text-lg font-semibold">Notes App</h3>
            <p className="text-sm text-muted-foreground">
              A collaborative rich-text note-taking platform with version history and real-time previews.
            </p>
            <div className="flex items-center gap-2">
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>

          {/* Links Sections */}
          <div className="grid gap-8 sm:grid-cols-3 lg:col-span-3">
            {/* Product Links */}
            <div>
              <h4 className="font-cal text-sm font-semibold">Product</h4>
              <ul className="mt-4 space-y-2">
                {footerLinks.product.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h4 className="font-cal text-sm font-semibold">Resources</h4>
              <ul className="mt-4 space-y-2">
                {footerLinks.resources.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="font-cal text-sm font-semibold">Legal</h4>
              <ul className="mt-4 space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t py-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Notes App. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with ❤️ for better note-taking
          </p>
        </div>
      </div>
    </footer>
  );
} 