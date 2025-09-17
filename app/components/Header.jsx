"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase"; // your firebase config
import { useAuth } from "@/context/AuthContext";

// Bell Icon (same as before)
const BellIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
    />
  </svg>
);

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuth(); // custom hook returns logged-in user
  const [open, setOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/promotions" },
    { name: "Products", href: "/products" },
    { name: "Campaigns", href: "/campaigns" },
  ];

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
 console.log("User in Header:", user.user);
  return (
    <header className="sticky top-4 inset-x-4 z-50 mx-auto max-w-7xl bg-white/70 backdrop-blur-lg rounded-xl shadow-lg ring-1 ring-black/5">
      <div className="flex items-center justify-between p-4">
        {/* Logo + Nav Links */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/favicon.ico"
              alt="Logo"
              width={46}
              height={46}
              className="rounded-full"
            />
            <span className="text-xl font-bold text-gray-800">Retail Hub</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-300 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-5">
          <BellIcon className="w-6 h-6 text-gray-500 hover:text-gray-900 transition-colors" />

          {!user ? (
            <button
              onClick={() => router.push("/login")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg"
            >
              Login
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center focus:outline-none"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-offset-2 ring-blue-500">
                  <Image
                    src={user.photoURL || "/default-profile.png"}
                    alt="User Profile"
                    width={36}
                    height={36}
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="flex flex-col items-center p-4">
                    <Image
                      src={user.user.photoURL || "/default-profile.png"}
                      alt="Profile"
                      width={72}
                      height={72}
                      className="rounded-full mb-2"
                      unoptimized
                    />
                    <span className="font-semibold text-lg text-gray-800">
                      {user.displayName || "User"}
                    </span>
                    <span className="text-sm text-gray-500">{user.email}</span>
                  </div>
                  <div className="border-t px-4 py-2">
                    <button
                      onClick={() => router.push("/dashboard")}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded mb-2 transition"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded transition"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
