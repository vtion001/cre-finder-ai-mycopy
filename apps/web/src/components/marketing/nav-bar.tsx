"use client";

import { createClient } from "@v1/supabase/client";
import type { Tables } from "@v1/supabase/types";
import { Button } from "@v1/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const NavBar = ({ user }: { user?: Tables<"users"> | null }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const signOut = async () => {
    setIsSigningOut(true);

    await supabase.auth.signOut({
      scope: "local",
    });

    router.push("/");
    setIsSigningOut(false);
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-[#0072FF]">
                CRE Finder AI
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <a
              href="#features"
              className="text-gray-600 hover:text-[#0072FF] transition-colors font-medium"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-gray-600 hover:text-[#0072FF] transition-colors font-medium"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="text-gray-600 hover:text-[#0072FF] transition-colors font-medium"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="text-gray-600 hover:text-[#0072FF] transition-colors font-medium"
            >
              Testimonials
            </a>

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-[#0072FF] transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <Button
                  onClick={signOut}
                  variant="outline"
                  className="ml-4"
                  disabled={isSigningOut}
                >
                  {isSigningOut ? "Signing Out..." : "Sign Out"}
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth">
                  <Button
                    variant="outline"
                    className="text-gray-600 border-gray-300 hover:text-[#0072FF] hover:border-[#0072FF]"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button className="bg-[#0072FF] hover:bg-[#0060CC] text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-[#0072FF] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#0072FF]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {!mobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="#features"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#0072FF] hover:bg-gray-50"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#0072FF] hover:bg-gray-50"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#0072FF] hover:bg-gray-50"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#0072FF] hover:bg-gray-50"
            >
              Testimonials
            </a>

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#0072FF] hover:bg-gray-50"
                >
                  Dashboard
                </Link>
                <div className="pt-2">
                  <Button
                    onClick={signOut}
                    variant="outline"
                    className="w-full"
                    disabled={isSigningOut}
                  >
                    {isSigningOut ? "Signing Out..." : "Sign Out"}
                  </Button>
                </div>
              </>
            ) : (
              <div className="pt-2">
                <Link href="/auth">
                  <Button className="w-full bg-[#0072FF] hover:bg-[#0060CC] text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
