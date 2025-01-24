"use client";

import { Session } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  session: Session | null;
}

const Sidebar = ({ session }: SidebarProps) => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: "Settings", path: "/settings" },
  ];

  if (!session) return null;

  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <div className="h-full px-3 py-4 overflow-y-auto">
        <ul className="space-y-2 font-medium">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 ${
                  isActive(item.path) ? "bg-gray-100" : ""
                }`}
              >
                <span className="ml-3">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="absolute bottom-0 w-64 bg-[#FFD100] py-4 px-3 border-t border-gray-200">
        <div className="text-center text-gray-900 text-sm font-medium">
          © {new Date().getFullYear()} JCB. All rights reserved.
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
