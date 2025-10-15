import { Link } from "react-router-dom";
import { Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background/50">
      <div className="container grid gap-6 py-10 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-semibold">BuilderOne</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Build modern, responsive experiences fast with a clean, extensible foundation.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
          <div>
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-foreground">Home</Link></li>
              <li><Link to="/services" className="hover:text-foreground">Services</Link></li>
              <li><Link to="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">About</a></li>
              <li><a href="#" className="hover:text-foreground">Blog</a></li>
              <li><a href="#" className="hover:text-foreground">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Contact</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><a href="mailto:contact@builderone.app" className="hover:text-foreground">contact@builderone.app</a></li>
              <li className="flex items-center gap-3">
                <a aria-label="Twitter" href="#" className="hover:text-foreground"><Twitter className="size-4"/></a>
                <a aria-label="GitHub" href="#" className="hover:text-foreground"><Github className="size-4"/></a>
              </li>
            </ul>
          </div>
        </div>
        <div className="md:col-span-3">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} BuilderOne Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
