"use client";

import { Session } from "next-auth";
import Link from "next/link";
import Image from "next/image";

interface NavbarProps {
  session: Session | null;
}

const Navbar = ({ session }: NavbarProps) => {
  return (
    <nav className="bg-[rgba(252,176,38,1)] border-b border-gray-200 px-4 py-2 fixed top-0 w-full z-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logos/jcb-logo.png"
              alt="JCB Logo"
              width={75}
              height={24}
              className="h-6 w-auto"
              style={{ height: "auto" }}
            />
          </Link>
        </div>
        <div className="flex-1 flex justify-center">
          <span className="text-black font-bold text-xl">
            Scrap Data Dashboard
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/build-lookup"
            className="text-black hover:text-black/80 font-medium"
          >
            Build Lookup
          </Link>
          <div className="text-black text-sm font-medium">
            {session ? (
              <span>Signed in as Super Admin</span>
            ) : (
              <Link href="/api/auth/signin" className="hover:text-black/80">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
