"use client";
import { useState } from "react";
import { Home, BookOpen, BarChart, Settings, Menu } from "lucide-react";
import Link from "next/link";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    return (
        <aside
            className={`h-screen bg-gray-900 text-white fixed left-0 top-0 transition-all duration-300 z-40
                ${isOpen ? "w-64" : "w-20"}`}
        >
            {/* Button Toggle */}
            <button
                onClick={toggleSidebar}
                className="p-3 flex items-center gap-2 hover:bg-gray-700 w-full transition"
            >
                <Menu size={24} />
                {isOpen && <span className="text-lg">Menu</span>}
            </button>

            {/* Navigation Items */}
            <nav className="mt-4 flex flex-col space-y-2">
                <SidebarItem icon={<Home size={24} />} text="Home" href="/" isOpen={isOpen} />
                <SidebarItem icon={<BookOpen size={24} />} text="Reading Progress" href="/reading-progress" isOpen={isOpen} />
                <SidebarItem icon={<BarChart size={24} />} text="Leaderboard" href="/leaderboard" isOpen={isOpen} />
                <SidebarItem icon={<Settings size={24} />} text="Settings" href="/settings" isOpen={isOpen} />
            </nav>
        </aside>
    );
};

const SidebarItem = ({ icon, text, href, isOpen }) => {
    return (
        <Link
            href={href}
            className="flex items-center gap-4 p-3 hover:bg-gray-700 transition rounded-lg"
        >
            {icon}
            {isOpen && <span className="text-lg">{text}</span>}
        </Link>
    );
};

const Layout = ({ children }) => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="flex">
            <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

            {/* Main content bergerak ikut sidebar */}
            <main
                className={`flex-1 p-6 transition-all duration-300
                    ${isOpen ? "ml-64" : "ml-20"}`}
            >
                {children}
            </main>
        </div>
    );
};

export default Layout;
