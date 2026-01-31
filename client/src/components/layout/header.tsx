import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Academics", href: "/academics" },
    { label: "Admissions", href: "/admissions" },
    { label: "Events", href: "/events" },
    { label: "Blog", href: "/blog" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ];
  const externalNavItems = [
    { label: "E-Library", href: "https://tinyurl.com/DAV-E-Library", external: true }
  ];
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* First Row: Logo and Title */}
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img 
                className="h-12 w-12 square-full" 
                src="https://raw.githubusercontent.com/soumyadip-schl/assets-dav/b62f9c7c4d72068f93f42fdd99aef1cdbcbffbad/web-assets/DAV_CMC_Logo.svg.png" 
                alt="DAV Public School Logo"  
              />
            </div>
            <div className="ml-4">
              <Link href="/">
                <h1 className="text-lg font-bold text-dav-maroon cursor-pointer">DAV Public School</h1>
                <p className="text-sm text-dav-gray">Kanyapur, Asansol</p>
              </Link>
            </div>
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              className="text-gray-700 hover:text-dav-saffron p-2" 
              onClick={toggleMobileMenu}
              aria-label="Open menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Second Row: Desktop Menu & Thin Line for Mobile */}
        {/* This row is now FULLY maroon, edge to edge */}
        <div className="w-full bg-dav-maroon">
          <div
            className="hidden md:flex items-center w-full px-2"
            style={{
              height: "48px",
              overflowX: "auto",
              whiteSpace: "nowrap"
            }}
          >
            <div className="flex items-center w-full min-w-full whitespace-nowrap">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span className={cn(
                    "px-2 py-2 font-medium transition-colors cursor-pointer text-white",
                    "text-[0.98rem] lg:text-base",
                    "whitespace-nowrap",
                    location === item.href
                      ? "underline underline-offset-4"
                      : "hover:text-dav-saffron"
                  )}>
                    {item.label}
                  </span>
                </Link>
              ))}
              {externalNavItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-2 font-medium transition-colors cursor-pointer text-white hover:text-dav-saffron text-[0.98rem] lg:text-base whitespace-nowrap"
                >
                  {item.label}
                  <span className="ml-1 align-middle" aria-label="(opens in a new tab)">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="inline h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 5a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 11-2 0V7.414l-9.293 9.293a1 1 0 01-1.414-1.414L15.586 6H11a1 1 0 01-1-1z" />
                    </svg>
                  </span>
                </a>
              ))}
            </div>
          </div>
          {/* Thin maroon line for mobile remains as is */}
          <div className="md:hidden">
            <div
              className="w-full"
              style={{
                height: "3px",
                backgroundColor: "#861d1d"
              }}
            />
          </div>
        </div>
      </div>
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <span 
                  className={cn(
                    "block px-3 py-2 cursor-pointer rounded transition-colors",
                    location === item.href 
                      ? "text-dav-maroon font-medium bg-dav-light" 
                      : "text-gray-700 hover:text-dav-saffron"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </span>
              </Link>
            ))}
            {externalNavItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2 cursor-pointer rounded transition-colors text-dav-maroon hover:text-dav-saffron"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
                <span className="ml-1 align-middle" aria-label="(opens in a new tab)">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="inline h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 5a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 11-2 0V7.414l-9.293 9.293a1 1 0 01-1.414-1.414L15.586 6H11a1 1 0 01-1-1z" />
                  </svg>
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
          }
